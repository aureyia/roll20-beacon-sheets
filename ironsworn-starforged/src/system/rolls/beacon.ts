import { Effect, Context, Layer } from 'effect';
import { UnknownException } from 'effect/Cause';
import { dispatchRef } from '@/external/relay';
import type { DiceComponent } from '@/system/rolls/rolltemplates/rolltemplates';
import type { RolledDie, Die } from '@/system/rolls/dice';

type AvailableDice = '1d6' | '1d10' | '1d100';
type FormattedRoll = {
  rolls: {
    'dice-0'?: AvailableDice;
    'dice-1'?: AvailableDice;
    'dice-2'?: AvailableDice;
  };
};
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

export const formatDieKey = (index: number) => `dice-${index}`;
export const formatDie = (dieCount: number, sides: number) =>
  `${dieCount}d${sides}`;

export type FormatDice = (
  dice: DiceComponent[],
  index?: number,
) => FormattedRoll['rolls'];
export const formatDiceComponents: FormatDice = (
  components: any,
  index = 0,
) => {
  if (components.length === index) {
    return {};
  }

  const { sides, count = 1 } = components[index];

  return {
    [formatDieKey(index)]: formatDie(count, sides),
    ...formatDiceComponents(components, index + 1),
  };
};

const isValidDie = (
  die: DiceComponent,
): die is Required<Pick<DiceComponent, 'sides' | 'label'>> =>
  die.sides !== undefined && die.label !== undefined;

export const convertResultsToDice = (
  dice: DiceComponent[],
  rollResults: any,
): Effect.Effect<RolledDie[], Error> => {
  if (!dice.every(isValidDie)) {
    return Effect.fail(Error('Dice from beacon do not meet criteria'));
  }

  return Effect.succeed(
    dice.map((die, index) => ({
      sides: die.sides,
      label: die.label,
      value: rollResults.results[formatDieKey(index)].results.result,
    })),
  );
};
