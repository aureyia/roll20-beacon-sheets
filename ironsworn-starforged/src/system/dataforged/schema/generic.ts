import { Schema } from 'effect'
import { Struct } from 'effect/Schema'

const SOURCE_TITLE = {
    Starforged: 'Ironsworn: Starforged Rulebook',
    StarforgedAssets: 'Ironsworn: Starforged Assets',
    SunderedIslesPreview: 'Sundered Isles Preview',
    Custom: 'Custom',
} as const

export const id = Struct({
    $id: Schema.String,
})

const source_title = Schema.Enums(SOURCE_TITLE)

export const aliases = Schema.Struct({
    Aliases: Schema.Array(Schema.String),
})

const display_base = Schema.Struct({
    Icon: Schema.optional(Schema.String),
    Images: Schema.optional(Schema.String),
    Color: Schema.optional(Schema.String),
    Title: Schema.optional(Schema.String),
})

export const display = Schema.partial(display_base)

export const display_title = Schema.extend(
    Schema.partial(display_base),
    Schema.Struct({
        Title: Schema.String,
    })
)

export const description = Schema.Struct({
    Description: Schema.String,
})

export const source = Schema.Struct({
    Source: Schema.Struct({
        Title: Schema.Union(source_title, Schema.String),
        Authors: Schema.Array(Schema.String),
        Date: Schema.optional(Schema.String),
        Page: Schema.optional(Schema.Number),
        Url: Schema.optional(Schema.String),
    }),
})
