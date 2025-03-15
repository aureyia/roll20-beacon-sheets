export const IMPACTS = {
  misfortunes: ['wounded', 'shaken', 'unprepared'],
  lastingEffects: ['permanently harmed', 'traumatized'],
  burdens: ['doomed', 'tormented', 'indebted'],
  currentVehicle: ['battered', 'cursed'],
};

export type Impact = {
  _id: string;
  category:
    | 'misfortunes'
    | 'lastingEffects'
    | 'burdens'
    | 'currentVehicle'
    | 'other';
  description?: string;
};

export type Misfortune = Impact & {
  name: 'wounded' | 'shaken' | 'unprepared';
};
export type LastingEffect = Impact & {
  name: 'permanently harmed' | 'traumatized';
};
export type Burden = Impact & {
  name: 'doomed' | 'tormented' | 'indebted';
};
export type CurrentVehicle = Impact & {
  name: 'battered' | 'cursed';
};

export type Other = Impact & {
  name: string;
};

export type AnyImpact =
  | Misfortune
  | LastingEffect
  | Burden
  | CurrentVehicle
  | Other;
