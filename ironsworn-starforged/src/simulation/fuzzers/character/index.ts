import {} from './low'
import {} from './medium'
import {} from './high'
import type { Intensity } from '@/simulation/types'

export const resources = (seed: string, intensity: Intensity) => {
    if (intensity === 'high') {
        return high(seed)
    }
    if (intensity === 'medium') {
        return medium(seed)
    }
    return low(seed)
}
