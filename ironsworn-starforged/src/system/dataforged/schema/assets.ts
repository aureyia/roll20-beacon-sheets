import { Schema } from 'effect'
import { aliases, description, display_title, source } from './generic'
import { alter_momentum, move, move_alter } from './moves'
import { PlayerConditionMeter, Stat } from './stats'

export const asset_id = Schema.String.pipe(
    //TODO: Verify this regex
    Schema.pattern(/^Starforged\/Assets\/[A-z_-]+\/[A-z_-]+$/),
);

export const TypeId = Schema.String
const InputType = Schema.Enums({
    Text: 'Text',
    Select: 'Select',
    Number: 'Number',
    Clock: 'Clock',
} as const)

const OptionType = Schema.Enums({
    Stat: 'Stat',
    ConditionMeter: 'Condition Meter',
    String: 'String',
    Number: 'Number',
} as const)

const ClockType = Schema.Enums({
    Tension: 'Tension',
    Campaign: 'Campaign',
} as const)

const ClockSegments = Schema.Enums({
    Four: 4,
    Six: 6,
    Eight: 8,
    Ten: 10,
} as const)

const OptionStat = Schema.Struct({
    Type: Schema.Literal(OptionType.enums.Stat),
    Value: Stat,
})

const OptionMeter = Schema.Struct({
    Type: Schema.Literal(OptionType.enums.ConditionMeter),
    Value: PlayerConditionMeter,
})

const OptionNumber = Schema.Struct({
    Type: Schema.Literal(OptionType.enums.Number),
    Value: Schema.Number,
})

const OptionString = Schema.Struct({
    Type: Schema.Literal(OptionType.enums.String),
    Value: Schema.String,
})

const InputText = Schema.Struct({
    'Input Type': Schema.Literal(InputType.enums.Text),
})

const InputSelect = Schema.Struct({
    'Input Type': Schema.Literal(InputType.enums.Select),
    Sets: Schema.Array(
        Schema.Struct({
            Key: Schema.String,
            Type: OptionType,
        })
    ),
    Options: Schema.Array(
        Schema.Struct({
            $id: Schema.String,
            Set: Schema.Union(OptionStat, OptionMeter, OptionNumber, OptionString),
        })
    ),
})

const InputNumber = Schema.Struct({
    'Input Type': Schema.Literal(InputType.enums.Number),
    Min: Schema.Number,
    Max: Schema.NullOr(Schema.Number),
    Step: Schema.Literal(1),
    Value: Schema.Number,
})

const InputClock = Schema.Struct({
    'Input Type': Schema.Literal(InputType.enums.Clock),
    'Clock Type': ClockType,
    Segments: ClockSegments,
    Filled: Schema.Number,
})

const States = Schema.Struct({
    Name: Schema.String,
    Enabled: Schema.Boolean,
    'Disables asset': Schema.Boolean,
    Impact: Schema.Boolean,
    Permanent: Schema.Boolean,
})

const Usage = Schema.Struct({
    Shared: Schema.Boolean,
})
const Attachment = Schema.Struct({
    'Asset Types': Schema.Array(TypeId),
    Max: Schema.NullOr(Schema.Number),
})

const CONDITIONS = {
    Battered: 'Battered',
    Cursed: 'Cursed',
    OutOfAction: 'Out of Action',
    Wrecked: 'Wrecked',
} as const

const condition = Schema.Enums(CONDITIONS)

const ALIASES = {
    CompanionHealth: 'Companion Health',
    VehicleIntegrity: 'Vehicle Integrity',
    CommandVehicleIntegrity: 'Command Vehicle Integrity',
    SupportVehicleIntegrity: 'Support Vehicle Integrity',
    IncidentalVehicleIntegrity: 'Incidental Vehicle Integrity',
} as const

const alias = Schema.Enums(ALIASES)

const meter_condition = Schema.Struct({
    $id: Schema.String,
    Min: Schema.Literal(0),
    Conditions: Schema.Array(condition),
    Aliases: Schema.optional(Schema.Array(alias)),
})

// Assets Fields

const asset_fields_optional = {
    States: Schema.optional(States),
    Attachements: Schema.optional(Attachment),
    Inputs: Schema.optional(Schema.Union(InputText, InputSelect)),
    Requirement: Schema.optional(Schema.String),
    'Condition Meter': Schema.optional(meter_condition),
    Tags: Schema.optional(Schema.Array(Schema.String)),
}

const asset_fields = {
    ...asset_fields_optional,
    $id: Schema.String,
    Name: Schema.String,
    Display: display_title,
    'Asset Type': TypeId,
    Usage,
}

export interface Asset extends Schema.Struct.Type<typeof asset_fields> {
    readonly Abilities: readonly [Ability, Ability, Ability]
}

export const asset = Schema.Struct({
    ...asset_fields,
    Abilities: Schema.Tuple(
        Schema.suspend((): Schema.Schema<Ability> => ability),
        Schema.suspend((): Schema.Schema<Ability> => ability),
        Schema.suspend((): Schema.Schema<Ability> => ability)
    ),
})

export interface AssetAlter extends Schema.Struct.Type<typeof asset_alter_fields> {
    readonly Abilities?: readonly [Ability, Ability, Ability] | undefined
}

const asset_alter_fields = {
    ...asset_fields_optional,
    $id: Schema.optional(Schema.String),
    Name: Schema.optional(Schema.String),
    Display: Schema.optional(display_title),
    'Asset Type': Schema.optional(TypeId),
    Usage: Schema.optional(Usage),
}

const asset_alter = Schema.partial(
    Schema.Struct({
        ...asset_alter_fields,
        Abilities: Schema.Tuple(
            Schema.suspend((): Schema.Schema<Ability> => ability),
            Schema.suspend((): Schema.Schema<Ability> => ability),
            Schema.suspend((): Schema.Schema<Ability> => ability)
        ),
    })
)

// Abilities

const ability_fields = {
    $id: Schema.String,
    Name: Schema.optional(Schema.String),
    Moves: Schema.optional(move),
    Inputs: Schema.optional(Schema.Array(Schema.Union(InputNumber, InputClock, InputText))),
    'Alter Moves': Schema.optional(move_alter),
    'Alter Momentum': Schema.optional(alter_momentum),
    Enabled: Schema.Boolean,
}

export interface Ability extends Schema.Struct.Type<typeof ability_fields> {
    readonly 'Alter Properties'?: AssetAlter | undefined
}

const ability = Schema.Struct({
    ...ability_fields,
    'Alter Properties': Schema.optional(
        Schema.suspend((): Schema.Schema<AssetAlter> => asset_alter)
    ),
})

// Asset Categories

export const asset_category = Schema.extend(
    Schema.Struct({
        $id: TypeId,
        Source: source,
        Description: description,
        Assets: Schema.Array(asset),
        Name: Schema.String,
        Display: display_title,
        Usage: Usage,
    }),
    Schema.partial(aliases)
)
