import {
  MeterAlias,
  MeterType,
  ProgressTypeStarforged,
  Stat,
} from '@/system/moves/enums';
import { useResourcesStore } from '@/system/resources/store';
import { useStatsStore } from '@/system/stats/store';
import { Effect, pipe, Console } from 'effect';

type OptionType = {
  [key: string]: 'stat' | 'resource' | 'progress' | 'asset' | 'custom';
};

const getOptionValueTypeList = (using: string[]): OptionType[] => {
  return using
    .map((use) => {
      const isStat = (<any>Object).values(Stat).includes(use);
      const isResource = (<any>Object).values(MeterType).includes(use);
      const isProgress = (<any>Object)
        .values(ProgressTypeStarforged)
        .includes(use);
      const isAsset = (<any>Object).values(MeterAlias).includes(use);
      const isCustom = use.includes('Custom_stat');

      if (isStat) {
        return { [use]: 'stat' };
      }
      if (isResource) {
        return { [use]: 'resource' };
      }
      if (isProgress) {
        return { [use]: 'progress' };
      }
      if (isAsset) {
        return { [use]: 'asset' };
      }
      if (isCustom) {
        return { [use]: 'custom' };
      }
    })
    .filter((x): x is OptionType => x !== undefined);
};

const lookupStoreValue = (
  options: OptionType[],
): Effect.Effect<number[], Error> => {
  const values = options
    .map((option) => {
      const key: string = Object.keys(option)[0];

      if (!key) {
        return Effect.fail(new Error('Invalid option key'));
      }

      const formattedKey = key.toLocaleLowerCase();
      const statsStore = useStatsStore();
      const resourcesStore = useResourcesStore();

      if (option[key] === 'stat') {
        // @ts-ignore
        return statsStore[formattedKey];
      }
      if (option[key] === 'resource') {
        // @ts-ignore
        return resourcesStore[formattedKey];
      }
      if (option[key] === 'progress') {
        // TODO: We will need to pass the id along for the task
        // Will need to ask for the progress before we can do this one
        return 0;
      }
      if (option[key] === 'asset') {
        // TODO: Need to look up the value from the asset id once they are in
        return 0;
      }
      if (option[key] === 'custom') {
        // TODO: Need to lookup the custom value?
        return 0;
      }
      return null;
    })
    .filter((value) => value !== null);

  if (values.length > 0) {
    return Effect.succeed(values);
  }
  return Effect.fail(new Error(`Unexpected type for lookup ${options}`));
};

type ValidRollOption = {
  $id: string;
  'Roll type': 'Action roll' | 'Progress roll';
  Method: 'Any' | 'Highest' | 'Lowest' | 'All';
  Using: string[];
};

const getValue = (
  option: ValidRollOption,
  values: number[],
): Effect.Effect<number, Error> => {
  const isMethodAny = option.Method === 'Any';
  const isMethodHighest = option.Method === 'Highest';
  const isMethodLowest = option.Method === 'Lowest';
  const isMethodAll = option.Method === 'All';
  // const values = Effect.runSync(resourceValues(option))

  if (isMethodAny) {
    const log = Console.log('Any');
    Effect.runSync(log);
    return Effect.succeed(values[0]);
  }
  if (isMethodHighest) {
    console.log('Highest');
    return Effect.succeed(Math.max(values[0], values[1]));
  }
  if (isMethodLowest) {
    console.log('Lowest');
    return Effect.succeed(Math.min(values[0], values[1]));
  }
  if (isMethodAll) {
    // TODO: work out what all should look like
    return Effect.succeed(0);
  }

  return Effect.fail(
    new Error(`Unsupported Method was used: ${option.Method}`),
  );
};

export const resourceValues = (option: ValidRollOption) =>
  pipe(
    option.Using,
    getOptionValueTypeList,
    lookupStoreValue,
    Effect.andThen((x) => getValue(option, x)),
  );

// @ts-ignore
if (import.meta.vitest) {
  // @ts-ignore
  const { it, expect, describe } = import.meta.vitest;

  describe('getUseOptionTypes', () => {
    it('stat - Heart', () => {
      expect(getOptionValueTypeList(['Heart'])).toStrictEqual([
        { Heart: 'stat' },
      ]);
    });
    it('unknown - Gooble', () => {
      expect(getOptionValueTypeList(['Gooble'])).toStrictEqual([]);
    });
  });

  describe('lookupStoreValue', () => {
    it('stat', () => {});
  });
}
