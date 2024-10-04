import type { Character } from '@roll20-official/beacon-sdk';
import type { BioHydrate } from '@/sheet/stores/bio/bioStore';

export const getBio = ({ character }: { character: Character }) => {
  if (!character.attributes?.bio) return {};
  return (character.attributes.bio as BioHydrate).bio;
};
