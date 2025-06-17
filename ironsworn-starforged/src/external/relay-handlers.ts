import type { InitArgs } from '@roll20-official/beacon-sdk'
import { beaconPulse, initValues } from '@/external/sync'

// onInit is called when the Relay is first loaded.
// It is used to set up the initial values of the sheet.
export const onInit = ({
  character,
  settings,
  compendiumDropData,
}: InitArgs) => {
  initValues.id = character.id
  initValues.character = character
  initValues.settings = settings
  initValues.compendiumDrop = compendiumDropData ? compendiumDropData : null
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
