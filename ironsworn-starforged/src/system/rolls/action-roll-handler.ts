import { ActionScore, ActionScoreLive } from '@/system/rolls/action-score';
import { Beacon, InvalidDie, BeaconLive } from '@/system/rolls/beacon';
import { Effect, Context, Layer, Either } from 'effect';
import { actionDice } from '@/system/rolls/dice';
import { getDieByLabel, DieNotFound } from '@/system/rolls/get-die-by-label';
import { type OutcomeActor } from './machines/calculate-outcome';
import { initValues } from '@/external/sync';

class ActionRollHandler extends Context.Tag('ActionRollHandler')<
  ActionRollHandler,
  {
    readonly roll: (
      actor: OutcomeActor,
      modifier: number,
      momentum: number,
      rollName: string,
    ) => Effect.Effect<void, Error | InvalidDie | DieNotFound>;
  }
>() {}

const ActionRollHandlerLive = Layer.effect(
  ActionRollHandler,
  Effect.gen(function* () {
    const beacon = yield* Beacon;
    const actionScore = yield* ActionScore;

    return {
      roll: (actor, modifier, momentum, rollName) =>
        Effect.gen(function* () {
          const beaconResult = yield* Effect.either(beacon.roll(actionDice));
          console.log('beaconResult', beaconResult);

          if (Either.isLeft(beaconResult)) {
            const error = beaconResult.left;
            return yield* Effect.fail(error);
          }

          const rolledDice = beaconResult.right;
          const totalActionScore = yield* actionScore.calculate(
            rolledDice,
            modifier,
            momentum,
            null,
          );

          const transformedDice = yield* Effect.either(
            Effect.all({
              challengeDie1: getDieByLabel(rolledDice, 'Challenge Die: 1'),
              challengeDie2: getDieByLabel(rolledDice, 'Challenge Die: 2'),
              actionDie: getDieByLabel(rolledDice, 'Action Die'),
            }),
          );

          if (Either.isLeft(transformedDice)) {
            const error = transformedDice.left;
            return yield* Effect.fail(error);
          }

          const { challengeDie1, challengeDie2, actionDie } =
            transformedDice.right;

          actor.start();
          actor.send({
            type: 'params',
            value: {
              name: rollName,
              character: {
                name: initValues.character.name,
                id: initValues.character.id,
              },
              challengeDie1: challengeDie1.value,
              challengeDie2: challengeDie2.value,
              actionDie: {
                value: actionDie.value,
                negated: false,
              },
              actionScore: totalActionScore,
              momentum: momentum,
            },
          });
        }),
    };
  }),
);

const MainLive = ActionRollHandlerLive.pipe(
  Layer.provide(BeaconLive),
  Layer.provide(ActionScoreLive),
);

export const roll = (
  actor: OutcomeActor,
  modifier: number,
  momentum: number,
  rollName: string,
) =>
  Effect.provide(
    Effect.flatMap(ActionRollHandler, (handler) =>
      handler.roll(actor, modifier, momentum, rollName),
    ),
    MainLive,
  );
