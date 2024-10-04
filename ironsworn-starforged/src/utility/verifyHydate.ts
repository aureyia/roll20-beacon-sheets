export const isIterable = (x: unknown): x is any[] => Array.isArray(x) && x.length > 0;
