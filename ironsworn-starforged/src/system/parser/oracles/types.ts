import {
    starforged,
    type IOracleCategory,
    type IOracle,
    type IRow,
} from '@/vendor/dataforged/dist/types'

const assets = starforged['Asset Types']
const oracles = starforged['Oracle Categories']

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
