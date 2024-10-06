<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { rollMove, moveOptionsCheck } from '@/utility/rollMove';
import { ref } from 'vue';
import { useResourcesStore } from '@/sheet/stores/resources/resourcesStore';
import { followUpRoll } from '@/utility/rollMove';
import { IMove } from 'dataforged';

import { Icon } from '@iconify/vue';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { resourceValues } from '@/utility/moveChecks';
import { Effect } from 'effect';
import { useAssetStore } from '@/sheet/stores/assets/assetStore';
import { starforged } from 'dataforged';
import { Group } from 'lucide-vue-next';

defineProps({
  group: {
    type: Object,
    required: true,
  },
  showTriggers: {
    type: Boolean,
    default: false
  }
});

const getDfAssets = () => starforged['Asset Types']

const alterMove = (alteredMoves, move: IMove) => { return move }

const assetCheck = (move: IMove) => {
  // TODO: Check assets for alter moves / Triggers
  selectedMove.value = move;
  const hasAssetTriggers = false;
  // Get assets from store
  const playerAssets = useAssetStore().assets
  const activeAssetAbilities = playerAssets.map((asset) => {
    const enabledAbilities = asset.abilities.filter((abilitiy) => abilitiy.enabled === true)
    if(enabledAbilities.length > 0) {
      return enabledAbilities
    }
    return []
  }).flat()
  const activeDataforgedAbilities = activeAssetAbilities.map((ability) => {
    const matchedAssetType = starforged['Asset Types'].find((assetType) => ability.dataforgedId.includes(assetType.$id))
    const matchedAsset = matchedAssetType?.Assets.find((asset) => ability.dataforgedId.includes(asset.$id))
    const matchedAbility = matchedAsset?.Abilities.find((dfAbility) => ability.dataforgedId === dfAbility.$id)
    return matchedAbility
  })
  const alterMoves = activeDataforgedAbilities.map((ability) => {
    return ability?.['Alter Moves']
  }).flat()
  const validMoves = alterMoves.filter((alterMove) => alterMove?.Moves?.includes(move.$id))
  const unknownMoves = alterMoves.filter((alterMove) => alterMove?.Moves === null)
  console.log('validMoves', validMoves)
  console.log('unknownMoves', unknownMoves)
  // TODO: Enrich alter moves
  const enrichedAlters = validMoves
  const alteredMoves = alterMove(validMoves, move)
  unknownMoves.length > 0 ? (assetSelectionDialog.value = true) : optionsCheck(alterMoves)

  // If true
  // Enrich alter move with missing data
  // Setup Trigger state
  // Show dialog
  // else
  // move on
  hasAssetTriggers ? (assetSelectionDialog.value = true) : optionsCheck(move);
};

const optionsCheck = (move: IMove) => {
  const hasMultipleOptions = moveOptionsCheck(move);
  hasMultipleOptions
    ? (optionSelectionDialog.value = true)
    : moveRoll(selectedMove.value.Trigger.Options[0]);
};


const moveRoll = async (option: any) => {
  console.log(selectedOption);
  console.log('option', option);
  const value = Effect.runSync(resourceValues(option));
  const result = await rollMove(option, null, value, 0, option);
  currentResult.value = result;
  if (result.momentumBurn.eligibility) {
    momentumBurnDialog.value = result.momentumBurn.eligibility;
  } else {
    await preFollowUpRoll({ burn: false });
  }
};

const currentResult = ref();
const selectedMove = ref();
const selectedOption = ref();
const momentumBurnDialog = ref(false);
const optionSelectionDialog = ref(false);
const assetSelectionDialog = ref(false);
const resourcesStore = useResourcesStore();


const selectOptionAndRoll = () => {
  moveRoll(selectedOption.value);
};

const preFollowUpRoll = async (opts: any) => {
  if (opts.burn) {
    resourcesStore.momentum = resourcesStore.momentumReset;
    currentResult.value.outcome = currentResult.value.momentumBurn.newOutcome;
  }
  await followUpRoll(currentResult.value);
};

const doesMoveHaveRoll = (move: IMove) =>
  move.Trigger.Options?.some(
    (option: any) =>
      option['Roll type'] === 'Action roll' || option['Roll type'] === 'Progress roll',
  );

</script>

<template>
  <div class="moves-group break-inside-avoid-column">
    <AlertDialog v-model:open="momentumBurnDialog">
      <AlertDialogTrigger />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eligible for a Momentum Burn</AlertDialogTitle>
          <AlertDialogDescription>
            Do you want to burn momentum?
            <br />
            The current outcome is: {{ currentResult.outcome }}
            <br />
            The new outcome will be: {{ currentResult.momentumBurn.newOutcome }}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel @click="preFollowUpRoll({ burn: false })">No</AlertDialogCancel>
          <AlertDialogAction @click="preFollowUpRoll({ burn: true })">Burn</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    <AlertDialog v-model:open="optionSelectionDialog">
      <AlertDialogTrigger />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Select option</AlertDialogTitle>
          <AlertDialogDescription>
            <Select v-model="selectedOption">
              <SelectTrigger>
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem v-for="option in selectedMove.Trigger.Options" :value="option">{{
                    option.Text
                  }}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction @click="selectOptionAndRoll()">Submit</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    <!-- <Card class="m-0 h-full p-0 pb-1"> -->
      <!-- <CardHeader class="mb-1 rounded-t-lg bg-card-input px-1 py-0">
        <CardTitle class="text-lg font-normal">{{ group.Name }}</CardTitle>
      </CardHeader> -->
      <div>{{ group.Name }}</div>
      <!-- <CardContent v-for="move in group.Moves"> -->
        <Card v-for="move in group.Moves" class="cursor-pointer text-sm mx-1 p-0 my-1 bg-card-input/[0.4] hover:bg-card-input/[0.6]">
          <div class="flex items-center h7 my-1">
            <!-- <div class="button-container h-7 mr-1 w-7 items-center leading-3">
              <Button
                v-if="doesMoveHaveRoll(move)"
                @click="assetCheck(move)"
                class="h-6 content-center border-primary bg-muted px-0 py-0 font-bold leading-3 text-primary hover:bg-muted-accent"
              >
                <Icon icon="tabler:dice-6" height="h-7" />
              </Button>
            </div> -->
            <span class="ml-1 font-bold">{{ move.Name }}</span>
          </div>
          <div v-if="showTriggers" class="p-1 rounded-b-lg">
            {{ move.Trigger.Text }}
          </div>
        </Card>
      <!-- </CardContent> -->
    <!-- </Card> -->
  </div>
</template>
