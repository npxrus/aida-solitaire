import {
  CARD_WIDTH,
  CARD_HEIGHT,
  CARD_OFFSET_X,
  CARD_OFFSET_Y,
  PYRAMID_START_X,
  PYRAMID_START_Y,
} from "./constants";

/**
 * Интерфейс для позиции карты в пирамиде
 */
export interface CardPosition {
  x: number;
  y: number;
  row: number;
  col: number;
}

/**
 * Рассчитывает позиции для всех 28 карт пирамиды
 * @returns Массив позиций (индекс  соответствует порядку карт в массиве pyramidCards)
 */
export function calculatePyramidPositions(): CardPosition[] {
  const positions: CardPosition[] = [];
  let cardIndex = 0;

  // 7 рядов
  for (let row = 0; row < 7; row++) {
    const cardsInRow = row + 1;

    // Ширина ряда в пикселях
    const rowWidth = (cardsInRow - 1) * CARD_OFFSET_X + CARD_WIDTH;

    // Начальная X координата для центрирования ряда
    const startX = PYRAMID_START_X - rowWidth / 2;

    for (let col = 0; col < cardsInRow; col++) {
      const x = startX + col * CARD_OFFSET_X;
      const y = PYRAMID_START_Y + row * CARD_OFFSET_Y;

      positions.push({ x, y, row, col });

      cardIndex++;
    }
  }

  return positions;
}

/**
 * Проверяет, является ли карта доступной для клика
 * Карта доступна, если обе карты под ней (слева и справа в следующем ряду) удалены
 * @param row - ряд карты (0-6)
 * @param col - колонка карты в ряду
 * @param removedCards - массив флагов удалённых карт (по индексу)
 * @param totalCards - общее количество карт (28)
 */
export function isCardAccessible(
  row: number,
  col: number,
  removedCards: boolean[],
  totalCards: number,
): boolean {
  // Если карта уже удалена - недоступна
  const index = getCardIndex(row, col);
  if (removedCards[index]) return false;

  // Если это последний ряд (ряд 6) - доступна всегда
  if (row === 6) return true;

  // Проверяем две кнопки под ней
  const leftUnderIndex = getCardIndex(row + 1, col);
  const rightUnderIndex = getCardIndex(row + 1, col + 1);

  // Если хотя бы одна из нижних карт не удалена - текущая недоступна
  const leftExists = leftUnderIndex < totalCards;
  const rightExists = rightUnderIndex < totalCards;

  if (leftExists && !removedCards[leftUnderIndex]) return false;
  if (rightExists && !removedCards[rightUnderIndex]) return false;

  return true;
}

/**
 * Получить индекс карты в плоском массиве по её координатам в пирамиде
 */
function getCardIndex(row: number, col: number): number {
  // Сумма арифметической прогрессии: сумма чисел от 1 до row + col
  let index = 0;
  for (let i = 0; i < row; i++) {
    index += i + 1;
  }
  index += col;
  return index;
}
