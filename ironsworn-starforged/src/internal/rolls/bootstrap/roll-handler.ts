import type { DiceComponent } from '@/rolltemplates/rolltemplates';
import { RollOutcome, RollOutcomeLive } from '../application/roll-outcome';
import { ActionScore, ActionScoreLive } from '../application/action-score';
import { Beacon, BeaconLive } from '../infrastructure/beacon';
import { Effect, Context, Layer } from 'effect';
import { actionDice } from '@/system/dice';

type Outcome = {
  outcome: string;
  dice: DiceComponent[];
};

class RollHandler extends Context.Tag('RollHandler')<
  RollHandler,
  { readonly roll: (score: number) => Effect.Effect<Outcome, Error> }
>() {}

const RollHandlerLive = Layer.effect(
  RollHandler,
  Effect.gen(function* () {
    const beacon = yield* Beacon;
    const rollOutcome = yield* RollOutcome;
    const actionScore = yield* ActionScore;

    return {
      roll: (score: number) =>
        Effect.gen(function* () {
          const rolledDice = Effect.promise(() => Effect.runPromise(beacon.roll(actionDice)));
          const totalActionScore = actionScore.calculate(yield* rolledDice, score, null);
          return Effect.runSync(rollOutcome.calculate(yield* totalActionScore, yield* rolledDice));
        }),
    };
  }),
);

const MainLive = RollHandlerLive.pipe(
  Layer.provide(BeaconLive),
  Layer.provide(ActionScoreLive),
  Layer.provide(RollOutcomeLive),
);

const rollOutput = (score: number) =>
  Effect.gen(function* () {
    const rollHandler = yield* RollHandler;
    return Effect.runPromise(rollHandler.roll(score));
  });

export const roll = (score: number) =>
  Effect.runPromise(Effect.provide(rollOutput(score), MainLive));
