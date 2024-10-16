<script setup lang="ts">
import { Card } from '@/components/ui/card';
import { inject } from 'vue';
import { Icon } from '@iconify/vue';

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

const { updateActiveMove }: any = inject('move')
</script>

<template>
  <div class="moves-group break-inside-avoid-column">
    <div>{{ group.Name }}</div>
    <Card v-for="move in group.Moves" class="text-sm mx-1 p-0 my-1 bg-card-input/[0.4]">
      <div class="flex items-center h7 my-1">
        <div class="button-container h-7 mr-1 w-7 items-center leading-3">
          <Button
            @click="updateActiveMove(move.$id)"
            class="h-6 content-center border-primary bg-muted px-0 py-0 font-bold leading-3 text-primary hover:bg-muted-accent"
          >
            <Icon icon="tabler:dice-6" height="h-7" />
          </Button>
        </div>
        <span class="ml-1 font-bold">{{ move.Name }}</span>
      </div>
      <div v-if="showTriggers" class="p-1 rounded-b-lg">
        {{ move.Trigger.Text }}
      </div>
    </Card>
  </div>
</template>
