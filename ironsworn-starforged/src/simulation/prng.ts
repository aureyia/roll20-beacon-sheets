import { Context, Effect, Layer } from 'effect';
import { createHash } from 'node:crypto';

export class Fuzzer extends Context.Tag('Fuzzer')<
  Fuzzer,
  {
    readonly next: () => number;
    readonly generateRandomNumber: (seed: string) => number;
  }
>() {}

export const FuzzerLive = Layer.effect(
  Fuzzer,
  Effect.gen(function* () {
    const LCG_CONSTANT = 48271 as const;
    const LCG_MOD = 2147483647 as const;

    return {
      next: () => 1,
      generateRandomNumber: (seed) => {
        const hash = createHash('sha256').update(seed).digest('hex');
        return (
          Number(
            (BigInt('0x' + hash) * BigInt(LCG_CONSTANT)) % BigInt(LCG_MOD),
          ) >>> 0
        );
      },
    };
  }),
);
