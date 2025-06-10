import { Effect } from 'effect';
import { impactsStore } from '@/system/impacts/store';
import { tasksStore } from '@/system/tasks/store';
import { assetsStore } from '@/system/assets/store';
import { resources, stats, impacts, assets, tasks } from './fuzzers/stores';
import { statsStore, type Stats } from '@/system/stats/store';
import { resourcesStore } from '@/system/resources/store';
import { numberBetween } from './prng';
import { momentumStore } from '@/system/momentum/store';
import { saveSnaphot } from './storage/snapshots';

export const setupStores = (seed: string, intensity: string) =>
  Effect.sync(() => {
    // Clear Stores

    impactsStore.trigger.clear();
    tasksStore.trigger.clear();
    assetsStore.trigger.clear();

    // Momentum

    const selectedMomentum = Effect.runSync(
      numberBetween(seed, 'momentum', -6, 10),
    );
    momentumStore.trigger.set({ value: selectedMomentum });

    // Stats

    const statList = ['edge', 'heart', 'iron', 'shadow', 'wits'];
    const selectedStats = statList.map((stat) => {
      return {
        label: stat,
        // @ts-ignore
        value: stats(seed, intensity)[stat],
      };
    });

    selectedStats.forEach((entry) => {
      // @ts-ignore
      statsStore.trigger.set(entry);
    });

    // Resources

    const resourceList = ['health', 'spirit', 'supply', 'xp'];
    const selectedResources = resourceList.map((resource) => {
      return {
        label: resource,
        // @ts-ignore
        value: resources(seed, intensity)[resource],
      };
    });

    selectedResources.forEach((entry) => {
      // @ts-ignore
      statsStore.trigger.set(entry);
    });

    // Impacts

    const impacts = [
      'misfortunes',
      'lastingEffects',
      'burdens',
      'currentVehicle',
      'other',
    ];

    const selectedImpacts = impacts.map((category) => {
      return {
        label: category,
        // @ts-ignore
        value: impacts(seed, intensity)[category],
      };
    });

    selectedImpacts.forEach((entry) => {
      // @ts-ignore
      impactsStore.trigger.set(entry);
    });

    // Tasks

    // @ts-ignore
    const selectedTasks = tasks(seed, intensity);
    tasksStore.trigger.set({ label: 'list', value: selectedTasks });

    // Assets

    // @ts-ignore
    const selectedAssets = assets(seed, intensity);
    assetsStore.trigger.set({ label: 'list', value: selectedAssets });

    saveSnaphot('stores', {
      run_id: seed,
      momentum: selectedMomentum,
      stats: selectedStats,
      resources: selectedResources,
      impacts: selectedImpacts,
      tasks: selectedTasks,
      assets: selectedAssets,
    });
  });
