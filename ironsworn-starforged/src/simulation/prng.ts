import { Context, Effect, Layer } from 'effect';
import { sha256 } from '@noble/hashes/sha2.js';
import { utf8ToBytes, bytesToHex } from '@noble/hashes/utils';

export class PRNG extends Context.Tag('PRNG')<
  PRNG,
  {
    readonly generateRandomNumber: (seed: string, salt: string) => number;
  }
>() {}

export const PRNGLive = Layer.effect(
  PRNG,
  Effect.gen(function* () {
    const LCG_CONSTANT = 48271 as const;
    const LCG_MOD = 2147483647 as const;

    return {
      generateRandomNumber: (seed, salt) => {
        const hash = bytesToHex(sha256(utf8ToBytes(seed + salt)));
        return (
          Number(
            (BigInt('0x' + hash) * BigInt(LCG_CONSTANT)) % BigInt(LCG_MOD),
          ) >>> 0
        );
      },
    };
  }),
);

export const numberBetween = (
  seed: string,
  salt: string,
  min: number,
  max: number,
) =>
  Effect.gen(function* () {
    const prng = yield* PRNG;
    return (prng.generateRandomNumber(seed, salt) % (max - min + 1)) + min;
  }).pipe(Effect.provide(PRNGLive));
