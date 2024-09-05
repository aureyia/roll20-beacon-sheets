import { dispatchRef } from '@/relay/relay';
import type { Dispatch } from '@roll20-official/beacon-sdk';
import type { DiceComponent } from '@/rolltemplates/rolltemplates';

type RollResults = {
  dice: Array<DiceComponent>;
};
// Adds together a series of dice and outputs the result. Beacon handles the dice rolling to ensure randomness.
export default async (
  dice: Array<DiceComponent>,
  customDispatch?: Dispatch,
): Promise<RollResults> => {
  const dispatch = customDispatch || (dispatchRef.value as Dispatch); // Need a different Relay instance when handling sheet-actions

  const rolls: any = {};
  for (const i in dice) {
    const die = dice[i];
    if (die.sides) {
      const sides = die.sides;
      const dieCount = die.count ?? 1;
      rolls[`dice-${i}`] = `${dieCount}d${sides}`;
    }
  }

  const rollResult = await dispatch.roll({ rolls });

  for (const rollTerm in rollResult.results) {
    const result = rollResult.results[rollTerm];
    const rollIndex = parseInt(rollTerm.split(`-`)[1]);
    const die = dice[rollIndex];
    die.value = result.results.result;
    if (!die.label) {
      die.label = result.results.expression;
    }

    /*
				This utilizes the Beacon results to split the formula into it's individual
				parts so that we don't need to write the formula parsing ourselves because
				it's a complicated thing that Beacon already has to do as it is lol
				*/
    if (die.rollFormula) {
      const rollParts: DiceComponent[] = [];
      const overallSum = die.value;
      let diceSum = 0;
      if (result.results.rolls) {
        for (const subDie of result.results.rolls) {
          const sum = subDie.results.reduce((sum, result) => sum + result, 0);
          diceSum += sum;
          const sublabel = `${subDie.dice}d${subDie.sides}`;
          rollParts.push({
            sides: subDie.sides,
            count: subDie.dice,
            value: sum,
            label: die.label ? `${die.label} [${sublabel}]` : sublabel,
          });
        }

        rollParts.push({
          label: `Manual Bonus`,
          value: overallSum - diceSum,
        });
      }

      dice.splice(rollIndex, 1, ...rollParts);
    }
  }

  return { dice };
};
