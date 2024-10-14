import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useResourcesStore } from '../resources/resourcesStore';
import { createRollTemplate } from '@/rolltemplates/rolltemplates';
import { dispatchRef, initValues } from '@/relay/relay';
import type { Dispatch } from '@roll20-official/beacon-sdk';
import { convertResultsToDice, formatDiceComponents } from '@/utility/rolls/convertResultsToDice';
import { rollDiceWithBeacon } from '@/utility/rolls/rollDiceWithBeacon';

import { actionDice } from '@/system/dice';
import { Effect } from 'effect';

export type Stats = {
  edge: number;
  heart: number;
  iron: number;
  shadow: number;
  wits: number;
};

export type StatsHydrate = {
  stats: {
    edge: number;
    heart: number;
    iron: number;
    shadow: number;
    wits: number;
  };
};

export const useStatsStore = defineStore('stats', () => {
  const edge = ref(0);
  const heart = ref(0);
  const iron = ref(0);
  const shadow = ref(0);
  const wits = ref(0);

  /**
   * Rolls a stat and posts the result to the chat log.
   *
   * @param label The label to display for the stat.
   * @param value The value of the stat to roll.
   * @param modifier The modifier to apply to the roll.
   * @param customDispatch The dispatch function to use to post the roll template. If not provided, the default dispatch function will be used.
   * @returns The result of the roll as an array of dice results.
   */
  const roll = async (
    label: string,
    value: number,
    modifier: number = 0,
    customDispatch?: Dispatch,
  ) => {
    const dispatch = customDispatch || (dispatchRef.value as Dispatch);
    const { momentum } = useResourcesStore();
    const formattedDice = formatDiceComponents(actionDice);
    const rollResults = await rollDiceWithBeacon({ rolls: formattedDice });
    const rolledDice = convertResultsToDice(actionDice, rollResults);

    const rollTemplate = createRollTemplate({
      type: 'stat',
      parameters: {
        characterName: initValues.character.name,
        title: 'Rolling ' + label,
        dice: rolledDice,
        label,
        value,
        momentum,
        modifier,
      },
    });

    await dispatch.post({
      characterId: initValues.character.id,
      content: rollTemplate,
      options: {
        whisper: undefined,
        secret: undefined,
      },
    });

    return rolledDice;
  };

  const dehydrate = () => {
    return Effect.succeed({
      stats: {
        edge: edge.value,
        heart: heart.value,
        iron: iron.value,
        shadow: shadow.value,
        wits: wits.value,
      },
    });
  };

  const hydrate = (hydrateStore: StatsHydrate) => {
    edge.value = hydrateStore.stats.edge ?? edge.value;
    heart.value = hydrateStore.stats.heart ?? heart.value;
    iron.value = hydrateStore.stats.iron ?? iron.value;
    shadow.value = hydrateStore.stats.shadow ?? shadow.value;
    wits.value = hydrateStore.stats.wits ?? wits.value;
  };

  return {
    edge,
    heart,
    iron,
    shadow,
    wits,
    roll,
    dehydrate,
    hydrate,
  };
});
