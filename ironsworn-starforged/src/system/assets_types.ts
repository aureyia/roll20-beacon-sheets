export type AssetCategory =
    | 'Command Vehicle'
    | 'Module'
    | 'Support Vehicle'
    | 'Path'
    | 'Companion'
    | 'Deed'

export type AssetsHydrate = {
    assets: Asset[]
}

export type Ability = {
    _id: string
    dataforged_id: string
    enabled: boolean
}

export type Asset = {
    _id: string
    dataforged_id: string
    name: string
    category: AssetCategory
    abilities: Ability[]
    meter: number | null
}
