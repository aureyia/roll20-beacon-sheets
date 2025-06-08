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
    default: false,
  },
});

const { updateActiveMove }: any = inject('move');
</script>

<template>
  <div class="moves-group break-inside-avoid-column">
    <div>{{ group.Name }}</div>
    <Card
      v-for="move in group.Moves"
      class="mx-1 my-1 bg-card-input/[0.4] p-0 text-sm"
    >
      <div class="h7 my-1 flex items-center">
        <div class="button-container mr-1 h-7 w-7 items-center leading-3">
          <Button
            @click="updateActiveMove(move.$id)"
            class="h-7 w-7 content-center border-primary bg-muted p-0 font-bold leading-3 text-primary hover:bg-muted-accent"
          >
            <Icon
              icon="tabler:dice-6"
              :style="{ height: '24px', width: '24px' }"
            />
          </Button>
        </div>
        <span class="ml-1 font-bold">{{ move.Name }}</span>
      </div>
      <div v-if="showTriggers" class="rounded-b-lg p-1">
        {{ move.Trigger.Text }}
      </div>
    </Card>
  </div>
</template>
