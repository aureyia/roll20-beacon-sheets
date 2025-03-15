import type { DiceComponent } from '@/rolltemplates/rolltemplates';
import { Effect, Context, Layer } from 'effect';
import { UnknownException } from 'effect/Cause';
import { dispatchRef } from '@/relay/relay';
import {
  convertResultsToDice,
  formatDiceComponents,
} from '@/utility/rolls/convertResultsToDice';
import type { RolledDie, Die } from '@/system/dice';

export class Beacon extends Context.Tag('Beacon')<
  Beacon,
  {
    readonly roll: (
      dice: Die[],
    ) => Effect.Effect<RolledDie[], UnknownException>;
  }
>() {}

export const BeaconLive = Layer.effect(
  Beacon,
  Effect.gen(function* () {
    return {
      roll: (dice: Die[]) => {
        const formattedDice = formatDiceComponents(dice);

        return Effect.gen(function* () {
          const output = Effect.promise(() =>
            dispatchRef.value.roll({ rolls: formattedDice }),
          );
          return Effect.runSync(convertResultsToDice(dice, yield* output));
        });
      },
    };
  }),
);
