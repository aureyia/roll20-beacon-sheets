import { Schema } from 'effect'
import { Struct } from 'effect/Schema'

export const Id = Struct({
    $id: Schema.String
})

const SourceTitle = Schema.Enums({
    Starforged: 'Ironsworn: Starforged Rulebook',
    StarforgedAssets: 'Ironsworn: Starforged Assets',
    SunderedIslesPreview: 'Sundered Isles Preview',
    Ironsworn: 'Ironsworn Rulebook',
    IronswornAssets: 'Ironsworn Assets',
    IronswornDelve: 'Ironsworn: Delve',
    Custom: 'Custom',
} as const)

export const Aliases = Schema.Struct({
    Aliases: Schema.Array(Schema.String),
})

const DisplayBase = Schema.Struct({
    Icon: Schema.optional(Schema.String),
    Images: Schema.optional(Schema.String),
    Color: Schema.optional(Schema.String),
    Title: Schema.optional(Schema.String),
})

export const Display = Schema.partial(DisplayBase)

export const DisplayWithTitle = Schema.extend(
    Schema.partial(DisplayBase),
    Schema.Struct({
        Title: Schema.String,
    })
)

export const Description = Schema.Struct({
    Description: Schema.String,
})

export const Source = Schema.Struct({
    Source: Schema.Struct({
        Title: Schema.Union(SourceTitle, Schema.String),
        Authors: Schema.Array(Schema.String),
        Date: Schema.optional(Schema.String),
        Page: Schema.optional(Schema.Number),
        Url: Schema.optional(Schema.String),
    }),
})
