type Add = {
  Amount: number
}

type Using = {
  Name: string
}

type PresetActionDie = {
  Value: number
}

type RerollDice = {
  Type: 'All'
}

type Mark = {
  Type: 'combat' | 'vow' | 'legacy'
  Amount: number
}

type MoveAlter = {
  id: string;
  preroll: {
    add: number;
    base: number;
  };
  postRoll: {
    reroll: boolean;
  };
  postResolution: {
    mark: {
      track: 'combat' | 'progress' | 'vow' | 'legacy';
      amount: number;
    };
    followUpMove: {
      id: string;
      optional: boolean;
    };
  };
};

export const REQUIRED_ALTERED_MOVE_DATA: MoveAlter[] = [

] as const