import { createActor } from 'xstate';
import { machine } from './machines/calculate-outcome';
import { describe, test, expect, afterAll } from 'vitest';
import {
  loadOutcomes,
  saveOutcomes,
  getOutcomeKey,
} from '@/system/rolls/test-helper/snapshots';

const outcomes = loadOutcomes();
const regenerate = process.env.REGENERATE === 'true';

describe('calculate-outcome-machine', () => {
  const newOutcomes = {};

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
            test(`${challengeDie1}-${challengeDie2}-${momentum}-${actionScore}-${burn}`, () => {
              const actor = createActor(machine);
              const resultPromise = new Promise<string>((resolve, reject) => {
                actor.subscribe((snapshot) => {
                  if (snapshot.status === 'done') {
                    resolve(snapshot.value as string);
                  }
                });
              });

              actor.start();
              actor.send({
                type: 'params',
                value: {
                  challengeDie1: challengeDie1,
                  challengeDie2: challengeDie2,
                  actionScore: actionScore,
                  momentum: 10,
                },
              });

              const output = Effect.tryPromise({
                try: () => resultPromise,
                catch: (e) =>
                  new Error('State machine did not complete: ' + String(e)),
              });

              actor.subscribe((snapshot) => {
                output = snapshot.value;
              });

              actor.start();
              actor.send({
                type: 'burnChoice',
                value: burn,
              });

              const key = getOutcomeKey({
                challengeDice1,
                challengeDice2,
                momentum,
                actionScore,
                burn,
              });

              if (regenerate) {
                newOutcomes[key] = output;
              } else {
                const expected = outcomes[key];
                expect(output).toBe(expected);
              }
            });
          }
        }
      }
    }
  }
  afterAll(() => {
    if (regenerate) {
      saveOutcomes(newOutcomes);
    }
  });
});
