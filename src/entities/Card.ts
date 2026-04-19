import { Suit, RANK_TO_VALUE } from "../utils/constants";

/**
 * Класс Card - представляет одну игральную карту
 * Хранит данные о карте, но не занимается отрисовкой
 */
export class Card {
  public readonly suit: Suit;
  public readonly rank: string;
  public readonly value: number;
  public isFaceUp: boolean;
  public isRemoved: boolean;

  // Позиция на экране
  public x: number = 0;
  public y: number = 0;

  // Индексы ряда и позиции в пирамиде
  public row: number = -1;
  public col: number = -1;

  constructor(suit: Suit, rank: string) {
    this.suit = suit;
    this.rank = rank;
    this.value = RANK_TO_VALUE[rank] || 0;
    this.isFaceUp = true;
    this.isRemoved = false;
  }

  /**
   * Проверка, является ли карта Королём (К)
   * Король удаляется одни, без пары
   */
  public isKing(): boolean {
    return this.rank === "K";
  }

  /**
   * Проверка, можно ли составить пару с другой картой
   * (сумма значений равна 13)
   */
  public canPairWith(other: Card): boolean {
    if (this.isRemoved || other.isRemoved) return false;
    if (this === other) return false;
    return this.value + other.value === 13;
  }

  /**
   * Строковое представление карты
   */
  public toString(): string {
    return `${this.rank}${this.suit}`;
  }
}
