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
import { rollMove } from '@/utility/rollMove';
import { ref } from 'vue';
import { useResourcesStore } from '@/sheet/stores/resources/resourcesStore';
import { followUpRoll } from '@/utility/rollMove';

defineProps({
  group: {
    type: Object,
    required: true,
  },
});

const moveRollMiddleware = async (move: any) => {
  const result = await rollMove(move, null, 2, 0);
  currentResult.value = result;
  if (result.momentumBurn.eligibility) {
    momentumBurnDialog.value = result.momentumBurn.eligibility;
  } else {
    await preFollowUpRoll({ burn: false });
  }
};

const currentResult = ref();
const momentumBurnDialog = ref(false);
const resourcesStore = useResourcesStore();

const preFollowUpRoll = async (opts: any) => {
  if (opts.burn) {
    resourcesStore.momentum = resourcesStore.momentumReset;
    currentResult.value.outcome = currentResult.value.momentumBurn.newOutcome;
  }
  await followUpRoll(currentResult.value);
  console.log(`TODO: Implement Follow-up roll: ${opts.burn}`);
};
</script>

<template>
  <div class="moves-group mb-3 break-inside-avoid-column">
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
    <Card class="m-0 h-full p-0 pb-1">
      <CardHeader class="mb-1 rounded-t-lg bg-card-input p-1">
        <CardTitle class="text-xl font-normal">{{ group.Name }}</CardTitle>
      </CardHeader>
      <CardContent v-for="move in group.Moves" class="mx-2 mt-1 flex p-0">
        <!-- <span class="mr-3">Roll</span> -->
        <Button @click="moveRollMiddleware(move)" class="mr-3 h-auto px-2 py-1"> Roll </Button>
        <span>{{ move.Name }}</span>
      </CardContent>
    </Card>
  </div>
</template>
