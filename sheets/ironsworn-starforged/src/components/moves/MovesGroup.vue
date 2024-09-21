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
} from '@/components/ui/alert-dialog'
import { rollMove } from '@/utility/rollMove';
import { ref }  from 'vue'
import { useResourcesStore } from '@/sheet/stores/resources/resourcesStore';


defineProps({
  group: {
    type: Object,
    required: true
  }
})

const moveRollMiddleware = async () => {
  const result = await rollMove(null, null, 2, 0)
  currentResult.value = result
  momentumBurnDialog.value = result.momentumBurn.eligibility
  console.log(result)
}

const currentResult = ref()
const momentumBurnDialog = ref(false)
const resourcesStore = useResourcesStore()

const followUpRoll = (burn: boolean) => {
  if (burn) {
    resourcesStore.momentum = resourcesStore.momentumReset
  }
  console.log(`TODO: Implement Follow-up roll: ${burn}`)
}
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
          <br>
          The current outcome is: {{ currentResult.outcome }}
          <br>
          The new outcome will be: {{ currentResult.momentumBurn.newOutcome }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel @click="followUpRoll(false)">No</AlertDialogCancel>
        <AlertDialogAction @click="followUpRoll(true)">Burn</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
    <Card class="p-0 pb-1 m-0 h-full">
      <CardHeader class="p-1 rounded-t-lg bg-card-input mb-1">
        <CardTitle class="text-xl font-normal">{{ group.Name }}</CardTitle>
      </CardHeader>
      <CardContent v-for="move in group.Moves" class="p-0 mx-2 mt-1 flex">
        <!-- <span class="mr-3">Roll</span> -->
        <Button @click="moveRollMiddleware" class="mr-3 py-1 px-2 h-auto"> Roll </Button>
        <span>{{ move.Name }}</span>
      </CardContent>
    </Card>
  </div>
</template>

