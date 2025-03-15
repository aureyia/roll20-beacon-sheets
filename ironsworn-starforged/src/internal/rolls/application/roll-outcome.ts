import type { DiceComponent } from '@/rolltemplates/rolltemplates';
import { Effect, Context, Layer } from 'effect';

type Outcome = {
  outcome: string;
  dice: DiceComponent[];
};

type options = {
  example: boolean;
};

export class RollOutcome extends Context.Tag('RollOutcome')<
  RollOutcome,
  {
    readonly calculate: (score: number, dice: DiceComponent[]) => Effect.Effect<Outcome, Error>;
  }
>() {}

const getChallengeDiceValue = (dice: DiceComponent[]) =>
  dice.filter((die) => die.label?.startsWith('Challenge Die')).map((die) => die.value);

const updateExceededChallengeDie = (
  dice: DiceComponent[],
  die1Exceeded: boolean,
  die2Exceeded: boolean,
) =>
  dice.map((die) => {
    const dieLabel = die.label;
    const isDie1 = dieLabel === 'Challenge Die: 1';
    const isDie2 = dieLabel === 'Challenge Die: 2';

    if (isDie1 && die1Exceeded) {
      die.exceeded = true;
    } else if (isDie1 && !die1Exceeded) {
      die.exceeded = false;
    }

    if (isDie2 && die2Exceeded) {
      die.exceeded = true;
    } else if (isDie2 && !die2Exceeded) {
      die.exceeded = false;
    }

    return die;
  });

export const RollOutcomeLive = Layer.effect(
  RollOutcome,
  Effect.gen(function* () {
    return {
      calculate: 
        (score: number, dice: DiceComponent[]): Effect.Effect<Outcome, Error> => 
          Effect.gen(function* () {
            const [challengeDie1, challengeDie2] = getChallengeDiceValue(dice);

            if (!challengeDie1 || !challengeDie2) {
              return yield* Effect.fail(new Error('At least one Challenge Die is missing'));
            }

            if (challengeDie1 === challengeDie2) {
              if (score > challengeDie1) {
                return yield* Effect.succeed({
                  outcome: 'opportunity',
                  dice: updateExceededChallengeDie(dice, true, true),
                });
              } else {
                return yield* Effect.succeed({
                  outcome: 'complication',
                  dice: updateExceededChallengeDie(dice, false, false),
                });
              }
            } else {
              if (score > challengeDie1 && score > challengeDie2) {
                return yield* Effect.succeed({
                  outcome: 'strong-hit',
                  dice: updateExceededChallengeDie(dice, true, true),
                });
              } else if (score > challengeDie1) {
                return yield* Effect.succeed({
                  outcome: 'weak-hit',
                  dice: updateExceededChallengeDie(dice, true, false),
                });
              } else if (score > challengeDie2) {
                return yield* Effect.succeed({
                  outcome: 'weak-hit',
                  dice: updateExceededChallengeDie(dice, false, true),
                });
              } else {
                return yield* Effect.succeed({
                  outcome: 'miss',
                  dice: updateExceededChallengeDie(dice, false, false),
                });
              }
            }
          })
      }
    }
  )
)
