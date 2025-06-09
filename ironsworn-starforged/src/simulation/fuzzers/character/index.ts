import {} from './low';
import {} from './medium';
import {} from './high';

type Intensity = 'high' | 'medium' | 'low';

export const resources = (seed: string, intensity: Intensity) => {
  if (intensity === 'high') {
    return high(seed);
  } else if (intensity === 'medium') {
    return medium(seed);
  } else {
    return low(seed);
  }
};
