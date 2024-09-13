<script setup lang="ts">
import Toggle from '@/components/ui/toggle/Toggle.vue';

const difficulties = [ 'troublesome', 'dangerous', 'formidable', 'extreme', 'epic' ]
</script>

<template>
  <div class="difficulty-list mt-2">
    <ToggleGroup type="single">
      <ToggleGroupItem
        class="font-bold hover:border-2 hover:text-primary hover:border-muted-foreground hover:bg-card-button bg-neutral-card-button data-[state=on]:bg-card-button data-[state=on]:border-2 data-[state=on]:border-primary  uppercase w-44 h-8 mx-auto" 
        v-for="difficulty in difficulties" 
        :key="difficulty" 
        :value="difficulty"
      >
        {{ difficulty }}
      </ToggleGroupItem>
    </ToggleGroup>
  </div>
</template>