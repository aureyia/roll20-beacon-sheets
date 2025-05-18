import type {
  AnyImpact,
  Burden,
  CurrentVehicle,
  LastingEffect,
  Misfortune,
  Other,
} from '@/internal/impacts/application/types';
import { createId } from '@paralleldrive/cuid2';

export const addImpact = (
  name: AnyImpact['name'],
  category: AnyImpact['category'],
  description?: string,
) => {
  if (!category) {
    throw new Error('Category is required when adding an impact');
  }
  if (!name) {
    throw new Error('Option is required when adding an impact');
  }
  const impact: AnyImpact = {
    _id: createId(),
    category: category,
    name: name,
    description: description || '',
  };
  if (
    ![
      'misfortunes',
      'lastingEffects',
      'burdens',
      'currentVehicle',
      'other',
    ].includes(category)
  ) {
    throw new Error(`Unknown category: ${category}`);
  }

  switch (category) {
    case 'misfortunes':
      misfortunes.value.push(impact as Misfortune);
      break;
    case 'lastingEffects':
      lastingEffects.value.push(impact as LastingEffect);
      break;
    case 'burdens':
      burdens.value.push(impact as Burden);
      break;
    case 'currentVehicle':
      currentVehicle.value.push(impact as CurrentVehicle);
      break;
    case 'other':
      other.value.push(impact as Other);
      break;
  }
};