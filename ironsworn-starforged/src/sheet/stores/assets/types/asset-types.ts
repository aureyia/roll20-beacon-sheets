export type AssetCategory =
  | 'Command Vehicle'
  | 'Module'
  | 'Support Vehicle'
  | 'Path'
  | 'Companion'
  | 'Deed';

export type AssetsHydrate = {
  assets: Asset[];
};

export type Ability = {
  id: string;
  enabled: boolean;
};

export type Asset = {
  _id: string;
  dataforgedId: string;
  name: string;
  category: AssetCategory;
  abilities: {
    '1': Ability;
    '2': Ability;
    '3': Ability;
  };
  meter?: number;
};