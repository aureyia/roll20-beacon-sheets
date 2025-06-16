import handlebars from 'handlebars'

import * as partials from './partials'
import * as templates from './templates'
import * as expressions from './expressions'
import * as system from './system'

// Re-usable handlebars HTML partials.
handlebars.registerPartial('wrapper', partials.wrapper)
handlebars.registerPartial('rollComponents', partials.rollComponents)

// Starforged handlebars HTML partials
handlebars.registerPartial('characterRollHeader', partials.characterRollHeader)
handlebars.registerPartial(
    'compactCharacterRollHeader',
    partials.compactCharacterRollHeader
)
handlebars.registerPartial('actionScore', partials.actionScore)
handlebars.registerPartial('compactActionScore', partials.compactActionScore)
handlebars.registerPartial('rollOutcome', partials.rollOutcome)
handlebars.registerPartial('compactRollOutcome', partials.compactRollOutcome)
handlebars.registerPartial(
    'compactMomentumBurned',
    partials.compactMomentumBurned
)
handlebars.registerPartial('challengeDice', partials.challengeDice)
handlebars.registerPartial(
    'compactChallengeDice',
    partials.compactChallengeDice
)
handlebars.registerPartial('successBg', partials.successBg)
handlebars.registerPartial('failBg', partials.failBg)
handlebars.registerPartial('challengeDieBg', partials.challengeDieBg)
handlebars.registerPartial('actionScoreBg', partials.actionScoreBg)
handlebars.registerPartial('actionDieBg', partials.actionDieBg)

// Common Helper functions for math/transformations
handlebars.registerHelper('sumComponents', expressions.sumComponents)
handlebars.registerHelper('getDice', expressions.getDice)
handlebars.registerHelper('isGreater', expressions.isGreater)
handlebars.registerHelper('isGreaterOrEqual', expressions.isGreaterOrEqual)
handlebars.registerHelper('isEqual', expressions.isEqual)
handlebars.registerHelper('isMatching', expressions.isMatching)
handlebars.registerHelper('isArray', expressions.isArray)
handlebars.registerHelper('capitalize', expressions.capitalize)
handlebars.registerHelper('not', v => !v)
handlebars.registerHelper('or', (a, b) => a || b)
handlebars.registerHelper('and', (a, b) => a && b)

handlebars.registerHelper('assign', function (varName, value, options) {
    options.data.root[varName] = value
})

handlebars.registerHelper(
    'assignActionScore',
    function (varName, value, options) {
        options.data.root[varName] = value.score
    }
)

// System Helper functions
handlebars.registerHelper('getChallengeDie', system.getChallengeDie)
handlebars.registerHelper('getActionDie', system.getActionDie)

const rollTemplates = {
    stat: handlebars.compile(templates.statRollTemplate),
    'stat-compact': handlebars.compile(templates.compactStatRollTemplate),
    task: handlebars.compile(templates.taskRollTemplate),
    move: handlebars.compile(templates.statRollTemplate),
    'move-compact': handlebars.compile(templates.compactStatRollTemplate),
}

// This corresponds to the data returned by Beacon when you ask it to roll dice for you.
// You may want to re-use this to simplify crafting your own templates.
export type DiceComponent = {
    /** The number of sides the die has */
    sides?: number
    /** The number of dice with the amount of sides */
    count?: number
    /** A string-based formula to roll, used instead of sides and count */
    rollFormula?: string
    /** The label to show where this came from, primarily used for static bonuses */
    label?: string
    /** The numerical value that is the number rolled on the dice, or the value of the bonus */
    value?: number
    /** Indicates whether or not to always show this component in the breakdown, even if it's 0 */
    alwaysShowInBreakdown?: boolean
    /** If a challenge die will indicate if the roll has been exceeded by the action score */
    exceeded?: boolean
}

// Generic params used by our 2 templates. These can be changed for your own templates.
type CommonParameters = {
    characterName?: string
    title: string
}

export type RollStat = {
    type: 'stat' | 'stat-compact' | 'move' | 'move-compact'
    parameters: CommonParameters & {
        dice: {
            challengeDie1: number
            challengeDie2: number
            actionDie: {
                value: number
                negated: boolean
            }
        }
        outcome: string
        score: number
        burnedMomentum: boolean
    }
}

export type RollTask = {
    type: 'task'
    parameters: CommonParameters & {
        dice: DiceComponent[]
        progress: number
    }
}

export type AnyRollTemplate = RollStat | RollTask

// Returns the final HTML for a given template using all the required data.
export const createRollTemplate = ({ type, parameters }: AnyRollTemplate) => {
    const template = rollTemplates[type]
    const rollTemplate = template(parameters)
    return rollTemplate
}
