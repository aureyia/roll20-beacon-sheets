import {
  createRollTemplate,
  type AnyRollTemplate,
} from '@/system/rolls/rolltemplates/rolltemplates';
import { dispatchRef } from '@/external/vue.relay';
import type { Dispatch, PostArgs } from '@roll20-official/beacon-sdk';

export const sendRollToChat = async (
  id: PostArgs['characterId'],
  params: AnyRollTemplate,
  options = {},
) => {
  const dispatch = dispatchRef.value as Dispatch;
  const rollTemplate = createRollTemplate(params);

  await dispatch.post({
    characterId: id,
    content: rollTemplate,
    options,
  });
};
