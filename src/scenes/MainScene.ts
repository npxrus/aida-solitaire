import * as Phaser from "phaser";
import { Deck } from "../entities/Deck";
import { Card } from "../entities/Card";

/**
 * Главная игровая сцена
 * Здесь будет отображаться пирамида карт и управление игрой
 */
export class MainScene extends Phaser.Scene {
  private deck!: Deck;
  private pyramidCards: Card[] = [];

  constructor() {
    super({ key: "MainScene" });
  }

  /**
   * preload - загрузка ресурсов (картинок, звуков)
   * Вызывается один раз перед create
   */
  preload(): void {
    console.log("[MainScene] preload: загрузка ресурсов");
  }

  /**
   * create - создание игровых объектов
   * Вызывается после preload
   */
  create(): void {
    console.log("[MainScene] create: сцена создана");

    // 1. Добавляем фон-сукно
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.add.rectangle(0, 0, width, height, 0x1a4d2a, 1).setOrigin(0, 0);

    // 2. Добавляем декоративные элементы
    const graphics = this.add.graphics();
    graphics.lineStyle(1, 0x2a6a3a, 0.3);

    for (let y = 0; y < height; y += 30) {
      graphics.lineBetween(0, y, width, y);
    }

    for (let x = 0; x < width; x += 30) {
      graphics.lineBetween(x, 0, x, height);
    }

    // ========== ТЕСТИРОВАНИЕ МОДЕЛИ ДАННЫХ ==========
    // Создаём и перемешиваем колоду
    this.deck = new Deck();
    this.deck.shuffle();

    console.log("=== ТЕСТИРОВАНИЕ МОДЕЛИ ДАННЫХ ===");
    console.log(`Всего карт в колоде: ${this.deck.getAllCards().length}`);

    // Берём карты для пирамиды
    this.pyramidCards = this.deck.getPyramidCards();
    console.log(`Карт в пирамиде: ${this.pyramidCards.length}`);

    // Показываем первые 5 карт пирамиды в консоли
    console.log("Первые 5 карт пирамиды:");
    this.pyramidCards.slice(0, 5).forEach((card, idx) => {
      console.log(` ${idx + 1}. ${card.toString()} (значение: ${card.value})`);
    });

    // Проверяем колоду запаса
    const stockCards = this.deck.getStockCards();
    console.log(`Карт в колоде запаса: ${stockCards.length}`);

    // Тестируем поиск пар
    if (this.pyramidCards.length >= 2) {
      const card1 = this.pyramidCards[0];
      const card2 = this.pyramidCards[1];
      console.log(
        `Могут ли ${card1.toString()} и ${card2.toString()} образовать пару? ${card1.canPairWith(card2)}`,
      );
      console.log(
        ` ${card1.value} + ${card2.value} = ${card1.value + card2.value}`,
      );
    }

    // Находим всех Королей в пирамиде
    const kings = this.pyramidCards.filter((c) => c.isKing());
    console.log(`Королей в пирамиде: ${kings.length}`);
    kings.forEach((k) => console.log(`  Король: ${k.toString()}`));

    // ========== КОНЕЦ ТЕСТИРОВАНИЯ ==========

    // 3. Добавляем заглушку - текст, чтобы убедиться, что сцена работает
    const debugText = this.add
      .text(
        width / 2,
        height / 2,
        `Аида — пасьянс "Пирамида"\n` +
          `Карт в пирамиде: ${this.pyramidCards.length}\n` +
          `Королей: ${kings.length}\n` +
          `Откройте консоль (F12) для деталей`,
        {
          fontFamily: "Arial, sans-serif",
          fontSize: "24px",
          color: "#ffffff",
          align: "center",
          backgroundColor: "#000000aa",
          padding: { x: 20, y: 10 },
        },
      )
      .setOrigin(0.5, 0.5);

    // 4. Добавляем информацию о разрешении экрана
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

    console.log("[MainScene] Сцена создана. Модель данных инициализирована");
  }

  /**
   * update - вызывается каждый кадр (60 раз в секунду)
   */
  update(): void {}
}
