import { Effect } from 'effect';

export const arrayToObject = (array: { _id: string; [x: string]: any }[]) => {
  const isValidArray = array.every((item) => {
    return '_id' in item;
  });
  if (!isValidArray)
    Effect.fail(
      new Error('Tried to objectify an array, but not every item had ids'),
    );
  const newObject: Record<string, any> = {};
  array.forEach((item, index) => {
    const { _id, ...rest } = item;
    newObject[_id] = {
      ...rest,
      arrayPosition: index,
    };
  });
  return Effect.succeed(newObject);
};

export const objectToArray = (object: Record<string, any>) =>
  Effect.sync(() => {
    if (!object) return [];
    const newArray: any[] = [];
    const objectIds = Object.keys(object) as (keyof typeof object)[];
    objectIds.forEach((key) => {
      if (object[key]) {
        const position = object[key].arrayPosition;
        const item = {
          _id: key,
          ...object[key],
          arrayPosition: undefined,
        };
        newArray[position] = item;
      }
    });
    return newArray.filter((x) => x); // Remove all undefined values in case of deletes
  });