import { Schema } from "effect";
import { asset_id } from "./assets";
import { display_title } from "./generic";
import { move_id } from "./moves";

export const oracle_category_id = Schema.String.pipe(
  Schema.pattern(/^Starforged\/Oracles\/[A-z_-]+(\/[A-z_-]+)*$/),
);

export const oracle_id = Schema.String.pipe(
  Schema.pattern(/^Starforged\/Oracles\/[A-z_-]+((\/[A-z_-]+)+)?$/),
);

const rolls_multiple = Schema.Struct({
  Amount: Schema.Number,
  "Allow duplicates": Schema.Boolean,
  "Make it worse": Schema.Boolean,
});

const ATTRIBUTE_KEY = {
  Atmosphere: "Atmosphere",
  Authority: "Authority",
  Behavior: "Encountered Behavior",
  DerelictType: "Derelict Type",
  Disposition: "Disposition",
  Dominion: "Dominion",
  Environment: "Environment",
  FactionType: "Faction Type",
  FringeGroup: "Fringe Group",
  Guild: "Guild",
  Influence: "Influence",
  InitialContact: "Initial Contact",
  Leadership: "Leadership",
  Life: "Life",
  Location: "Location",
  LocationTheme: "Location Theme",
  PlanetaryClass: "Planetary Class",
  Population: "Population",
  Region: "Region",
  Role: "Role",
  CreatureScale: "Creature Scale",
  Zone: "Zone",
} as const;

const GAME_OBJECT_TYPE = {
    Derelict: 'Derelict',
    DerelictZone: 'Derelict Zone',
    Starship: 'Starship',
    Settlement: 'Settlement',
    Planet: 'Planet',
    PrecursorVault: 'Precursor Vault',
    Character: 'Character',
    Creature: 'Creature',
    Faction: 'Faction',
} as const

const attribute_key = Schema.Enums(ATTRIBUTE_KEY);
const game_object_type = Schema.Enums(GAME_OBJECT_TYPE);

const attribute = Schema.Struct({
  Key: attribute_key,
  Type: Schema.optional(Schema.String),
});

const attribute_choices = Schema.Struct({
  Key: attribute_key,
  Values: Schema.optional(Schema.Array(Schema.String)),
});

const row_id = Schema.String.pipe(
  Schema.pattern(
    /^Starforged\/Oracles\/[A-z_-]+\/[1-9][0-9]*(-[1-9][0-9]*)?(\/Subtable\/[1-9][0-9]*(-[1-9][0-9]*)?)?$/,
  ),
);

const row_fields = {
  $id: row_id,
  Floor: Schema.NullOr(Schema.Number.pipe(Schema.between(1, 100))),
  Ceiling: Schema.NullOr(Schema.Number.pipe(Schema.between(1, 100))),
  Result: Schema.String,
  Summary: Schema.optional(Schema.NullOr(Schema.String)),
  "Oracle rolls": Schema.optional(Schema.Array(oracle_id)),
  "Multiple rolls": Schema.optional(rolls_multiple),
  Attributes: Schema.optional(Schema.Array(attribute)),
};

export interface Row extends Schema.Struct.Type<typeof row_fields> {
  readonly Subtable?: readonly Row[] | undefined;
}

const row = Schema.Struct({
  ...row_fields,
  Subtable: Schema.optional(
    Schema.Array(Schema.suspend((): Schema.Schema<Row> => row)),
  ),
});

const table_column_base = Schema.Struct({
  Label: Schema.String,
  "Use content from": oracle_id,
});

const text_column = Schema.extend(
  table_column_base,
  Schema.Struct({
    Key: Schema.Union(Schema.Literal("Result"), Schema.Literal("Summary")),
  }),
);

export const display_table_info = Schema.Struct({
  "Result columns": Schema.Array(text_column),
  "Roll columns": Schema.Array(table_column_base),
});

export const display_oracle = Schema.extend(
  display_title,
  Schema.Struct({
    "Column of": Schema.optional(oracle_id),
    Table: display_table_info,
    "Embed in": Schema.optional(row_id),
  }),
);

const oracle_match = Schema.Struct({
  Text: Schema.String.pipe(
    Schema.pattern(
      /^Starforged\/Oracles\/[A-z_-]+((\/[A-z_-]+)+)?\/On_a_Match$/,
    ),
  ),
});

const requirements = Schema.Struct({
  Attributes: Schema.Array(attribute_choices),
});

const game_object = Schema.Struct({
  'Object type': game_object_type,
  Requires: Schema.optional(requirements),
});

const encounters = Schema.Struct({
    // TODO: Complete and add pattern
    $id: Schema.String
    //???
});

const suggestions = Schema.Struct({
  'Game objects': Schema.optional(Schema.Array(game_object)),
  'Oracle rolls': Schema.optional(Schema.Array(oracle_id)),
  Moves: Schema.optional(Schema.Array(move_id)),
  Assets: Schema.optional(Schema.Array(asset_id)),
  Encounters: Schema.Array(encounters.fields.$id),
});

const oralce_usage = Schema.Struct({
  Initial: Schema.Boolean,
  Suggestions: Schema.optional(suggestions),
  Requires: Schema.optional(requirements),
  "Min rolls": Schema.optional(Schema.Number),
  "Max rolls": Schema.optional(Schema.Number),
  Repeatable: Schema.optional(Schema.Boolean),
  "Allow duplicates": Schema.optional(Schema.Boolean),
  Sets: Schema.optional(Schema.Array(attribute_choices)),
});

const oracle_base = Schema.Struct({
    Category: Schema.optional(oracle_category_id),
    "Member of": Schema.optional(oracle_id),
    Display: display_title,
    Usage: Schema.optional(oralce_usage),
    Table: Schema.optional(Schema.Array(row)),
    Oracles: Schema.optional(Schema.Array(
        Schema.suspend((): Schema.Schema<Oracle> => oracle)
    )),
    Categories: Schema.optional(Schema.Array()),
    "On a Match": Schema.optional(oracle_match),
});

interface Oracle extends Schema.Struct.Type<typeof oracle_base> {}

export const oracle = Schema.extend(
  oracle_base,
  Schema.Struct({
    $id: oracle_id,
    Display: display_oracle,
    Category: Schema.optional(oracle_category_id),
    "Member of": Schema.optional(oracle_id),
    Table: Schema.optional(Schema.Array(row)),
    "On a Match": Schema.optional(oracle_match),
  }),
);
