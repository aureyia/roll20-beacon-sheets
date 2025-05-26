import { RollOutcome, RollOutcomeLive } from '@/system/rolls/roll-outcome';
import { ActionScore, ActionScoreLive } from '@/system/rolls/action-score';
import { Beacon, InvalidDie, BeaconLive } from '@/system/rolls/beacon';
import { Effect, Context, Layer, Either } from 'effect';
import { actionDice } from '@/system/rolls/dice';
import { getDieByLabel, DieNotFound } from '@/system/rolls/get-die-by-label';
import { type outcomeActor } from './machines/calculate-outcome';
import type { StateMachine, Actor } from 'xstate';

class ActionRollHandler extends Context.Tag('ActionRollHandler')<
  ActionRollHandler,
  {
    readonly roll: (
      actor: outcomeActor,
      modifier: number,
    ) => Effect.Effect<
      // {
      //   outcome: string;
      //   score: number;
      //   modifier: number;
      //   actionDie: {
      //     roll: number;
      //   };
      //   challengeDie1: {
      //     roll: number;
      //     exceeded: boolean;
      //   };
      //   challengeDie2: {
      //     roll: number;
      //     exceeded: boolean;
      //   };
      // },
      void,
      Error | InvalidDie | DieNotFound
    >;
  }
>() {}

const ActionRollHandlerLive = Layer.effect(
  ActionRollHandler,
  Effect.gen(function* () {
    const beacon = yield* Beacon;
    const actionScore = yield* ActionScore;

    return {
      roll: (actor, modifier) =>
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
              name: 'Hello',
              challengeDie1: challengeDie1.value,
              challengeDie2: challengeDie2.value,
              actionScore: totalActionScore,
              momentum: 10,
            },
          });
        }),
    };
  }),
);

const MainLive = ActionRollHandlerLive.pipe(
  Layer.provide(BeaconLive),
  Layer.provide(ActionScoreLive),
  Layer.provide(RollOutcomeLive),
);

export const roll = (actor: outcomeActor, modifier: number) =>
  Effect.provide(
    Effect.flatMap(ActionRollHandler, (handler) =>
      handler.roll(actor, modifier),
    ),
    MainLive,
  );
