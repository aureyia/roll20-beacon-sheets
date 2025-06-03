import { Schema } from 'effect';

const ResultRoll = Schema.Struct({
  sides: Schema.Number,
  dice: Schema.Number,
  results: Schema.Array(Schema.Number),
});

const DieExpression = Schema.TemplateLiteral(Schema.Number, 'd', Schema.Number);

const ProcessedResultData = Schema.Struct({
  result: Schema.Number,
  dice: Schema.Array(Schema.Number),
  expression: DieExpression,
  rolls: Schema.Array(ResultRoll),
});

const ProcessedResult = Schema.Struct({
  rollName: Schema.TemplateLiteral('dice-', Schema.Number),
  expression: DieExpression,
  results: ProcessedResultData,
});

const ProcessedResultRecord = Schema.Record({
  key: Schema.TemplateLiteral('dice-', Schema.Number),
  value: ProcessedResult,
});

export const DispatchResultsSchema = Schema.Struct({
  _tag: Schema.tag('DispatchResults'),
  type: Schema.Literal('rollResults'),
  requestId: Schema.String,
  messageId: Schema.String,
  results: ProcessedResultRecord,
});
