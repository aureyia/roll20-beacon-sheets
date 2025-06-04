import { Schema } from 'effect';

export type DispatchResultsSchema = Schema.Schema.Type<typeof DispatchResultsSchema>
export type DispatchResults = DispatchResultsSchema['results']

export const DieExpression = Schema.TemplateLiteral(
  Schema.Number,
  'd',
  Schema.Number,
);
export const DispatchResultsSchema = Schema.Struct({
  type: Schema.Literal('rollResults'),
  requestId: Schema.String,
  messageId: Schema.String,
  results: Schema.Record({
    key: Schema.TemplateLiteral('dice-', Schema.Number),
    value: Schema.Struct({
      rollName: Schema.TemplateLiteral('dice-', Schema.Number),
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
          }),
        ),
      }),
    }),
  }),
  rawResults: Schema.Any,
});
