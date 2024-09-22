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
import { getValue, resourceValues } from '@/utility/moveChecks';
import { Effect } from 'effect';

defineProps({
  group: {
    type: Object,
    required: true,
  },
});

const assetCheck = (move: IMove) => {
  // TODO: Check assets for alter moves / Triggers
  selectedMove.value = move;
  const hasAssetTriggers = false;
  hasAssetTriggers ? (assetSelectionDialog.value = true) : optionsCheck(move);
};

const optionsCheck = (move: IMove) => {
  const hasMultipleOptions = moveOptionsCheck(move);
  hasMultipleOptions ? (optionSelectionDialog.value = true) : moveRoll({ multiOption: false });
};

const moveRoll = async (opts = {}) => {
  console.log(selectedOption);
  if (opts.multiOption === false) {
    selectedOption.value = selectedMove.value.Trigger.Options[0];
  }
  const value = Effect.runSync(resourceValues(selectedOption.value));
  const result = await rollMove(selectedMove.value, null, value, 0, selectedOption.value);
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
          <AlertDialogAction @click="moveRoll()">Submit</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    <Card class="m-0 h-full p-0 pb-1">
      <CardHeader class="mb-1 rounded-t-lg bg-card-input p-1">
        <CardTitle class="text-xl font-normal">{{ group.Name }}</CardTitle>
      </CardHeader>
      <CardContent v-for="move in group.Moves" class="mx-1 flex h-7 items-center p-0">
        <div class="button-container mr-1 w-7 items-center leading-3">
          <Button
            v-if="doesMoveHaveRoll(move)"
            @click="assetCheck(move)"
            class="h-6 content-center border-primary bg-muted px-0 py-0 font-bold leading-3 text-primary hover:bg-muted-accent"
          >
            <Icon icon="tabler:dice-6" height="h-7" />
          </Button>
        </div>
        <span class="leading-none">{{ move.Name }}</span>
      </CardContent>
    </Card>
  </div>
</template>
