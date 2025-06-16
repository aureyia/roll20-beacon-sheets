import { starforged, type IAsset, type IMove } from '@/vendor/dataforged'

const assets = starforged['Asset Types']
const moves = starforged['Move Categories']
const oracles = starforged['Oracle Categories']

type Ability = {
    enabled: boolean
}

type Usage = {
    shared: boolean
}

type Requirement = {}

type Input = {}

type ConditionMeter = {}

type Asset = {
    id: string
    name: string
    type: string
    usage: Usage
    abilities: Ability[]
    requirement?: Requirement
    inputs?: Input[]
    attachments?: Asset[]
    conditionMeter?: ConditionMeter
}

const normaliseAssetTypeText = (assetType: string) => {
    const typeParts = assetType.split('/')
    return typeParts[typeParts.length - 1].toLowerCase()
}

let flattenedAssets: IAsset[] = []
let assetMoves: IMove[] = []

assets.forEach(assetType => {
    assetType.Assets.forEach((asset: IAsset) => {
        flattenedAssets.push(asset)
    })
})

const transformedAssets = flattenedAssets.map(asset => {
    let formattedAsset: Asset = {
        id: '',
        name: '',
        type: '',
        usage: { shared: false },
        abilities: [],
    }

    formattedAsset.id = asset.$id.split('/').join('-').toLowerCase()
    formattedAsset.name = asset.Name.toLowerCase()
    formattedAsset.type = normaliseAssetTypeText(asset['Asset Type'])
    formattedAsset.usage.shared = asset.Usage.Shared

    formattedAsset.abilities = asset.Abilities.map(ability => {
        return {
            enabled: ability.Enabled,
        }
    })

    return formattedAsset
})

console.log(transformedAssets)
