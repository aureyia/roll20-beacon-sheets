import type { InitArgs } from '@roll20-official/beacon-sdk'
import { beaconPulse, sheet_init_values } from '@/external/sync'

// onInit is called when the Relay is first loaded.
// It is used to set up the initial values of the sheet.
export const onInit = ({ character, settings, compendiumDropData }: InitArgs) => {
    sheet_init_values.id = character.id
    sheet_init_values.character = character
    sheet_init_values.settings = settings
    sheet_init_values.compendiumDrop = compendiumDropData ? compendiumDropData : null
    console.log('onInit -> Starforged Sheet Relay')
}

// onChange is called when the character data is updated.
// This is where you will update the sheet with the new data.
export const onChange = async ({
    character,
}: {
    // biome-ignore lint: Intentional any
    character: Record<string, any>
}) => {
    // This is a way to trigger a re-render of the sheet,
    // see relay.ts for more information.
    const old = beaconPulse.value
    beaconPulse.value = old + 1
    console.log('onChange -> Starforged Sheet Relay', character)
}

export const onSettingsChange = () => {}

export const onSharedSettingsChange = () => {}

export const onTranslationsRequest = () => ({})

export const onDragOver = () => {}
