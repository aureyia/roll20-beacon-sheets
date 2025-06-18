import { Schema } from 'effect'

export type DispatchResultsSchema = Schema.Schema.Type<
    typeof DispatchResultsSchema
>
export type DispatchResults = DispatchResultsSchema['results']
export type DieKey = Schema.Schema.Type<typeof DieKey>

export const DieKey = Schema.TemplateLiteral('dice-', Schema.Number)
export const DieExpression = Schema.TemplateLiteral(
    Schema.Number,
    'd',
    Schema.Number
)

export const DispatchResultsSchema = Schema.Struct({
    type: Schema.Literal('rollResults'),
    requestId: Schema.String,
    messageId: Schema.String,
    results: Schema.Record({
        key: DieKey.pipe(Schema.minLength(1)),
        value: Schema.Struct({
            rollName: DieKey,
            expression: DieExpression,
            results: Schema.Struct({
                result: Schema.Number,
                dice: Schema.Array(Schema.Number),
                expression: DieExpression,
                rolls: Schema.Array(
                    Schema.Struct({
                        sides: Schema.Number,
                        dice: Schema.Number,
                        results: Schema.Array(Schema.Number),
                    })
                ),
            }),
        }),
    }),
    rawResults: Schema.Any,
})
