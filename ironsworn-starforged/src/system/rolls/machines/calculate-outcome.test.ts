import { createActor, waitFor } from 'xstate';
import { machine } from './calculate-outcome';
import { describe, test, expect, vi } from 'vitest';
import {
  loadOutcomes,
  saveOutcomes,
  saveTestOutcomes,
  getOutcomeKey,
  compare,
} from '@/system/rolls/machines/test-helper/snapshots';
import * as exports from '@/utility/sendRollToChat';

const outcomes = loadOutcomes();
const regenerate = process.env.REGENERATE === 'true';

describe('calculate-outcome-machine', () => {
  const newOutcomes = {};

  test('snapshots', async () => {
    for (const l1 in new Array(10).fill(0)) {
      const challengeDie1 = Number(l1) + 1;
      for (const l2 in new Array(10).fill(0)) {
        const challengeDie2 = Number(l2) + 1;
        for (const l3 in new Array(10).fill(0)) {
          const momentum = Number(l3) + 1;
          for (const l4 in new Array(10).fill(0)) {
            const actionScore = Number(l4) + 1;
            for (const l5 in new Array(2).fill(0)) {
              const burn = Number(l5) === 0;
              const name = `${challengeDie1}-${challengeDie2}-${momentum}-${actionScore}-${burn}`;

              // test(name, async () => {
              const sendRollToChat = vi
                .spyOn(exports, 'sendRollToChat')
                .mockImplementation(async () => {});
              const actor = createActor(machine);

              let outcome: string | undefined = undefined;
              let burnOutcome = false;

              actor.subscribe((snapshot) => {
                outcome = snapshot.context.previousOutcome;
                const eligibleMatched =
                  snapshot.matches('Eligible for Opportunity') ||
                  snapshot.matches('Hitting: Eligible for Strong Hit') ||
                  snapshot.matches('Missing: Eligible for Strong Hit') ||
                  snapshot.matches('Eligible for Weak Hit');
                if (eligibleMatched) {
                  burnOutcome = burn;

                  actor.send({
                    type: 'burnChoice',
                    value: burn,
                  });
                }
              });

              actor.start();

              const eventParams = {
                name: name,
                character: {
                  name: 'Ayla',
                  id: 'ABC123',
                },
                challengeDie1: challengeDie1,
                challengeDie2: challengeDie2,
                actionDie: {
                  value: 1,
                  negated: false,
                },
                actionScore: actionScore,
                momentum: momentum,
              };

              actor.send({
                type: 'params',
                value: eventParams,
              });

              const key = getOutcomeKey({
                challengeDie1,
                challengeDie2,
                momentum,
                actionScore,
                burn,
              });

              const sendRollToChatParams: any = {
                param1: eventParams.character.id,
                data: {
                  type: 'move-compact',
                  parameters: {
                    characterName: eventParams.character.name,
                    title: `Rolling ${eventParams.name}`,
                    dice: {
                      challengeDie1: eventParams.challengeDie1,
                      challengeDie2: eventParams.challengeDie2,
                      actionDie: eventParams.actionDie,
                    },
                    outcome: outcome,
                    score: eventParams.actionScore,
                    burnedMomentum: burnOutcome,
                  },
                },
              };

              newOutcomes[key] = sendRollToChatParams;

              actor.stop();
            }
          }
        }
      }
    }

    if (regenerate) {
      saveOutcomes(newOutcomes);
    } else {
      saveTestOutcomes(newOutcomes);
      const result = compare()
      expect(result).toEqual('No differences found.')
    }
  });
});
