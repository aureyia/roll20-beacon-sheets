export const isNumberBetween = (
  value: number,
  lowerBound: number,
  upperBound: number,
): boolean =>
  typeof value === 'number' && value >= lowerBound && value <= upperBound;
