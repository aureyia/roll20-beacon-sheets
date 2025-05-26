import { setup, assertEvent, type ActorRefFrom } from 'xstate';
import { sendRollToChat } from '@/utility/sendRollToChat';
import { initValues } from '@/external/relay';

type Outcome =
  | 'opportunity'
  | 'strong-hit'
  | 'weak-hit'
  | 'miss'
  | 'complication';
export type outcomeActor = ActorRefFrom<typeof machine>;
export const machine = setup({
  types: {
    context: {} as {
      burnedMomentum: boolean;
      name?: string;
      challengeDie1?: number;
      challengeDie2?: number;
      actionScore?: number;
      momentum?: number;
    },
    events: {} as
      | {
          type: 'burnChoice';
          value: boolean;
        }
      | {
          type: 'params';
          value: {
            name: string;
            challengeDie1: number;
            challengeDie2: number;
            actionScore: number;
            momentum: number;
          };
        },
  },
  actions: {
    showEligibiltyDialog: function ({ context, event }, params) {
      // Add your action code here
      // ...
    },
    resetMomentum: function ({ context, event }, params) {
      context.burnedMomentum = true;
      // Add your action code here
      // ...
    },
    saveParamsToContext: function ({ context, event }, params) {
      console.log('saveParamsToContext: event', event);
      assertEvent(event, 'params');
      context.actionScore = event.value.actionScore;
      context.challengeDie1 = event.value.challengeDie1;
      context.challengeDie2 = event.value.challengeDie2;
      context.momentum = event.value.momentum;
      context.name = event.value.name;
      console.log('saveParamsToContext: context', context);
    },
    sendOutcomeToChat: async function (
      { context, event },
      params: { outcome: Outcome },
    ) {
      console.log('params', params);
      console.log('context', context);
      if (
        !context.name ||
        !context.actionScore ||
        !context.challengeDie1 ||
        !context.challengeDie2 ||
        context.burnedMomentum === undefined
      ) {
        throw new Error('Missing context for sendOutcomeToChat');
      }
      console.log('context.burnedMomentum', context.burnedMomentum);
      await sendRollToChat(initValues.character.id, {
        type: 'move-compact',
        parameters: {
          characterName: initValues.character.name,
          title: `Rolling ${context.name}`,
          dice: {
            challengeDie1: context.challengeDie1,
            challengeDie2: context.challengeDie2,
            // TODO: Support passing action die
            // actionDie: context.challengeDie1
          },
          outcome: params.outcome,
          score: context.actionScore,
          burnedMomentum: context.burnedMomentum,
        },
      });
      context.burnedMomentum = false;
    },
  },
  guards: {
    challengeDiceMatch: function ({ context }) {
      return context.challengeDie1 === context.challengeDie2;
    },
    exceedsBoth: function ({ context }) {
      if (
        !context.actionScore ||
        !context.challengeDie1 ||
        !context.challengeDie2
      ) {
        throw new Error('Missing context for sendOutcomeToChat');
      }

      return (
        context.actionScore > context.challengeDie1 &&
        context.actionScore > context.challengeDie2
      );
    },
    momentumExceedsBoth: function ({ context }) {
      if (
        !context.momentum ||
        !context.challengeDie1 ||
        !context.challengeDie2
      ) {
        throw new Error('Missing context for momentumExceedsBoth');
      }

      return (
        context.momentum > context.challengeDie1 &&
        context.momentum > context.challengeDie2
      );
    },
    choseToBurn: function ({ event }) {
      console.log(event, 'burnChoice');
      assertEvent(event, 'burnChoice');
      return event.value;
    },
    exceedsOne: function ({ context }) {
      if (
        !context.actionScore ||
        !context.challengeDie1 ||
        !context.challengeDie2
      ) {
        throw new Error('Missing context for exceedsOne');
      }

      return (
        context.actionScore > context.challengeDie1 ||
        context.actionScore > context.challengeDie2
      );
    },
    momentumExceedsOne: function ({ context }) {
      if (
        !context.momentum ||
        !context.challengeDie1 ||
        !context.challengeDie2
      ) {
        throw new Error('Missing context for momentumExceedsOne');
      }

      return (
        context.momentum > context.challengeDie1 ||
        context.momentum > context.challengeDie2
      );
    },
  },
}).createMachine({
  context: {
    burnedMomentum: false,
  },
  id: 'calculateOutcome',
  initial: 'waiting for params',
  states: {
    'waiting for params': {
      on: {
        params: {
          target: 'calculating',
          actions: {
            type: 'saveParamsToContext',
          },
        },
      },
    },
    calculating: {
      always: [
        {
          target: 'Matched',
          guard: {
            type: 'challengeDiceMatch',
          },
        },
        {
          target: 'Not Matched',
        },
      ],
    },
    Matched: {
      always: [
        {
          target: 'Opportunity',
          guard: {
            type: 'exceedsBoth',
          },
        },
        {
          target: 'Eligible for Opportunity',
          guard: {
            type: 'momentumExceedsBoth',
          },
        },
        {
          target: 'Complication',
        },
      ],
    },
    'Not Matched': {
      always: [
        {
          target: 'Strong Hit',
          guard: {
            type: 'exceedsBoth',
          },
        },
        {
          target: 'Hitting',
          guard: {
            type: 'exceedsOne',
          },
        },
        {
          target: 'Missing',
        },
      ],
    },
    Opportunity: {
      always: {
        target: 'waiting for params',
      },
      exit: {
        type: 'sendOutcomeToChat',
        params: {
          outcome: 'opportunity',
        },
      },
    },
    'Eligible for Opportunity': {
      on: {
        burnChoice: [
          {
            target: 'Opportunity',
            actions: {
              type: 'resetMomentum',
            },
            guard: {
              type: 'choseToBurn',
            },
          },
          {
            target: 'Complication',
          },
        ],
      },
      entry: {
        type: 'showEligibiltyDialog',
        params: {
          burn: 'Strong Hit',
          current: 'Complication',
        },
      },
    },
    Complication: {
      always: {
        target: 'waiting for params',
      },
      exit: {
        type: 'sendOutcomeToChat',
        params: {
          outcome: 'complication',
        },
      },
    },
    'Strong Hit': {
      always: {
        target: 'waiting for params',
      },
      exit: {
        type: 'sendOutcomeToChat',
        params: {
          outcome: 'strong-hit',
        },
      },
    },
    Hitting: {
      always: [
        {
          target: 'Hitting: Eligible for Strong Hit',
          guard: {
            type: 'momentumExceedsBoth',
          },
        },
        {
          target: 'Weak Hit',
        },
      ],
    },
    Missing: {
      always: [
        {
          target: 'Missing: Eligible for Strong Hit',
          guard: {
            type: 'momentumExceedsBoth',
          },
        },
        {
          target: 'Eligible for Weak Hit',
          guard: {
            type: 'momentumExceedsOne',
          },
        },
        {
          target: 'Miss',
        },
      ],
    },
    'Hitting: Eligible for Strong Hit': {
      on: {
        burnChoice: [
          {
            target: 'Strong Hit',
            actions: {
              type: 'resetMomentum',
            },
            guard: {
              type: 'choseToBurn',
            },
          },
          {
            target: 'Weak Hit',
          },
        ],
      },
      entry: {
        type: 'showEligibiltyDialog',
        params: {
          burn: 'Strong Hit',
          current: 'Weak Hit',
        },
      },
    },
    'Weak Hit': {
      always: {
        target: 'waiting for params',
      },
      exit: {
        type: 'sendOutcomeToChat',
        params: {
          outcome: 'weak-hit',
        },
      },
    },
    'Missing: Eligible for Strong Hit': {
      on: {
        burnChoice: [
          {
            target: 'Strong Hit',
            actions: {
              type: 'resetMomentum',
            },
            guard: {
              type: 'choseToBurn',
            },
          },
          {
            target: 'Miss',
          },
        ],
      },
      entry: {
        type: 'showEligibiltyDialog',
        params: {
          burn: 'Strong Hit',
          current: 'Miss',
        },
      },
    },
    'Eligible for Weak Hit': {
      on: {
        burnChoice: [
          {
            target: 'Weak Hit',
            actions: {
              type: 'resetMomentum',
            },
            guard: {
              type: 'choseToBurn',
            },
          },
          {
            target: 'Miss',
          },
        ],
      },
      entry: {
        type: 'showEligibiltyDialog',
        params: {
          burn: 'Weak Hit',
          current: 'Miss',
        },
      },
    },
    Miss: {
      always: {
        target: 'waiting for params',
      },
      exit: {
        type: 'sendOutcomeToChat',
        params: {
          outcome: 'miss',
        },
      },
    },
  },
});
