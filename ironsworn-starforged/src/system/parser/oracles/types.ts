import {
  starforged,
  type IOracleCategory,
  type IOracle,
  type IRow,
  type IAsset,
} from '@/vendor/dataforged/dist/types'

const assets = starforged['Asset Types']
const oracles = starforged['Oracle Categories']

type AssetSuggestion = {
  assets: IAsset['$id'][]
}

type OracleSuggestion = {
  oracle_rolls: IOracle['$id'][]
}

type GameObjectSuggestion = {
  game_objects: { object_type: string }[]
}

type Suggestions = AssetSuggestion | OracleSuggestion | GameObjectSuggestion

type OracleResult = {
  [id in IOracle['$id']]: {
    result: string
    suggestions: Suggestions[]
  }
}

type OracleEntry = {
  _id: NonNullable<IRow['$id']>
  min: number
  max: number
}

export type Oracle = {
  _id: IOracle['$id']
  category: IOracleCategory['$id']
  entries: OracleEntry[]
}
