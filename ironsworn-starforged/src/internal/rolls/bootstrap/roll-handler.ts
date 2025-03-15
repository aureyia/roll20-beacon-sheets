import type { DiceComponent } from '@/rolltemplates/rolltemplates';
import { RollOutcome, RollOutcomeLive } from '../application/roll-outcome';
import { ActionScore, ActionScoreLive } from '../application/action-score';
import { Beacon, BeaconLive } from '../infrastructure/beacon';
import { Effect, Context, Layer } from 'effect';
import {
  actionDice,
  type RolledActionDie,
  type RolledChallengeDie,
  type RolledDie,
} from '@/system/dice';

type Outcome = {
  outcome: string;
  dice: DiceComponent[];
};

class RollHandler extends Context.Tag('RollHandler')<
  RollHandler,
  { readonly roll: (score: number) => Effect.Effect<Outcome, Error> }
>() {}

function getDieByLabel(
  dice: RolledDie[],
  label: 'Challenge Die: 1' | 'Challenge Die: 2',
): Effect.Effect<RolledChallengeDie, Error>;
function getDieByLabel(
  dice: RolledDie[],
  label: 'Action Die',
): Effect.Effect<RolledActionDie, Error>;
function getDieByLabel<T extends RolledDie>(
  dice: T[],
  label: T['label'],
): Effect.Effect<T, Error> {
  const die = dice.find((die): die is T => die.label === label);

  if (!die) {
    return Effect.fail(Error(`Could not find die with label: ${label}`));
  }

  return Effect.succeed(die);
}

const RollHandlerLive = Layer.effect(
  RollHandler,
  Effect.gen(function* () {
    const beacon = yield* Beacon;
    const rollOutcome = yield* RollOutcome;
    const actionScore = yield* ActionScore;

    return {
      roll: (score: number) =>
        Effect.gen(function* () {
          const rolledDice = yield* Effect.promise(() =>
            Effect.runPromise(beacon.roll(actionDice)),
          );
          const totalActionScore = yield* actionScore.calculate(
            rolledDice,
            score,
            null,
          );
          const challengeDie1 = yield* getDieByLabel(
            rolledDice,
            'Challenge Die: 1',
          );
          const challengeDie2 = yield* getDieByLabel(
            rolledDice,
            'Challenge Die: 2',
          );
          const actionDie = yield* getDieByLabel(rolledDice, 'Action Die');
          const outcome = Effect.runSync(
            rollOutcome.calculate(
              totalActionScore,
              challengeDie1,
              challengeDie2,
            ),
          );
          return {
            dice: [actionDie, ...outcome.dice],
            outcome: outcome.outcome,
          };
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
