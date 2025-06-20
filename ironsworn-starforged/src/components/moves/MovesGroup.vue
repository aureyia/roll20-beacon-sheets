<script setup lang="ts">
import { Card } from '@/components/ui/card'
import { inject } from 'vue'
import { Icon } from '@iconify/vue'

defineProps({
    group: {
        type: Object,
        required: true,
    },
    showTriggers: {
        type: Boolean,
        default: false,
    },
})

const { update_active_move }: any = inject('move')
</script>

<template>
  <div class="moves-group break-inside-avoid-column">
    <div>{{ group.Name }}</div>
    <Card
      v-for="move in group.Moves"
      class="bg-card-input/[0.4] mx-1 my-1 p-0 text-sm"
    >
      <div class="h7 my-1 flex items-center">
        <div class="button-container mr-1 h-7 w-7 items-center leading-3">
          <Button
            @click="update_active_move(move.$id)"
            :data-qa="move.$id"
            class="border-primary bg-muted text-primary hover:bg-muted-accent h-7 w-7 content-center p-0 leading-3 font-bold"
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
