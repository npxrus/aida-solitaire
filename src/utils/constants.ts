/**
 * Размеры карт в пикселях
 */
export const CARD_WIDTH = 80;
export const CARD_HEIGHT = 112;

/**
 * Расстояние между картами
 */
export const CARD_OFFSET_X = 20;
export const CARD_OFFSET_Y = 30;

/**
 * Начальная позиция первой карты пирамиды (верхушка)
 */
export const PYRAMID_START_X = 512;
export const PYRAMID_START_Y = 150;

/**
 * Масти карт
 */
export const SUITS = ["♥", "♦", "♣", "♠"] as const;
export type Suit = (typeof SUITS)[number];

/**
 * Соответствие номиналов значениям для суммы 13
 */
export const RANK_TO_VALUE: Record<string, number> = {
  A: 1,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  "10": 10,
  J: 11,
  Q: 12,
  K: 13,
};

/**
 * Все возможные номиналы (порядок важен для генерации)
 */
export const RANKS = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
];
