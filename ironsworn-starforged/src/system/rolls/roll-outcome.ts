import type {
  RolledChallengeDie,
  EvaluatedChallengeDice,
} from '@/system/rolls/dice';
import { Effect, Context, Layer } from 'effect';

type Outcome = {
  outcome: string;
  challengeDie1: EvaluatedChallengeDice;
  challengeDie2: EvaluatedChallengeDice;
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

const updateChallengeDie = (
  challengeDie: RolledChallengeDie,
  dieExceeded: boolean,
): Effect.Effect<EvaluatedChallengeDice> =>
  Effect.succeed({
    sides: challengeDie.sides,
    label: challengeDie.label,
    value: challengeDie.value,
    exceeded: dieExceeded,
  });

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
                challengeDie1: yield* updateChallengeDie(challengeDie1, true),
                challengeDie2: yield* updateChallengeDie(challengeDie2, true),
              });
            } else {
              return yield* Effect.succeed({
                outcome: 'complication',
                challengeDie1: yield* updateChallengeDie(challengeDie1, false),
                challengeDie2: yield* updateChallengeDie(challengeDie2, false),
              });
            }
          } else {
            if (score > challengeDie1.value && score > challengeDie2.value) {
              return yield* Effect.succeed({
                outcome: 'strong-hit',
                challengeDie1: yield* updateChallengeDie(challengeDie1, true),
                challengeDie2: yield* updateChallengeDie(challengeDie2, true),
              });
            } else if (score > challengeDie1.value) {
              return yield* Effect.succeed({
                outcome: 'weak-hit',
                challengeDie1: yield* updateChallengeDie(challengeDie1, true),
                challengeDie2: yield* updateChallengeDie(challengeDie2, false),
              });
            } else if (score > challengeDie2.value) {
              return yield* Effect.succeed({
                outcome: 'weak-hit',
                challengeDie1: yield* updateChallengeDie(challengeDie1, false),
                challengeDie2: yield* updateChallengeDie(challengeDie2, true),
              });
            } else {
              return yield* Effect.succeed({
                outcome: 'miss',
                challengeDie1: yield* updateChallengeDie(challengeDie1, false),
                challengeDie2: yield* updateChallengeDie(challengeDie2, false),
              });
            }
          }
        }),
    };
  }),
);
