import { Schema } from 'effect'
import { Aliases, Description, DisplayWithTitle, Source } from './generic'
import { AlterMomentum, AlterMove, AlterProperties, Move } from './moves'
import { PlayerConditionMeter, Stat } from './stats'

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

const Ability = Schema.Struct({
    $id: Schema.String,
    Name: Schema.optional(Schema.String),
    Moves: Schema.optional(Move),
    Inputs: Schema.optional(Schema.Array(Schema.Union(InputNumber, InputClock, InputText))),
    'Alter Moves': Schema.optional(AlterMove),
    'Alter Properties': Schema.optional(AlterProperties),
    'Alter Momentum': Schema.optional(AlterMomentum),
    Enabled: Schema.Boolean,
})

const MeterCondition = Schema.Enums({
    Battered: 'Battered',
    Cursed: 'Cursed',
    OutOfAction: 'Out of Action',
    Wrecked: 'Wrecked',
} as const)

const MeterAlias = Schema.Enums({
    CompanionHealth: 'Companion Health',
    VehicleIntegrity: 'Vehicle Integrity',
    CommandVehicleIntegrity: 'Command Vehicle Integrity',
    SupportVehicleIntegrity: 'Support Vehicle Integrity',
    IncidentalVehicleIntegrity: 'Incidental Vehicle Integrity',
} as const)

const ConditionMeter = Schema.Struct({
    $id: Schema.String,
    Min: Schema.Literal(0),
    Conditions: Schema.Array(MeterCondition),
    Aliases: Schema.optional(Schema.Array(MeterAlias)),
})

export const AssetSchema = Schema.Struct({
    $id: Schema.String,
    Name: Schema.String,
    Display: DisplayWithTitle,
    States: Schema.optional(States),
    'Asset Type': TypeId,
    Usage,
    Attachements: Schema.optional(Attachment),
    Inputs: Schema.optional(Schema.Union(InputText, InputSelect)),
    Requirement: Schema.optional(Schema.String),
    Abilities: Schema.Tuple(Ability, Ability, Ability),
    'Condition Meter': Schema.optional(ConditionMeter),
    Tags: Schema.optional(Schema.Array(Schema.String)),
})

export const AssetType = Schema.extend(
    Schema.Struct({
        $id: TypeId,
        Source,
        Description: Description,
        Assets: Schema.Array(AssetSchema),
        Name: Schema.String,
        Display: DisplayWithTitle,
        Usage,
    }),
    Schema.partial(Aliases)
)
