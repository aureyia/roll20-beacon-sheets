<template>
    <div class="impacts-view row justify-center">
        <div class="impact-category col" v-for="category in Object.keys(defaultImpacts)" :key="category">
            
            {{category}}
           
            <div class="impact-item" v-for="impact in impactStore[category]">
                {{ impactStore.list }}
            </div>
            
            <q-btn rounded color="secondary" @click="openAddImpactDialog(category)">+</q-btn>
            <q-dialog v-model="addImpactMenu.state.value">
                <q-card>
                    <q-card-section>
                        <div class="text-h6">{{addImpactMenu.category.value}}</div>
                    </q-card-section>

                    <q-card-section>
                        <q-select
                            v-model="addImpactMenu.name.value"
                            :options="defaultImpacts[addImpactMenu.category.value]"
                            label="Impact"
                        />
                        <q-input
                            type="textarea"
                            label="Description"
                            v-model="addImpactMenu.description.value"
                        />
                    </q-card-section>
                    <q-card-section>
                        <q-btn 
                            rounded 
                            color="secondary"
                            @click="submitImpact">
                            +
                        </q-btn>
                    </q-card-section>
                </q-card>
            </q-dialog>
            
            <!-- Remove after use -->
            <q-btn rounded color="secondary" @click="openRemoveImpactDialog(category)">-</q-btn>
            <q-dialog v-model="removeImpactMenu.state.value">
                <q-card>
                    {{removeImpactMenu.category.value}}
                    <q-select
                            v-model="removeImpactMenu.name.value"
                            :options="defaultImpacts[removeImpactMenu.category.value]"
                            label="Impact"
                        />
                    <q-btn 
                        rounded 
                        color="secondary"
                        @click="impactStore.removeImpact(
                            removeImpactMenu.name.value,
                            removeImpactMenu.category.value
                        )">
                        -
                    </q-btn>
                </q-card>
            </q-dialog>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useImpactsStore } from '../../sheet/stores/impacts/impactsStore'
import { ref } from 'vue'

const impactStore: any = useImpactsStore();
const addImpactMenu = {
    state: ref(false),
    category: ref(''),
    name: ref(''),
    description: ref('')
}

const removeImpactMenu = {
    state: ref(false),
    category: ref(''),
    name: ref('')
}

const defaultImpacts: { [key: string]: string[] } = {
    misfortunes: [
        'wounded',
        'shaken',
        'unprepared'
    ],
    lastingEffects: [
        'permanently harmed',
        'traumatized'
    ],
    burdens: [
        'doomed',
        'tormented',
        'indebted'
    ],
    currentVehicle: [
        'battered',
        'cursed'
    ],
    other: []
}

function openAddImpactDialog (category: string) {
    addImpactMenu.state.value = true
    addImpactMenu.category.value = category
}

function submitImpact () {
    impactStore.addImpact(
        addImpactMenu.name.value,
        addImpactMenu.category.value,
        addImpactMenu.description.value
    )
    addImpactMenu.state.value = false
    addImpactMenu.category.value = ''
    addImpactMenu.name.value = ''
    addImpactMenu.description.value = ''
}

function openRemoveImpactDialog (category: string) {
    removeImpactMenu.state.value = true
    removeImpactMenu.category.value = category
}
</script>