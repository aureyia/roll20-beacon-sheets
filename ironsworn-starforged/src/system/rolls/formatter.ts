import { Effect, Context, Layer, Data } from 'effect';
import type { DiceComponent } from '@/system/rolls/rolltemplates/rolltemplates';
import type { RolledDie, Die } from '@/system/rolls/dice';
import { Dispatch, DispatchError } from './dispatch';
import { assert } from '@/utility/assert';
import type { ParseError } from 'effect/ParseResult';
import type { DieKey } from './dispatch.schema';

type AvailableDice = '1d6' | '1d10' | '1d100';
type FormattedRoll = {
  rolls: {
    'dice-0'?: AvailableDice;
    'dice-1'?: AvailableDice;
    'dice-2'?: AvailableDice;
  };
};

export class InvalidDie extends Data.TaggedError('InvalidDie')<{
  message: string;
}> {}

export class InvalidDispatch extends Data.TaggedError('InvalidDispatch')<{
  message: string;
}> {}

export class RollFormatter extends Context.Tag('RollFormatter')<
  RollFormatter,
  {
    readonly roll: (
      dice: Die[],
    ) => Effect.Effect<
      RolledDie[],
      DispatchError | InvalidDie | InvalidDispatch | ParseError
    >;
  }
>() {}

export const RollFormatterLive = Layer.effect(
  RollFormatter,
  Effect.gen(function* () {
    const dispatch = yield* Dispatch;
    return {
      roll: (dice: Die[]) =>
        Effect.gen(function* () {
          let formattedDice: FormattedRoll['rolls'];
          let index = 0;

          const { sides, count = 1 } = dice[index] as DiceComponent;

          if (sides === undefined) {
            return yield* Effect.fail(
              new InvalidDie({ message: 'Die has no sides' }),
            );
          }

          formattedDice = {
            [formatDieKey(index)]: formatDie(count, sides),
            ...formatDiceComponents(dice, index + 1),
          };

          const output = yield* Effect.retry(dispatch.roll(formattedDice), {
            times: 3,
          });

          assert(output.results['dice-0'].results !== undefined)
          return dice.map((die, index) => ({
            sides: die.sides,
            label: die.label,
            value: output.results[formatDieKey(index)].results.result,
          }));
        }),
    };
  }),
);

const formatDieKey = (index: number): DieKey => `dice-${index}`;
const formatDie = (dieCount: number, sides: number) => `${dieCount}d${sides}`;
const formatDiceComponents = (
  components: DiceComponent[],
  index = 0,
): FormattedRoll['rolls'] => {
  if (components.length === index) {
    return {};
  }

  const { sides, count = 1 } = components[index];

  return {
    [formatDieKey(index)]: formatDie(count, sides),
    ...formatDiceComponents(components, index + 1),
  };
};
