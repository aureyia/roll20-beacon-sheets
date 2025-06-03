import { Context, Effect, Layer } from 'effect';
import { createHash } from 'node:crypto';
import { Dispatch, DispatchError } from '../dispatch';

export const DispatchFuzz = Dispatch.of({
  roll: (dice) => Effect.succeed(fuzzedResults()),
});

const fuzzedResults = () => {};

export class Fuzzer extends Context.Tag('Fuzzer')<
  Fuzzer,
  {
    readonly next: () => number 
    readonly generateRandomNumber: (seed: string) => number
  }
>() {}

const FuzzerLive = Layer.effect(
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
            (BigInt('0x' + hash) * BigInt(LCG_CONSTANT)) %
              BigInt(LCG_MOD),
          ) >>> 0
        );
      }
    }
  })
);

export class PRNG {
  private LCG_CONSTANT = 48271 as const;
  private LCG_MOD = 2147483647 as const;
  private seed: string;

  constructor(seed: string) {
    this.seed = seed;
  }

  private generateRandomNumber = () => {
    const hash = createHash('sha256').update(this.seed).digest('hex');
    return (
      Number(
        (BigInt('0x' + hash) * BigInt(this.LCG_CONSTANT)) %
          BigInt(this.LCG_MOD),
      ) >>> 0
    );
  };
}

