import { INTENSITY } from '@/simulation/types'
import {
    assets as assetsHigh,
    impacts as impactsHigh,
    resources as resourcesHigh,
    stats as statsHigh,
    tasks as tasksHigh,
} from './stores-high'
import {
    assets as assetsLow,
    impacts as impactsLow,
    resources as resourcesLow,
    stats as statsLow,
    tasks as tasksLow,
} from './stores-low'
import {
    assets as assetsMedium,
    impacts as impactsMedium,
    resources as resourcesMedium,
    stats as statsMedium,
    tasks as tasksMedium,
} from './stores-medium'

type IntensityValues = typeof INTENSITY[keyof typeof INTENSITY]
export const resources = (seed: string, intensity: IntensityValues) => {
    if (intensity === 'high') {
        return resourcesHigh(seed)
    }
    if (intensity === 'medium') {
        return resourcesMedium(seed)
    }
    return resourcesLow(seed)
}

export const stats = (seed: string, intensity: IntensityValues) => {
    if (intensity === 'high') {
        return statsHigh(seed)
    }
    if (intensity === 'medium') {
        return statsMedium(seed)
    }
    return statsLow(seed)
}

export const impacts = (seed: string, intensity: IntensityValues) => {
    if (intensity === 'high') {
        return impactsHigh(seed)
    }
    if (intensity === 'medium') {
        return impactsMedium(seed)
    }
    return impactsLow(seed)
}

export const tasks = (seed: string, intensity: IntensityValues) => {
    if (intensity === 'high') {
        return tasksHigh(seed)
    }
    if (intensity === 'medium') {
        return tasksMedium(seed)
    }
    return tasksLow(seed)
}

export const assets = (seed: string, intensity: IntensityValues) => {
    if (intensity === 'high') {
        return assetsHigh(seed)
    }
    if (intensity === 'medium') {
        return assetsMedium(seed)
    }
    return assetsLow(seed)
}
