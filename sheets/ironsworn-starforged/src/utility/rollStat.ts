import { createRollTemplate } from '@/rolltemplates/rolltemplates';
import { dispatchRef, initValues } from '@/relay/relay';
import type { Dispatch } from '@roll20-official/beacon-sdk';
import getRollResult from '@/utility/getRollResult';
import { actionDice } from '@/system/dice';

export default async (label: string, value: number, momentum: number, modifier: number, customDispatch?: Dispatch) => {
  const dispatch = customDispatch || (dispatchRef.value as Dispatch); // Need a different Relay instance when handling sheet-actions

  const { dice } = await getRollResult(actionDice, dispatch);

  // Pass in the roll result to Handlebars and get HTML to render the roll template
  const rollTemplate = createRollTemplate({
    type: 'stat',
    parameters: {
      characterName: initValues.character.name,
      title: 'Rolling ' + label,
      dice,
      label,
      value,
      momentum,
      modifier
    }
  });

  // Post the roll template HTML into Chat.
  await dispatch.post({
    characterId: initValues.character.id,
    content: rollTemplate,
    options: {
      whisper: undefined,
      secret: undefined,
    },
  });

  return dice;
};
