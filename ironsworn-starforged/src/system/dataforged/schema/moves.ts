import { Schema } from 'effect'
import { TypeId } from './assets'
import { DisplayWithTitle } from './generic'

const MOVE_OUTCOMES = {
    Miss: 0,
    'Weak Hit': 1,
    'Strong Hit': 2,
} as const

const move_outcome = Schema.Enums(MOVE_OUTCOMES)
const move_category_id = Schema.String.pipe(Schema.pattern(/^Starforged\/Moves\/[A-z_-]+$/))
const move_trigger = Schema.Struct({})

const move_outcome_info_fields = {
    $id: Schema.String,
    'Count as': Schema.optional(Schema.keyof(move_outcome)),
    Reroll: Schema.optional(Schema.String),
    'In Control': Schema.optional(Schema.Boolean),
    Text: Schema.String,
}

interface MoveOutcomeInfo extends Schema.Struct.Type<typeof move_outcome_info_fields> {
    readonly 'With a Match'?: MoveOutcomeInfo | undefined
}

const outcome_info = Schema.Struct({
    ...move_outcome_info_fields,
    'With a Match': Schema.optional(
        Schema.suspend((): Schema.Schema<MoveOutcomeInfo> => outcome_info)
    ),
})

const alter_momentum_burn = Schema.Struct({})
const alter_momentum_reset = Schema.Struct({})

export const alter_momentum = Schema.Struct({
    Burn: Schema.optional(Schema.Array(alter_momentum_burn)),
    Reset: Schema.optional(Schema.Array(alter_momentum_reset)),
})

interface MoveAlterOutcomeInfo extends Schema.Schema.Type<typeof move_alter_outcome_info> {}

const move_alter_outcome_info = Schema.Struct({
    $id: Schema.optional(Schema.String),
    'Count as': Schema.optional(Schema.keyof(move_outcome)),
    Reroll: Schema.optional(Schema.String),
    'In Control': Schema.optional(Schema.Boolean),
    Text: Schema.optional(Schema.String),
    'With a Match': Schema.optional(
        Schema.suspend((): Schema.Schema<MoveAlterOutcomeInfo> => move_alter_outcome_info)
    ),
})

const move_alter_outcomes = Schema.Struct({
    'Strong Hit': Schema.optional(move_alter_outcome_info),
    'Weak Hit': Schema.optional(move_alter_outcome_info),
    Miss: Schema.optional(move_alter_outcome_info),
})

const move_alter_fields = {
    $id: Schema.String.pipe(
        Schema.pattern(
            /^Starforged\/Moves\/[A-z_-]+\/[A-z_-]+\/Abilities\/[1-3]\/Alter_Moves\/[1-9][0-9]*$/
        )
    ),
    Moves: Schema.optional(Schema.NullOr(Schema.Array(Schema.suspend(() => move.fields.$id)))),
    Trigger: Schema.optional(move_trigger),
    Text: Schema.optional(Schema.String),
    Outcomes: Schema.optional(move_alter_outcomes),
}

export interface IMoveAlter extends Schema.Struct.Type<typeof move_alter_fields> {
    readonly Alters?: IMoveAlter['$id'] | undefined
}

const move_alter = Schema.Struct({
    ...move_alter_fields,
    Alters: Schema.optional(
        Schema.suspend((): Schema.Schema<IMoveAlter['$id']> => move_alter.fields.$id)
    ),
})

const outcomes = Schema.Struct({
    $id: Schema.String,
    'Strong Hit': outcome_info,
    'Weak Hit': outcome_info,
    Miss: outcome_info,
})

const move_fields = {
    $id: Schema.String.pipe(
        Schema.pattern(
            /^Starforged\/Moves\/([A-z_-]+|Assets\/[A-z_-]+\/[A-z_-]+\/Abilities\/[1-3])\/[A-z_-]+$/
        )
    ),
    Name: Schema.String,
    Asset: Schema.optional(TypeId),
    Category: move_category_id,
    'Progress Move': Schema.optional(Schema.Boolean),
    Trigger: move_trigger,
    Oracles: Schema.optional(Schema.Array(OracleId)),
    Outcomes: Schema.optional(outcomes),
    Display: DisplayWithTitle,
}

export interface Move extends Schema.Struct.Type<typeof move_fields> {
    readonly 'Variant of'?: Move['$id'] | undefined
}

export const move = Schema.Struct({
    ...move_fields,
    'Variant of': Schema.optional(
        Schema.suspend((): Schema.Schema<Move['$id']> => move.fields.$id)
    ),
})
