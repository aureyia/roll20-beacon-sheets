import { Effect, Layer } from 'effect';
import { createActor } from 'xstate';
import { machine } from './machines/calculate-outcome';
import { Dispatch, DispatchError } from './dispatch';
// import { rollResults } from './mocks/example-roll';
import { describe, test, vi, expect } from 'vitest';
import { ActionScoreLive } from './action-score';
import { ActionRollLive, ActionRoll } from './action-roll';
import { RollFormatterLive } from './formatter';
import * as exports from '@/utility/sendRollToChat';


const rollResults = {}

export const DispatchTest = Layer.effect(
  Dispatch,
  Effect.gen(function* () {
    return {
      roll: (dice) =>
        Effect.gen(function* () {
          return yield* Effect.tryPromise({
            try: async () => rollResults,
            catch: (e) =>
              new DispatchError({
                cause: e,
                message: 'Dispatch roll failed.',
              }),
          });
        }),
    };
  }),
);

const FormatAndRoll = RollFormatterLive.pipe(Layer.provide(DispatchTest));
const MainTest = ActionRollLive.pipe(
  Layer.provide(FormatAndRoll),
  Layer.provide(ActionScoreLive),
);

export const roll = (
  actor: OutcomeActor,
  modifier: number,
  momentum: number,
  rollName: string,
) =>
  Effect.provide(
    Effect.flatMap(ActionRoll, (actionRoll) =>
      actionRoll.roll(actor, modifier, momentum, rollName),
    ),
    MainTest,
  );

describe('ActionRoll', () => {
  test('nom', () => {
    const sendRollToChat = vi
      .spyOn(exports, 'sendRollToChat')
      .mockImplementation(async () => {
        console.log('sendRollToChat: I got called WTF');
      });

    const actor = createActor(machine);

    actor.subscribe((snapshot) => {
      const eligibleMatched =
        snapshot.matches('Eligible for Opportunity') ||
        snapshot.matches('Hitting: Eligible for Strong Hit') ||
        snapshot.matches('Missing: Eligible for Strong Hit') ||
        snapshot.matches('Eligible for Weak Hit');
      if (eligibleMatched) {
        actor.send({ type: 'burnChoice', value: true });
      }
    });

    Effect.runPromise(roll(actor, 2, 2, 'test')).then(() => {
      expect(sendRollToChat).toBeCalled();
    });

    actor.stop();
  });
});
