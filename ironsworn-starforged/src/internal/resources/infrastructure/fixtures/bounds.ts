export const boundsData = [
  {
    fixture: {
      resources: {
        health: 6,
        spirit: 5,
        supply: 5,
        xp: 0,
        spentXp: 0,
        momentum: 2,
      },
    },
    error: 'Assertion failed. Context: values.health: 6',
  },
  {
    fixture: {
      resources: {
        health: 5,
        spirit: 6,
        supply: 5,
        xp: 0,
        spentXp: 0,
        momentum: 2,
      },
    },
    error: 'Assertion failed. Context: values.spirit: 6',
  },
  {
    fixture: {
      resources: {
        health: 5,
        spirit: 5,
        supply: 6,
        xp: 0,
        spentXp: 0,
        momentum: 2,
      },
    },
    error: 'Assertion failed. Context: values.supply: 6',
  },
  {
    fixture: {
      resources: {
        health: -1,
        spirit: 5,
        supply: 5,
        xp: 0,
        spentXp: 0,
        momentum: 2,
      },
    },
    error: 'Assertion failed. Context: values.health: -1',
  },
  {
    fixture: {
      resources: {
        health: 5,
        spirit: -1,
        supply: 5,
        xp: 0,
        spentXp: 0,
        momentum: 2,
      },
    },
    error: 'Assertion failed. Context: values.spirit: -1',
  },
  {
    fixture: {
      resources: {
        health: 5,
        spirit: 5,
        supply: -1,
        xp: 0,
        spentXp: 0,
        momentum: 2,
      },
    },
    error: 'Assertion failed. Context: values.supply: -1',
  },
  {
    fixture: {
      resources: {
        health: 5,
        spirit: 5,
        supply: 5,
        xp: -1,
        spentXp: 0,
        momentum: 2,
      },
    },
    error: 'Assertion failed. Context: values.xp: -1',
  },
  {
    fixture: {
      resources: {
        health: 5,
        spirit: 5,
        supply: 5,
        xp: 0,
        spentXp: -1,
        momentum: 2,
      },
    },
    error: 'Assertion failed. Context: values.spentXp: -1',
  },
  {
    fixture: {
      resources: {
        health: 5,
        spirit: 5,
        supply: 5,
        xp: 0,
        spentXp: 0,
        momentum: 11,
      },
    },
    error: 'Assertion failed. Context: values.momentum: 11',
  },
  {
    fixture: {
      resources: {
        health: 5,
        spirit: 5,
        supply: 5,
        xp: 0,
        spentXp: 0,
        momentum: -7,
      },
    },
    error: 'Assertion failed. Context: values.momentum: -7',
  },
];
