import { RollOutcome, RollOutcomeLive } from '@/system/rolls/roll-outcome';
import { RollFormatter, RollFormatterLive } from '@/system/rolls/formatter';
import { DispatchLive, Dispatch } from '@/system/rolls/dispatch';
import { Effect, Context, Layer } from 'effect';
import { challengeDice } from '@/system/rolls/dice';
import { getDieByLabel } from '@/system/rolls/get-die-by-label';

type ProgressRollResult = {
  outcome: string;
  progress: number;
  challengeDie1: {
    roll: number;
    exceeded: boolean;
  };
  challengeDie2: {
    roll: number;
    exceeded: boolean;
  };
};

class ProgressRollHandler extends Context.Tag('ProgressRollHandler')<
  ProgressRollHandler,
  {
    readonly roll: (
      progress: number,
    ) => Effect.Effect<ProgressRollResult, Error>;
  }
>() {}

const ProgressRollHandlerLive = Layer.effect(
  ProgressRollHandler,
  Effect.gen(function* () {
    const formatter = yield* RollFormatter;
    const rollOutcome = yield* RollOutcome;

    return {
      roll: (progress: number) =>
        Effect.gen(function* () {
          const rolledDice = yield* formatter.roll(challengeDice);
          const challengeDie1 = yield* getDieByLabel(
            rolledDice,
            'Challenge Die: 1',
          );
          const challengeDie2 = yield* getDieByLabel(
            rolledDice,
            'Challenge Die: 2',
          );

          const outcome = yield* rollOutcome.calculate(
            progress,
            challengeDie1,
            challengeDie2,
          );

          return {
            outcome: outcome.outcome,
            progress: progress,
            challengeDie1: {
              roll: outcome.challengeDie1.value,
              exceeded: outcome.challengeDie1.exceeded,
            },
            challengeDie2: {
              roll: outcome.challengeDie2.value,
              exceeded: outcome.challengeDie2.exceeded,
            },
          };
        }),
    };
  }),
);

const FormatAndRoll = RollFormatterLive.pipe(Layer.provide(DispatchLive));
const MainLive = ProgressRollHandlerLive.pipe(
  Layer.provide(FormatAndRoll),
  Layer.provide(RollOutcomeLive),
);

export const roll = (score: number) =>
  Effect.provide(
    Effect.flatMap(ProgressRollHandler, (handler) => handler.roll(score)),
    MainLive,
  );
