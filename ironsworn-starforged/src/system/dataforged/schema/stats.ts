import { Schema } from 'effect'

export const PlayerConditionMeter = Schema.Enums({
    Health: 'Health',
    Spirit: 'Spirit',
    Supply: 'Supply',
} as const)

export const Stat = Schema.Enums({
    Edge: 'Edge',
    Heart: 'Heart',
    Iron: 'Iron',
    Shadow: 'Shadow',
    Wits: 'Wits',
} as const)