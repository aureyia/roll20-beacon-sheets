import type { DiceComponent } from '@/rolltemplates/rolltemplates';
import { Effect, Context, Layer } from 'effect';
import { UnknownException } from 'effect/Cause';
import { dispatchRef } from '@/relay/relay';
import { convertResultsToDice, formatDiceComponents } from '@/utility/rolls/convertResultsToDice';

export class Beacon extends Context.Tag('Beacon')<
  Beacon,
  {
    readonly roll: (dice: DiceComponent[]) => Effect.Effect<DiceComponent[], UnknownException>;
  }
>() {}

export const BeaconLive = Layer.effect(
  Beacon,
  Effect.gen(function* () {
    return {
      roll: (dice: DiceComponent[]) => {
        const formattedDice = formatDiceComponents(dice);

        return Effect.gen(function* () {
          const output = Effect.promise(() => dispatchRef.value.roll({rolls: formattedDice}))
          return convertResultsToDice(dice, yield* output)
        })
      },
    };
  }),
);
