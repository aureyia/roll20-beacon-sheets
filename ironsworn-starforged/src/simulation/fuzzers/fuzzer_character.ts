import type { INTENSITY } from '@/simulation/types'
import {} from './high'
import {} from './low'
import {} from './medium'

export const resources = (seed: string, intensity: INTENSITY) => {
    if (intensity === 'high') {
        return high(seed)
    }
    if (intensity === 'medium') {
        return medium(seed)
    }
    return low(seed)
}
