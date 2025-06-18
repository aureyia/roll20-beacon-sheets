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
    dataforgedId: string
    enabled: boolean
}

export type Asset = {
    _id: string
    dataforgedId: string
    name: string
    category: AssetCategory
    abilities: Ability[]
    meter: number | null
}
