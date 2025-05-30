import { Effect, Context, Layer, Data } from 'effect';
import { dispatchRef } from '@/external/vue.relay';
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

class DispatchError extends Data.TaggedError('DispatchError')<{
  cause?: unknown;
  message?: string;
}> {}

export class Beacon extends Context.Tag('Beacon')<
  Beacon,
  {
    readonly roll: (
      dice: Die[],
    ) => Effect.Effect<RolledDie[], DispatchError | InvalidDie>;
  }
>() {}

export const BeaconLive = Layer.effect(
  Beacon,
  Effect.gen(function* () {
    return {
      roll: (dice: Die[]) =>
        Effect.gen(function* () {
          const formattedDice = formatDiceComponents(dice);

          const output = yield* Effect.tryPromise({
            try: () => dispatchRef.value.roll({ rolls: formattedDice }),
            catch: (e) =>
              new DispatchError({
                cause: e,
                message: 'Dispatch roll failed.',
              }),
          });

          return yield* convertResultsToDice(dice, output);
        }),
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

export class InvalidDie extends Data.TaggedError('InvalidDie')<{
  message: string;
}> {}

export const convertResultsToDice = (
  dice: DiceComponent[],
  rollResults: any,
) => {
  const results = rollResults;

  if (!dice.every(isValidDie)) {
    return Effect.fail(
      new InvalidDie({ message: 'Dice from beacon do not meet criteria' }),
    );
  }

  return Effect.succeed(
    dice.map((die, index) => ({
      sides: die.sides,
      label: die.label,
      value: results.results[formatDieKey(index)].results.result,
    })),
  );
};
