import { numberBetween } from '../../prng';
import { Effect } from 'effect';
import { createId } from '@paralleldrive/cuid2';

const fuzzList = [
  '',
  '{',
  -1,
  '$/',
  new Array(),
  null,
  false,
  true,
  () => {},
  undefined,
  ,
  async () => null,
  {},
  ['/', null, undefined]
];

const singleRoll = (seed: string) => ({
  rollName: 'dice-0',
  expression: '1d6',
  results: {
    result: fuzzList[Effect.runSync(numberBetween(seed, 'dice-0', 0, 13))],
    dice: [fuzzList[Effect.runSync(numberBetween(seed, 'dice-0', 0, 13))]],
    expression: '1d6',
    rolls: [
      {
        sides: 6,
        dice: 1,
        results: [
          fuzzList[Effect.runSync(numberBetween(seed, 'dice-0', 0, 13))],
        ],
      },
    ],
  },
});

const resultObjects = (seed: string) => {
  const numberOfRolls = Effect.runSync(
    numberBetween(seed, 'numberOfRolls', 0, 10),
  );
  let rollObject = {} as any;
  for (let i = 0; i < numberOfRolls; i++) {
    rollObject[`dice-${i}`] = singleRoll(seed);
  }
  return rollObject;
};

export const rollResults = (seed: string) => ({
  type: 'rollResults',
  requestId: '3e0d9317-29ac-43b8-a42b-61740f296249',
  messageId: '56d2712f-4f76-4f3e-b1b1-31545e770808',
  results: resultObjects(seed),
  rawResults: [
    {
      rollId: '-ORmvH1LmENvY3B9FDVm',
      signature:
        '303d45f11a570273cb433c43a7ed0f0526aa75a39a9b0193323c5fe071de3c37063ed4d3fadcfc848507f332dd6563b63fd8d62678b72387e9791d0ad0caa23d',
      results: {
        type: 'V',
        rolls: [
          {
            type: 'R',
            dice: 1,
            sides: 6,
            mods: {},
            results: [
              {
                v: 5,
                isCrit: false,
                isFumble: false,
              },
            ],
          },
        ],
        resultType: 'sum',
        total: 5,
      },
      rollName: 'dice-0',
      expression: '1d6',
    },
    {
      rollId: '-ORmvH1LmENvY3B9FDVn',
      signature:
        'a2ec6aed60fe79e27e2b225a95b5ddef776e5eeb935924bf8b4bc942dee6a6fa555d0bfb49140a243bf686b212cf137c423fcd3f229b7c0efb1cd3c11f43efe1',
      results: {
        type: 'V',
        rolls: [
          {
            type: 'R',
            dice: 1,
            sides: 10,
            mods: {},
            results: [
              {
                v: 9,
                isCrit: false,
                isFumble: false,
              },
            ],
          },
        ],
        resultType: 'sum',
        total: 9,
      },
      rollName: 'dice-1',
      expression: '1d10',
    },
    {
      rollId: '-ORmvH1LmENvY3B9FDVo',
      signature:
        '0cacb3f98fb3506c5badbee32233ea1bfec565a57264de190e4afbe54cf7234343845abd2af72733c7e55739a2694df33b7e67456255a28560bbb5a558c22e5d',
      results: {
        type: 'V',
        rolls: [
          {
            type: 'R',
            dice: 1,
            sides: 10,
            mods: {},
            results: [
              {
                v: 10,
                isCrit: true,
                isFumble: false,
              },
            ],
          },
        ],
        resultType: 'sum',
        total: 10,
      },
      rollName: 'dice-2',
      expression: '1d10',
    },
  ],
});
