import type { RolledChallengeDie, EvaluatedChallengeDice } from '@/system/dice';
import { Effect, Context, Layer } from 'effect';

type Outcome = {
  outcome: string;
  dice: EvaluatedChallengeDice[];
};

export class RollOutcome extends Context.Tag('RollOutcome')<
  RollOutcome,
  {
    readonly calculate: (
      score: number,
      challengeDie1: RolledChallengeDie,
      challengeDie2: RolledChallengeDie,
    ) => Effect.Effect<Outcome, Error>;
  }
>() {}

const updateExceededChallengeDie = (
  challengeDie1: RolledChallengeDie,
  challengeDie2: RolledChallengeDie,
  die1Exceeded: boolean,
  die2Exceeded: boolean,
): Effect.Effect<EvaluatedChallengeDice[]> =>
  Effect.succeed([
    {
      sides: challengeDie1.sides,
      label: challengeDie1.label,
      value: challengeDie1.value,
      exceeded: die1Exceeded,
    },
    {
      sides: challengeDie2.sides,
      label: challengeDie2.label,
      value: challengeDie2.value,
      exceeded: die2Exceeded,
    },
  ]);

export const RollOutcomeLive = Layer.effect(
  RollOutcome,
  Effect.gen(function* () {
    return {
      calculate: (
        score: number,
        challengeDie1: RolledChallengeDie,
        challengeDie2: RolledChallengeDie,
      ): Effect.Effect<Outcome, Error> =>
        Effect.gen(function* () {
          if (challengeDie1.value === challengeDie2.value) {
            if (score > challengeDie1.value) {
              return yield* Effect.succeed({
                outcome: 'opportunity',
                dice: yield* updateExceededChallengeDie(
                  challengeDie1,
                  challengeDie2,
                  true,
                  true,
                ),
              });
            } else {
              return yield* Effect.succeed({
                outcome: 'complication',
                dice: yield* updateExceededChallengeDie(
                  challengeDie1,
                  challengeDie2,
                  false,
                  false,
                ),
              });
            }
          } else {
            if (score > challengeDie1.value && score > challengeDie2.value) {
              return yield* Effect.succeed({
                outcome: 'strong-hit',
                dice: yield* updateExceededChallengeDie(
                  challengeDie1,
                  challengeDie2,
                  true,
                  true,
                ),
              });
            } else if (score > challengeDie1.value) {
              return yield* Effect.succeed({
                outcome: 'weak-hit',
                dice: yield* updateExceededChallengeDie(
                  challengeDie1,
                  challengeDie2,
                  true,
                  false,
                ),
              });
            } else if (score > challengeDie2.value) {
              return yield* Effect.succeed({
                outcome: 'weak-hit',
                dice: yield* updateExceededChallengeDie(
                  challengeDie1,
                  challengeDie2,
                  false,
                  true,
                ),
              });
            } else {
              return yield* Effect.succeed({
                outcome: 'miss',
                dice: yield* updateExceededChallengeDie(
                  challengeDie1,
                  challengeDie2,
                  false,
                  false,
                ),
              });
            }
          }
        }),
    };
  }),
);
