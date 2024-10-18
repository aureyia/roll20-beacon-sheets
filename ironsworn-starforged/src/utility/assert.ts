export const assert = (predicate: any, context: any) => {
  if (!predicate) {
    throw new Error(`Assertion failed. Context: ${context}`);
  }
};
