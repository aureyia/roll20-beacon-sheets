import { createId } from '@paralleldrive/cuid2'
import { Effect } from 'effect'
import {
    type Countdown,
    Difficulty,
    type Task,
    TaskCategory,
    TaskStatus,
} from '@/system/tasks_types'
import { number_between } from '../../prng'

export const stats = (seed: string) => ({
    edge: Effect.runSync(number_between(seed, 'edge', 1, 5)),
    heart: Effect.runSync(number_between(seed, 'heart', 1, 5)),
    iron: Effect.runSync(number_between(seed, 'iron', 1, 5)),
    shadow: Effect.runSync(number_between(seed, 'shadow', 1, 5)),
    wits: Effect.runSync(number_between(seed, 'wits', 1, 5)),
})

export const resources = (seed: string) => ({
    health: Effect.runSync(number_between(seed, 'health', 0, 5)),
    spirit: Effect.runSync(number_between(seed, 'spirit', 0, 5)),
    supply: Effect.runSync(number_between(seed, 'supply', 0, 5)),
    xp: Effect.runSync(number_between(seed, 'xp', 0, 10)),
})

const createImpact = (category: string) => ({
    name: 'Name',
    category: category,
    description: 'description',
})

const number_of_impacts = (seed: string, salt: string) =>
    Effect.runSync(number_between(seed, salt, 0, 1))

export const impacts = (seed: string) => {
    const numberOfMisfortunes = number_of_impacts(seed, 'misfortunes')
    const numberOflasting_effects = number_of_impacts(seed, 'lasting_effects')
    const numberOfBurdens = number_of_impacts(seed, 'burdens')
    const numberOfCurrentVehicle = number_of_impacts(seed, 'current_vehicle')
    const numberOfOther = number_of_impacts(seed, 'other')

    const impactsObject = {
        misfortunes: [] as any[],
        lasting_effects: [] as any[],
        burdens: [] as any[],
        current_vehicle: [] as any[],
        other: [] as any[],
    }

    for (let i = 0; i < numberOfMisfortunes; i++) {
        impactsObject['misfortunes'].push(createImpact('misfortunes'))
    }
    for (let i = 0; i < numberOflasting_effects; i++) {
        impactsObject['lasting_effects'].push(createImpact('lasting_effects'))
    }
    for (let i = 0; i < numberOfBurdens; i++) {
        impactsObject['burdens'].push(createImpact('burdens'))
    }
    for (let i = 0; i < numberOfCurrentVehicle; i++) {
        impactsObject['current_vehicle'].push(createImpact('current_vehicle'))
    }
    for (let i = 0; i < numberOfOther; i++) {
        impactsObject['other'].push(createImpact('other'))
    }

    return impactsObject
}

const AssetCategory = {
    command_vehicle: 'Command Vehicle',
    module: 'Module',
    support_vehicle: 'Support Vehicle',
    path: 'Path',
    companion: 'Companion',
    deed: 'Deed',
} as const

type Ability = {
    _id: string
    dataforged_id: string
    enabled: boolean
}

type Asset = {
    _id: string
    dataforged_id: string
    name: string
    category: typeof AssetCategory
    abilities: Ability[]
    meter: number | null
}

const createAsset = (seed: string, salt: number) => {
    const categories = Object.values(AssetCategory)
    const abilities = new Array(3).fill(0).map((value, index) => ({
        _id: createId(),
        dataforged_id: `/Example/Asset/${salt}/Ability/${index + 1}`,
        enabled:
            Effect.runSync(number_between(seed, `${salt}-ability-enabled-${index + 1}`, 0, 1)) ===
            0,
    }))

    return {
        _id: createId(),
        dataforged_id: '/Example/Asset/Id',
        name: `Asset: ${salt + 1}`,
        category: categories[Effect.runSync(number_between(seed, 'category', 0, 5))],
        abilities: abilities,
        meter: null,
    }
}

export const assets = (seed: string) => {
    const numberOfAssets = Effect.runSync(number_between(seed, 'assets', 3, 6))
    const assets = [] as Asset[]

    for (let index = 0; index < numberOfAssets; index++) {
        assets.push(createAsset(seed, index))
    }

    return assets
}

const selectRandomObjectValue = (seed: string, salt: string, obj: Object) => {
    const objLength = Object.values(obj).length

    return Object.values(obj)[Effect.runSync(number_between(seed, salt, 0, objLength - 1))]
}

const createTask = (seed: string, salt: number) => ({
    _id: createId(),
    description: `Task: ${salt + 1}`,
    category: selectRandomObjectValue(seed, `${salt}-category`, TaskCategory),
    progress: Effect.runSync(number_between(seed, `${salt}-progress`, 0, 40)),
    difficulty: selectRandomObjectValue(seed, `${salt}-difficulty`, Difficulty),
    status: selectRandomObjectValue(seed, `${salt}-status`, TaskStatus),
    countdown: Effect.runSync(number_between(seed, `${salt}-countdown`, 0, 4)) as Countdown,
})

export const tasks = (seed: string) => {
    const numberOfTasks = Effect.runSync(number_between(seed, 'tasks', 2, 6))
    const tasks = [] as Task[]

    for (let index = 0; index < numberOfTasks; index++) {
        tasks.push(createTask(seed, index))
    }

    return tasks
}
