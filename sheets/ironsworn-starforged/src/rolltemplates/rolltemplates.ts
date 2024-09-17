import handlebars from 'handlebars';

// @ts-ignore
import statRollTemplate from './templates/statRoll.hbs?raw';
// @ts-ignore
import taskRollTemplate from './templates/taskRoll.hbs?raw';
// @ts-ignore
import rollComponents from './partials/rollComponents.hbs?raw';
// @ts-ignore
import wrapper from './partials/wrapper.hbs?raw';
// @ts-ignore
import characterRollHeader from './partials/characterRollHeader.hbs?raw';
// @ts-ignore
import actionScore from './partials/actionScore.hbs?raw';
// @ts-ignore
import rollOutcome from './partials/rollOutcome.hbs?raw';
// @ts-ignore
import challengeDice from './partials/challengeDice.hbs?raw';
// @ts-ignore
import successBg from './partials/backgrounds/successBg.hbs?raw';
// @ts-ignore
import failBg from './partials/backgrounds/failBg.hbs?raw';
// @ts-ignore
import challengeDieBg from './partials/backgrounds/challengeDieBg.hbs?raw';
// @ts-ignore
import actionScoreBg from './partials/backgrounds/actionScoreBg.hbs?raw';
// @ts-ignore
import actionDieBg from './partials/backgrounds/actionDieBg.hbs?raw';

import { isGreater } from './expressions/isGreater.js';
import { isGreaterOrEqual } from './expressions/isGreaterOrEqual.js';
import { isEqual } from './expressions/isEqual.js';
import { sumComponents } from './expressions/sumComponents.js';
import { getDice } from './expressions/getDice.js';
import { isArray } from './expressions/isArray.js';
import { capitalize } from './expressions/capitalize.js';
import { calculateActionScore } from './expressions/calculateActionScore.js';
import { calculateOutcome } from './expressions/calculateOutcome.js';
import { getChallengeDie } from './expressions/getChallengeDie.js';
import { getActionDie } from './expressions/getActionDie.js';
import { isMatching } from './expressions/isMatching.js';

/* All custom chat templates (called "roll templates" are created at run-time through handlebars based on this config */

// Re-usable handlebars HTML partials.
handlebars.registerPartial('wrapper', wrapper);
handlebars.registerPartial('rollComponents', rollComponents);

// Starforged handlebars HTML partials
handlebars.registerPartial('characterRollHeader', characterRollHeader);
handlebars.registerPartial('actionScore', actionScore);
handlebars.registerPartial('rollOutcome', rollOutcome);
handlebars.registerPartial('challengeDice', challengeDice);
handlebars.registerPartial('successBg', successBg);
handlebars.registerPartial('failBg', failBg);
handlebars.registerPartial('challengeDieBg', challengeDieBg);
handlebars.registerPartial('actionScoreBg', actionScoreBg);
handlebars.registerPartial('actionDieBg', actionDieBg);

// Common Helper functions for math/transformations
handlebars.registerHelper('sumComponents', sumComponents);
handlebars.registerHelper('getDice', getDice);
handlebars.registerHelper('isGreater', isGreater);
handlebars.registerHelper('isGreaterOrEqual', isGreaterOrEqual);
handlebars.registerHelper('isEqual', isEqual);
handlebars.registerHelper('isMatching', isMatching);
handlebars.registerHelper('isArray', isArray);
handlebars.registerHelper('capitalize', capitalize);
handlebars.registerHelper('not', (v) => !v);
handlebars.registerHelper('or', (a, b) => a || b);
handlebars.registerHelper('and', (a, b) => a && b);

handlebars.registerHelper('assign', function(varName, value, options) {
  options.data.root[varName] = value;
});

handlebars.registerHelper('assignActionScore', function(varName, value, options) {
  options.data.root[varName] = value.score;
});

// Starforged Helper functions
handlebars.registerHelper('calculateActionScore', calculateActionScore);
handlebars.registerHelper('calculateOutcome', calculateOutcome);
handlebars.registerHelper('getChallengeDie', getChallengeDie);
handlebars.registerHelper('getActionDie', getActionDie);

const rollTemplates = {
  stat: handlebars.compile(statRollTemplate),
  task: handlebars.compile(taskRollTemplate),
};

// This corresponds to the data returned by Beacon when you ask it to roll dice for you.
// You may want to re-use this to simplify crafting your own templates.
export type DiceComponent = {
  /** The number of sides the die has */
  sides?: number;
  /** The number of dice with the amount of sides */
  count?: number;
  /** A string-based formula to roll, used instead of sides and count */
  rollFormula?: string;
  /** The label to show where this came from, primarily used for static bonuses */
  label?: string;
  /** The numerical value that is the number rolled on the dice, or the value of the bonus */
  value?: number;
  /** Indicates whether or not to always show this component in the breakdown, even if it's 0 */
  alwaysShowInBreakdown?: boolean;
};

// Generic params used by our 2 templates. These can be changed for your own templates.
type CommonParameters = {
  characterName?: string;
  title: string;
  subtitle?: string;
  keyValues?: Record<string, string | number | boolean>;
  traits?: string[];
  textContent?: string | string[];
};

export type RollStat = {
  type: 'stat';
  parameters: CommonParameters & {
    dice: DiceComponent[];
    label: string;
    value: number;
    momentum: number;
    modifier: number;
  };
};

export type RollTask = {
  type: 'task';
  parameters: CommonParameters & {
    dice: DiceComponent[];
    progress: number;
  }
}

export type AnyRollTemplate = RollStat | RollTask;

// Returns the final HTML for a given template using all the required data.
export const createRollTemplate = ({ type, parameters }: AnyRollTemplate) => {
  const template = rollTemplates[type];
  const rollTemplate = template(parameters);
  console.log(parameters)
  return rollTemplate;
};
