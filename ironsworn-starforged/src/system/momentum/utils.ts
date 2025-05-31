export const momentumMax = (numberOfImpacts: number) =>
  numberOfImpacts > 10 ? 0 : 10 - numberOfImpacts;

export const momentumReset = (numberOfImpacts: number) =>
  numberOfImpacts === 1 ? 1 : numberOfImpacts >= 2 ? 0 : 2;
