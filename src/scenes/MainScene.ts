// src/scenes/MainScene.ts
import * as Phaser from "phaser";
import { Deck } from "../entities/Deck";
import { Card } from "../entities/Card";
import {
  calculatePyramidPositions,
  isCardAccessible,
} from "../utils/pyramidLayout";
import { CARD_WIDTH, CARD_HEIGHT } from "../utils/constants";

export class MainScene extends Phaser.Scene {
  private deck!: Deck;
  private pyramidCards: Card[] = [];
  private cardSprites: Map<Card, Phaser.GameObjects.Container> = new Map(); // Связь карты с её визуальным объектом
  private removedFlags: boolean[] = []; // Массив флагов удалённых карт
  private positions: { x: number; y: number; row: number; col: number }[] = [];

  constructor() {
    super("MainScene");
  }

  preload(): void {
    console.log("preload: загрузка ресурсов");
  }

  create(): void {
    console.log("create: сцена создана");

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Фон
    this.add.rectangle(0, 0, width, height, 0x1a4d2a, 1).setOrigin(0, 0);

    const graphics = this.add.graphics();
    graphics.lineStyle(1, 0x2a6a3a, 0.3);
    for (let y = 0; y < height; y += 30) graphics.lineBetween(0, y, width, y);
    for (let x = 0; x < width; x += 30) graphics.lineBetween(x, 0, x, height);

    // ========== ИНИЦИАЛИЗАЦИЯ КОЛОДЫ И КАРТ ==========
    this.deck = new Deck();
    this.deck.shuffle();
    this.pyramidCards = this.deck.getPyramidCards();

    // Инициализируем флаги удаления (все false)
    this.removedFlags = new Array(this.pyramidCards.length).fill(false);

    // Рассчитываем позиции для всех карт
    this.positions = calculatePyramidPositions();

    // Присваиваем картам их позиции и индексы
    for (let i = 0; i < this.pyramidCards.length; i++) {
      const card = this.pyramidCards[i];
      const pos = this.positions[i];
      card.x = pos.x;
      card.y = pos.y;
      card.row = pos.row;
      card.col = pos.col;
    }

    // ========== ОТРИСОВКА КАРТ ==========
    this.drawPyramid();

    // ========== ОБРАБОТЧИК КЛИКОВ ==========
    // Добавляем интерактивность на всю сцену
    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      this.handleCardClick(pointer.x, pointer.y);
    });

    // ========== ТЕКСТОВАЯ ИНФОРМАЦИЯ ==========
    const remainingCount = this.pyramidCards.filter(
      (_, idx) => !this.removedFlags[idx],
    ).length;

    const debugText = this.add.text(
      width / 2,
      height - 50,
      `Аида — пасьянс "Пирамида"\n` +
        `Осталось карт: ${remainingCount}\n` +
        `Кликните по карте, чтобы выбрать`,
      {
        fontFamily: "Arial, sans-serif",
        fontSize: "18px",
        color: "#ffffff",
        align: "center",
        backgroundColor: "#000000aa",
        padding: { x: 20, y: 10 },
      },
    );
    debugText.setOrigin(0.5, 0.5);

    const infoText = this.add.text(
      10,
      10,
      `Размер: ${Math.floor(width)}x${Math.floor(height)}`,
      {
        fontFamily: "monospace",
        fontSize: "12px",
        color: "#aaaaaa",
      },
    );

    console.log("Пирамида отрисована, карт:", this.pyramidCards.length);
  }

  /**
   * Отрисовка или перерисовка пирамиды
   */
  private drawPyramid(): void {
    // Удаляем старые спрайты
    this.cardSprites.forEach((container) => {
      container.destroy();
    });
    this.cardSprites.clear();

    // Рисуем каждую карту, которая не удалена
    for (let i = 0; i < this.pyramidCards.length; i++) {
      if (this.removedFlags[i]) continue; // Пропускаем удалённые карты

      const card = this.pyramidCards[i];
      const container = this.createCardSprite(card);
      this.cardSprites.set(card, container);
    }
  }

  /**
   * Создаёт визуальное представление карты (прямоугольник + текст)
   * @param card - карта
   * @returns Container с графикой карты
   */
  private createCardSprite(card: Card): Phaser.GameObjects.Container {
    const container = this.add.container(card.x, card.y);

    // ===== ТЕНЬ (отдельный прямоугольник, смещённый вниз-вправо) =====
    const shadow = this.add.rectangle(
      4,
      4, // Смещение тени
      CARD_WIDTH,
      CARD_HEIGHT,
      0x000000,
      0.3, // Прозрачность 30%
    );

    // ===== ФОН КАРТЫ (белый прямоугольник) =====
    const bg = this.add.rectangle(0, 0, CARD_WIDTH, CARD_HEIGHT, 0xffffff, 1);
    bg.setStrokeStyle(2, 0x000000, 0.5);

    // Цвет текста в зависимости от масти
    const textColor =
      card.suit === "♥" || card.suit === "♦" ? "#cc0000" : "#000000";

    // Номинал карты (верхний левый угол)
    const rankText = this.add.text(
      -CARD_WIDTH / 2 + 8,
      -CARD_HEIGHT / 2 + 8,
      card.rank,
      {
        fontFamily: "Arial, sans-serif",
        fontSize: "20px",
        fontStyle: "bold",
        color: textColor,
      },
    );

    // Символ масти (большой по центру)
    const suitText = this.add.text(0, 0, card.suit, {
      fontFamily: "Arial, sans-serif",
      fontSize: "40px",
      color: textColor,
    });
    suitText.setOrigin(0.5, 0.5);

    // Номинал в нижнем правом углу (перевёрнутый)
    const rankTextBottom = this.add.text(
      CARD_WIDTH / 2 - 8,
      CARD_HEIGHT / 2 - 8,
      card.rank,
      {
        fontFamily: "Arial, sans-serif",
        fontSize: "20px",
        fontStyle: "bold",
        color: textColor,
      },
    );
    rankTextBottom.setOrigin(1, 1);

    // Добавляем всё в контейнер (сначала тень, потом фон, потом текст)
    container.add([shadow, bg, rankText, suitText, rankTextBottom]);

    // Делаем контейнер интерактивным (для подсветки при наведении)
    container.setSize(CARD_WIDTH, CARD_HEIGHT);
    container.setInteractive({ useHandCursor: true });

    // Подсветка при наведении (меняем цвет обводки фона)
    container.on("pointerover", () => {
      bg.setStrokeStyle(3, 0xffaa00, 1);
    });

    container.on("pointerout", () => {
      bg.setStrokeStyle(2, 0x000000, 0.5);
    });

    return container;
  }

  /**
   * Обработка клика по карте
   * @param clickX - X координата клика
   * @param clickY - Y координата клика
   */
  private handleCardClick(clickX: number, clickY: number): void {
    // Ищем карту, по которой кликнули
    let clickedCard: Card | null = null;

    for (const [card, container] of this.cardSprites.entries()) {
      // Получаем границы контейнера
      const bounds = container.getBounds();
      if (
        clickX >= bounds.x &&
        clickX <= bounds.x + bounds.width &&
        clickY >= bounds.y &&
        clickY <= bounds.y + bounds.height
      ) {
        clickedCard = card;
        break;
      }
    }

    if (!clickedCard) return;

    // Проверяем, доступна ли карта (ничего не лежит сверху)
    const cardIndex = this.pyramidCards.indexOf(clickedCard);
    const isAccessible = isCardAccessible(
      clickedCard.row,
      clickedCard.col,
      this.removedFlags,
      this.pyramidCards.length,
    );

    if (!isAccessible) {
      console.log(
        `Карта ${clickedCard.toString()} недоступна — над ней есть другие карты`,
      );
      // Визуальная обратная связь: красная рамка на секунду
      const container = this.cardSprites.get(clickedCard);
      if (container) {
        // Ищем фон (второй объект в контейнере, после тени)
        const bg = container.getAt(1) as Phaser.GameObjects.Rectangle;
        const originalColor = bg.strokeColor;
        const originalAlpha = bg.strokeAlpha;
        bg.setStrokeStyle(3, 0xff0000, 1);
        this.time.delayedCall(200, () => {
          bg.setStrokeStyle(2, originalColor, originalAlpha);
        });
      }
      return;
    }

    console.log(`Клик по карте: ${clickedCard.toString()} (доступна)`);

    // TODO: Шаг 6 — здесь будет логика поиска пары и удаления
    // Пока просто подсветим зелёным
    const container = this.cardSprites.get(clickedCard);
    if (container) {
      const bg = container.getAt(1) as Phaser.GameObjects.Rectangle;
      const originalColor = bg.strokeColor;
      const originalAlpha = bg.strokeAlpha;
      bg.setStrokeStyle(3, 0x00ff00, 1);
      this.time.delayedCall(300, () => {
        bg.setStrokeStyle(2, originalColor, originalAlpha);
      });
    }
  }

  update(): void {}
}
