import handlebars from 'handlebars'
import * as expressions from './expressions'
import * as partials from './partials'
import * as templates from './templates'

// Re-usable handlebars HTML partials.
handlebars.registerPartial('wrapper', partials.wrapper)
handlebars.registerPartial('rollComponents', partials.roll_components)

// Starforged handlebars HTML partials
handlebars.registerPartial('characterRollHeader', partials.character_roll_header)
handlebars.registerPartial('compactCharacterRollHeader', partials.compact_character_roll_header)
handlebars.registerPartial('actionScore', partials.action_score)
handlebars.registerPartial('compactActionScore', partials.compact_action_score)
handlebars.registerPartial('rollOutcome', partials.roll_outcome)
handlebars.registerPartial('compactRollOutcome', partials.compact_roll_outcome)
handlebars.registerPartial('compactMomentumBurned', partials.compact_momentum_burned)
handlebars.registerPartial('challengeDice', partials.challenge_dice)
handlebars.registerPartial('compactChallengeDice', partials.compact_challenge_dice)
handlebars.registerPartial('successBg', partials.success_bg)
handlebars.registerPartial('failBg', partials.fail_bg)
handlebars.registerPartial('challengeDieBg', partials.challenge_die_bg)
handlebars.registerPartial('actionScoreBg', partials.action_score_bg)
handlebars.registerPartial('actionDieBg', partials.action_die_bg)

// Common Helper functions for math/transformations
handlebars.registerHelper('sumComponents', expressions.sum_components)
handlebars.registerHelper('getDice', expressions.get_dice)
handlebars.registerHelper('isGreater', expressions.is_greater)
handlebars.registerHelper('isGreaterOrEqual', expressions.is_greater_or_equal)
handlebars.registerHelper('isEqual', expressions.is_equal)
handlebars.registerHelper('isMatching', expressions.is_matching)
handlebars.registerHelper('isArray', expressions.is_array)
handlebars.registerHelper('capitalize', expressions.capitalize)
handlebars.registerHelper('not', v => !v)
handlebars.registerHelper('or', (a, b) => a || b)
handlebars.registerHelper('and', (a, b) => a && b)

handlebars.registerHelper('assign', (name, value, options) => {
    options.data.root[name] = value
})

handlebars.registerHelper('assignActionScore', (name, value, options) => {
    options.data.root[name] = value.score
})

const templates_roll = {
    stat: handlebars.compile(templates.stat_roll_template),
    stat_compact: handlebars.compile(templates.compact_stat_roll_template),
    task: handlebars.compile(templates.task_roll_template),
    move: handlebars.compile(templates.stat_roll_template),
    move_compact: handlebars.compile(templates.compact_stat_roll_template),
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
    character_name?: string
    title: string
}

export type RollStat = {
    type: 'stat' | 'stat_compact' | 'move' | 'move_compact'
    parameters: CommonParameters & {
        dice: {
            challenge_die_1: number
            challenge_die_2: number
            action_die: {
                value: number
                negated: boolean
            }
        }
        outcome: string
        score: number
        momentum_burned: boolean
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
export const roll_template_create = ({ type, parameters }: AnyRollTemplate) =>
    templates_roll[type](parameters)
