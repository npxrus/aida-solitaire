import { Card } from "./Card";
import { SUITS, RANKS } from "../utils/constants";

/**
 * Класс Deck - управляет колодой карт
 * Генерация, перемешивание, выдача карт
 */
export class Deck {
  private cards: Card[] = [];
  private remaining: Card[] = [];

  constructor() {
    this.generate();
  }

  /**
   * Генерация стандартной колоды из 52 карт
   * 4 масти * 13 номиналов = 52 карты
   */
  private generate(): void {
    this.cards = [];
    for (const suit of SUITS) {
      for (const rank of RANKS) {
        this.cards.push(new Card(suit, rank));
      }
    }
    this.remaining = [...this.cards];
  }

  /**
   * Перемешивание колоды алгоритмом Фишера-Йетса
   * (Fisher-Yates shuffle) - обеспечивает равномерное распределение
   */
  public shuffle(): void {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
    this.remaining = [...this.cards];
  }

  /**
   * Сброс колоды к исходному состоянию (пересоздание + перемешивание)
   */
  public reset(): void {
    this.generate();
    this.shuffle();
  }

  /**
   * Взять следующую карту из колоды (для раздачи в пирамиду или в запас)
   * @returns Карта или null, если колода пуста
   */
  public draw(): Card | null {
    if (this.remaining.length === 0) return null;
    return this.remaining.shift()!;
  }

  /**
   * Получить все карты (для проверки)
   */
  public getAllCards(): Card[] {
    return [...this.cards];
  }

  /**
   * Получить количество оставшихся карт
   */
  public remainingCount(): number {
    return this.remaining.length;
  }

  /**
   * Получить карты для пирамиды (первые 28 карт после перемешивания)
   * @returns Массив из 28 карт
   */
  public getPyramidCards(): Card[] {
    const pyramidCards: Card[] = [];
    for (let i = 0; i < 28; i++) {
      const card = this.draw();
      if (card) pyramidCards.push(card);
    }
    return pyramidCards;
  }

  /**
   * Получить оставшиеся карты (колода запаса)
   * @returns Массив оставшихся карт (24 штуки после пирамиды)
   */
  public getStockCards(): Card[] {
    return [...this.remaining];
  }
}
