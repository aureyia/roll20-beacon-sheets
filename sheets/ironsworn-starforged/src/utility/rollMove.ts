import { starforged } from 'dataforged'
import { initValues } from '@/relay/relay';
import { useResourcesStore } from '../resources/resourcesStore';
import { createRollTemplate } from '@/rolltemplates/rolltemplates';
import { dispatchRef, initValues } from '@/relay/relay';
import type { Dispatch } from '@roll20-official/beacon-sdk';
import { convertResultsToDice, formatDiceComponents } from '@/utility/convertResultsToDice';
import { getRollFromDispatch } from '@/utility/getRollFromDispatch';
import { actionDice } from '@/system/dice';
import type { AnyRollTemplate } from '@/rolltemplates/rolltemplates'

export const actionRoll = (
        label: string,
        value: number,
        modifier: number,
        type: AnyRollTemplate['type']
) => {
        const dispatch = dispatchRef.value as Dispatch;
        const { momentum } = useResourcesStore();
        const formattedDice = formatDiceComponents(actionDice)
        const rollResults = await getRollFromDispatch({ rolls: formattedDice })
        const rolledDice = convertResultsToDice(actionDice, rollResults)

        const rollTemplate = createRollTemplate({
                type: 'move',
                parameters: {
                        characterName: initValues.character.name,
                        title: 'Rolling ' + label,
                        dice: rolledDice,
                        label: move.Name,
                        value,
                        momentum,
                        modifier
                }
        });


}

export const sendRollToChat = () => {
        const rollTemplate = createRollTemplate({
                type: 'move',
                parameters: {
                        characterName: initValues.character.name,
                        title: 'Rolling ' + label,
                        dice: rolledDice,
                        label: move.Name,
                        value,
                        momentum,
                        modifier
                }
        });

        await dispatch.post({
                characterId: initValues.character.id,
                content: rollTemplate,
                options: {
                        whisper: undefined,
                        secret: undefined,
                },
        });

}
