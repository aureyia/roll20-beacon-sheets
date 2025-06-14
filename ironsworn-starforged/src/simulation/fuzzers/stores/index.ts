import {
  resources as resourcesLow,
  stats as statsLow,
  impacts as impactsLow,
  assets as assetsLow,
  tasks as tasksLow,
} from './stores-low';
import {
  resources as resourcesMedium,
  stats as statsMedium,
  impacts as impactsMedium,
  assets as assetsMedium,
  tasks as tasksMedium,
} from './stores-medium';
import {
  resources as resourcesHigh,
  stats as statsHigh,
  impacts as impactsHigh,
  assets as assetsHigh,
  tasks as tasksHigh,
} from './stores-high';
import type { Intensity } from '@/simulation/types';

export const resources = (seed: string, intensity: Intensity) => {
  if (intensity === 'high') {
    return resourcesHigh(seed);
  } else if (intensity === 'medium') {
    return resourcesMedium(seed);
  } else {
    return resourcesLow(seed);
  }
};

export const stats = (seed: string, intensity: Intensity) => {
  if (intensity === 'high') {
    return statsHigh(seed);
  } else if (intensity === 'medium') {
    return statsMedium(seed);
  } else {
    return statsLow(seed);
  }
};

export const impacts = (seed: string, intensity: Intensity) => {
  if (intensity === 'high') {
    return impactsHigh(seed);
  } else if (intensity === 'medium') {
    return impactsMedium(seed);
  } else {
    return impactsLow(seed);
  }
};

export const tasks = (seed: string, intensity: Intensity) => {
  if (intensity === 'high') {
    return tasksHigh(seed);
  } else if (intensity === 'medium') {
    return tasksMedium(seed);
  } else {
    return tasksLow(seed);
  }
};

export const assets = (seed: string, intensity: Intensity) => {
  if (intensity === 'high') {
    return assetsHigh(seed);
  } else if (intensity === 'medium') {
    return assetsMedium(seed);
  } else {
    return assetsLow(seed);
  }
};
