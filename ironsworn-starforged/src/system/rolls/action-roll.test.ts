// import { Effect, Layer } from "effect"
// import { createActor } from "xstate"
// import { machine } from "./machines/calculate-outcome"
// import { Dispatch } from "./dispatch"
// import { rollResults } from "./mocks/example-roll"
import { describe, test, vi, expect } from 'vitest';
import { ActionScoreLive } from './action-score';
// import { ActionRollLive, ActionRoll } from './action-roll'
import { RollFormatterLive } from './formatter';

// export const DispatchTest = Dispatch.of({''s
//   roll: (dice) => Effect.succeed(rollResults)
// })

// const FormatAndRoll = RollFormatterLive.pipe(Layer.provide(DispatchTest));
// const MainTest = ActionRollLive.pipe(
//   Layer.provide(FormatAndRoll),
//   Layer.provide(ActionScoreLive),
// );

// export const roll = (
//   actor: OutcomeActor,
//   modifier: number,
//   momentum: number,
//   rollName: string,
// ) =>
//   Effect.provide(
//     Effect.flatMap(ActionRoll, (actionRoll) =>
//       actionRoll.roll(actor, modifier, momentum, rollName),
//     ),
//     MainTest,
//   );

describe('ActionRoll', () => {
  test('nom', () => {
    // const sendRollToChat = vi
    //   .spyOn(exports, 'sendRollToChat')
    //   .mockImplementation(async () => {});
    // const actor = createActor(machine);
    // roll(actor,2,2,'test')
    // expect(sendRollToChat).toBeCalled()
  });
});
