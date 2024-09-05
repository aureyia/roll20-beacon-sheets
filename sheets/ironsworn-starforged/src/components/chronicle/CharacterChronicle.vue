<template>
    <div class="chronicle">
        <q-btn rounded color="secondary" @click="addChronicleEntryMenu = true">+</q-btn>
        <q-timeline layout="loose">
            <q-timeline-entry heading>
                Chronicle
            </q-timeline-entry>
            <q-timeline-entry v-for="entry, index in chronicleStore.chronicle"
                :title="entry.title"
                :subtitle="entry.subtitle"
                :side="index % 2 === 0 ? 'left' : 'right'"
            >
                <div>
                    {{entry.body}}
                </div>
                <q-btn rounded color="secondary" @click="chronicleStore.removeChronicleEntry(entry._id)">-</q-btn>
            </q-timeline-entry>
        </q-timeline>

        <q-dialog v-model="addChronicleEntryMenu">
            <q-card>
                <q-form
                    @submit="submitChronicleEntry"
                    @reset="resetChronicleEntry"
                >
                    <q-card-section>
                        <div class="text-h6">Add entry to the chronicle</div>
                    </q-card-section>

                    <q-card-section>
                        <q-input 
                            v-model="chroncileEntrySubmission.title"
                            type="text"
                            label="Title *"
                            lazy-rules
                            :rules="[ val => val && val.length > 0 || 'Please add a title']"
                        />
                        <q-input 
                            v-model="chroncileEntrySubmission.subtitle"
                            type="text"
                            label="Subtitle"
                        />
                        <q-input
                            type="textarea"
                            label="Description *"
                            v-model="chroncileEntrySubmission.body"
                            lazy-rules
                            :rules="[ val => val && val.length > 0 || 'Please add a description']"
                        />
                        <!-- <q-input 
                            v-model="chroncileEntrySubmission.tags"
                            type="text" 
                        />
                        <q-input 
                            v-model="chroncileEntrySubmission.locations"
                            type="text" 
                        />
                        <q-input 
                            v-model="chroncileEntrySubmission.connections"
                            type="text" 
                        /> -->
                    </q-card-section>
                    <q-card-section>
                        <q-btn
                            type="submit"
                            color="secondary"
                            label="Submit"
                        />
                        <q-btn
                            type="reset"
                            color="secondary"
                            label="Reset"
                        />
                    </q-card-section>
                </q-form>
            </q-card>
        </q-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useChronicleStore, type ChronicleEntrySubmission } from '../../sheet/stores/chronicle/chronicleStore'

const addChronicleEntryMenu = ref(false)
const chronicleStore = useChronicleStore()
const chroncileEntrySubmission = ref<ChronicleEntrySubmission>({
    title: '',
    subtitle: undefined,
    body: '',
})

function submitChronicleEntry () {
    chronicleStore.addChronicleEntry(chroncileEntrySubmission.value)
}

function resetChronicleEntry () {
 
}
</script>