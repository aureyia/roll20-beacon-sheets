export type LimitedRange<Floor extends number, Ceiling extends number> = number & {
  ___brand: [Floor, Ceiling];
};