import { Beacon, BeaconLive } from '@/system/rolls/beacon';
import { Effect, Context, Layer } from 'effect';
import { oracleDie } from '@/system/rolls/dice';
import { getDieByLabel } from '@/system/rolls/get-die-by-label';

type OracleRollResult = {
  oracleDie: {
    roll: number;
  };
};

class OracleRoll extends Context.Tag('OracleRoll')<
  OracleRoll,
  { readonly roll: () => Effect.Effect<OracleRollResult, Error> }
>() {}

const OracleRollLive = Layer.effect(
  OracleRoll,
  Effect.gen(function* () {
    const beacon = yield* Beacon;

    return {
      roll: () =>
        Effect.gen(function* () {
          const rolledDice = yield* Effect.promise(() =>
            Effect.runPromise(beacon.roll(oracleDie)),
          );

          const die = yield* getDieByLabel(rolledDice, 'Oracle Die');

          return {
            oracleDie: {
              roll: die.value,
            },
          };
        }),
    };
  }),
);

const MainLive = OracleRollLive.pipe(Layer.provide(BeaconLive));

const rollOutput = () =>
  Effect.gen(function* () {
    const rollHandler = yield* OracleRoll;
    return Effect.runPromise(rollHandler.roll());
  });

export const roll = () =>
  Effect.runPromise(Effect.provide(rollOutput(), MainLive));
