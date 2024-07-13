<template>
    <div>
        {{ list }}
    </div>
</template>

<script setup lang="ts">
import { useImpactsStore } from '../../sheet/stores/impacts/impactsStore'
const { list } = useImpactsStore();
</script>