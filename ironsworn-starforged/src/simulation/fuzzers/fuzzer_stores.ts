import type { Intensity } from '@/simulation/types'
import {
    assets as assets_high,
    impacts as impacts_high,
    resources as resources_high,
    stats as stats_high,
    tasks as tasks_high,
} from './stores/stores_high'
import {
    assets as assets_low,
    impacts as impacts_low,
    resources as resources_low,
    stats as stats_low,
    tasks as tasks_low,
} from './stores/stores_low'
import {
    assets as assets_medium,
    impacts as impacts_medium,
    resources as resources_medium,
    stats as stats_medium,
    tasks as tasks_medium,
} from './stores/stores_medium'

export const resources = (seed: string, intensity: Intensity) => {
    if (intensity === 'high') {
        return resources_high(seed)
    }
    if (intensity === 'medium') {
        return resources_medium(seed)
    }
    return resources_low(seed)
}

export const stats = (seed: string, intensity: Intensity) => {
    if (intensity === 'high') {
        return stats_high(seed)
    }
    if (intensity === 'medium') {
        return stats_medium(seed)
    }
    return stats_low(seed)
}

export const impacts = (seed: string, intensity: Intensity) => {
    if (intensity === 'high') {
        return impacts_high(seed)
    }
    if (intensity === 'medium') {
        return impacts_medium(seed)
    }
    return impacts_low(seed)
}

export const tasks = (seed: string, intensity: Intensity) => {
    if (intensity === 'high') {
        return tasks_high(seed)
    }
    if (intensity === 'medium') {
        return tasks_medium(seed)
    }
    return tasks_low(seed)
}

export const assets = (seed: string, intensity: Intensity) => {
    if (intensity === 'high') {
        return assets_high(seed)
    }
    if (intensity === 'medium') {
        return assets_medium(seed)
    }
    return assets_low(seed)
}
