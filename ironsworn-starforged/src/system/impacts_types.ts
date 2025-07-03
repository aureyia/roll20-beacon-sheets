export const IMPACTS = {
    misfortunes: ['wounded', 'shaken', 'unprepared'],
    lasting_effects: ['permanently harmed', 'traumatized'],
    burdens: ['doomed', 'tormented', 'indebted'],
    current_vehicle: ['battered', 'cursed'],
} as const

export type Impact = {
    _id: string
    category: 'misfortunes' | 'lasting_effects' | 'burdens' | 'current_vehicle' | 'other'
    description?: string
}

export type Misfortune = Impact & {
    name: 'wounded' | 'shaken' | 'unprepared'
}
export type LastingEffect = Impact & {
    name: 'permanently harmed' | 'traumatized'
}
export type Burden = Impact & {
    name: 'doomed' | 'tormented' | 'indebted'
}
export type CurrentVehicle = Impact & {
    name: 'battered' | 'cursed'
}

export type Other = Impact & {
    name: string
}

export type AnyImpact = Misfortune | LastingEffect | Burden | CurrentVehicle | Other
