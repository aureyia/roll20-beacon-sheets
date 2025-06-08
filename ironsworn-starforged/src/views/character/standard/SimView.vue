<script setup lang="ts">
import { postRef } from '@/main';
import { metaStore } from '@/external/store';
import { characterStore } from '@/system/character/store';
import { resourcesStore } from '@/system/resources/store';
import { impactsStore } from '@/system/impacts/store';
import { momentumStore } from '@/system/momentum/store';
import { assetsStore } from '@/system/assets/store';
import { statsStore } from '@/system/stats/store';
import { tasksStore } from '@/system/tasks/store';
import { settingsStore } from '@/system/settings/store';
import Card from '@/components/ui/card/Card.vue';
import { rollSpeed } from '@/main';
import { intensity } from '@/main';
import { replaySeed, seed } from '@/simulation/generate-rolls';

import { cn } from '@/utility';
import { inject } from 'vue';

const stores = {
  character: characterStore,
  resources: resourcesStore,
  stats: statsStore,
  impacts: impactsStore,
  assets: assetsStore,
  tasks: tasksStore,
  settings: settingsStore,
  momentum: momentumStore,
  meta: metaStore,
};
</script>

<template>
  <div class="mt-50 mx-auto flex gap-10">
    <div></div>
    <div>
      <h2 class="mt-2 text-xl">Current Seed</h2>
      <div>{{ seed.get() }}</div>
      <h2 class="my-2 text-xl">Roll Display</h2>
      <div class="w-[250px]" v-if="postRef" v-html="postRef.content" />
    </div>
    <div class="w-[830px]">
      <h2 class="text-xl">Stores</h2>
      <div class="flex flex-wrap gap-2">
        <Card
          class="w-[270px] p-0 drop-shadow-sm"
          v-for="(store, key) in stores"
        >
          <CardHeader class="px-auto mt-0 pb-1 pt-2">
            <CardTitle class="text-[18px] uppercase">{{ key }}</CardTitle>
          </CardHeader>
          <CardContent class="mt-0 p-4 text-sm">
            <div v-if="key === 'meta'">
              <div
                class="m-auto rounded bg-muted-secondary p-2 text-center drop-shadow-sm"
              >
                <strong>Name</strong>
                <p>{{ store.getSnapshot().context.name }}</p>
              </div>
            </div>
            <div v-else-if="key === 'momentum'">
              <div
                class="m-auto rounded bg-muted-secondary p-2 text-center drop-shadow-sm"
              >
                <strong>Value</strong>
                <p>{{ store.getSnapshot().context.momentum }}</p>
              </div>
            </div>
            <div v-else-if="key === 'character'" class="flex">
              <div
                class="m-auto rounded bg-muted-secondary p-2 text-center drop-shadow-sm"
              >
                <strong>Callsign</strong>
                <p>{{ store.getSnapshot().context.callsign }}</p>
              </div>
              <div
                class="m-auto rounded bg-muted-secondary p-2 text-center drop-shadow-sm"
              >
                <strong>Pronouns</strong>
                <p>{{ store.getSnapshot().context.pronouns }}</p>
              </div>
            </div>
            <div
              v-else-if="key === 'resources'"
              class="flex flex-wrap justify-center gap-4"
            >
              <div
                class="w-16 rounded bg-muted-secondary p-1 text-center drop-shadow-sm"
              >
                <strong>Health</strong>
                <div class="text-center">
                  {{ store.getSnapshot().context.health }}
                </div>
              </div>
              <div
                class="w-16 rounded bg-muted-secondary p-1 text-center drop-shadow-sm"
              >
                <strong>Spirit</strong>
                <div class="text-center">
                  {{ store.getSnapshot().context.spirit }}
                </div>
              </div>
              <div
                class="w-16 rounded bg-muted-secondary p-1 text-center drop-shadow-sm"
              >
                <strong>Supply</strong>
                <div class="text-center">
                  {{ store.getSnapshot().context.supply }}
                </div>
              </div>
              <div
                class="w-[44%] rounded bg-muted-secondary p-1 text-center drop-shadow-sm"
              >
                <strong>XP</strong>
                <div class="text-center">
                  {{ store.getSnapshot().context.xp }}
                </div>
              </div>
              <div
                class="w-[44%] rounded bg-muted-secondary p-1 text-center drop-shadow-sm"
              >
                <strong>Sp XP</strong>
                <div class="text-center">
                  {{ store.getSnapshot().context.spentXp }}
                </div>
              </div>
            </div>
            <div
              v-else-if="key === 'impacts'"
              class="flex flex-wrap justify-center gap-4"
            >
              <div
                class="w-full rounded bg-muted-secondary p-2 text-center drop-shadow-sm"
              >
                <strong>Misfortunes</strong>
                <p>{{ store.getSnapshot().context.misfortunes.length }}</p>
              </div>
              <div
                class="w-full rounded bg-muted-secondary p-2 text-center drop-shadow-sm"
              >
                <strong>Lasting Effects</strong>
                <p>{{ store.getSnapshot().context.lastingEffects.length }}</p>
              </div>
              <div
                class="w-[46%] rounded bg-muted-secondary p-2 text-center drop-shadow-sm"
              >
                <strong>Burdens</strong>
                <p>{{ store.getSnapshot().context.burdens.length }}</p>
              </div>
              <div
                class="w-[46%] rounded bg-muted-secondary p-2 text-center drop-shadow-sm"
              >
                <strong>Vehicle</strong>
                <p>{{ store.getSnapshot().context.currentVehicle.length }}</p>
              </div>
              <div
                class="w-[100%] rounded bg-muted-secondary p-2 text-center drop-shadow-sm"
              >
                <strong>Other</strong>
                <p>{{ store.getSnapshot().context.other.length }}</p>
              </div>
            </div>
            <div
              v-else-if="key === 'stats'"
              class="flex flex-wrap justify-center gap-4"
            >
              <div
                class="w-16 rounded bg-muted-secondary p-1 text-center drop-shadow-sm"
              >
                <strong>Edge</strong>
                <div class="text-center">
                  {{ store.getSnapshot().context.edge }}
                </div>
              </div>
              <div
                class="w-16 rounded bg-muted-secondary p-1 text-center drop-shadow-sm"
              >
                <strong>Heart</strong>
                <div class="text-center">
                  {{ store.getSnapshot().context.heart }}
                </div>
              </div>
              <div
                class="w-16 rounded bg-muted-secondary p-1 text-center drop-shadow-sm"
              >
                <strong>Iron</strong>
                <div class="text-center">
                  {{ store.getSnapshot().context.iron }}
                </div>
              </div>
              <div
                class="w-[44%] rounded bg-muted-secondary p-1 text-center drop-shadow-sm"
              >
                <strong>Shadow</strong>
                <div class="text-center">
                  {{ store.getSnapshot().context.shadow }}
                </div>
              </div>
              <div
                class="w-[44%] rounded bg-muted-secondary p-1 text-center drop-shadow-sm"
              >
                <strong>Wits</strong>
                <div class="text-center">
                  {{ store.getSnapshot().context.wits }}
                </div>
              </div>
            </div>
            <div v-else-if="key === 'settings'" class="flex">
              <div
                class="m-auto w-24 rounded bg-muted-secondary p-2 text-center drop-shadow-sm"
              >
                <strong>Mode</strong>
                <p>{{ store.getSnapshot().context.mode }}</p>
              </div>
              <div
                class="m-auto w-24 rounded bg-muted-secondary p-2 text-center drop-shadow-sm"
              >
                <strong>Dark Mode</strong>
                <p>{{ store.getSnapshot().context.darkMode }}</p>
              </div>
            </div>
            <div v-else>{{ store.getSnapshot().context }}</div>
          </CardContent>
        </Card>
      </div>
    </div>
    <div class="w-[400px]">
      <h2 class="text-xl">Simulation Settings</h2>
      <div class="mt-3">
        <div>
          <h3>Replay Run</h3>
          <div class="mt-1 flex">
            <Input
              class="mr-2 bg-muted"
              v-model="replaySeed"
              placeholder="Seed"
            />
            <div dir="rtl">
              <Button @click="replaySeed = ''">Clear</Button>
            </div>
          </div>
        </div>
        <div class="mt-4">
          <h3>Roll Delay</h3>
          <Slider
            v-model="rollSpeed"
            :min="50"
            :max="5000"
            :step="50"
            :class="cn('w-3/5', $attrs.class ?? '')"
            class="mb-2 mt-2"
          />
          <span class="text-sm">{{ rollSpeed[0] }} milliseconds</span>
        </div>
        <div class="mt-4">
          <h3>Difficulty</h3>
          <ToggleGroup
            type="single"
            class="w-full justify-between"
            v-model="intensity"
          >
            <ToggleGroupItem
              value="low"
              class="mt-1 bg-secondary px-10 hover:bg-muted-secondary data-[state=on]:bg-muted-foreground data-[state=on]:font-bold data-[state=on]:text-black"
              >Safe</ToggleGroupItem
            >
            <ToggleGroupItem
              value="medium"
              class="mt-1 bg-secondary px-10 hover:bg-muted-secondary data-[state=on]:bg-muted-foreground data-[state=on]:font-bold data-[state=on]:text-black"
              >OOB</ToggleGroupItem
            >
            <ToggleGroupItem
              value="high"
              class="mt-1 bg-secondary px-10 hover:bg-muted-secondary data-[state=on]:bg-muted-foreground data-[state=on]:font-bold data-[state=on]:text-black"
              >Corrupt</ToggleGroupItem
            >
          </ToggleGroup>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="sass">

// TODO: Finish Styling for Roll Templates
rolltemplate.starforged
  display: block
  max-width: 100%
  border-radius: 0.5rem
  background: #3c3c3c
  color: #ffffff
  padding: 0.5em
  font-size: 1rem
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5)
  // font-family: 'Montserrat', sans-serif

  .action-score__warning
    background-color: #783030
    width: 100%
    text-align: center
    border-radius: 0.6em
    padding: 0.2em
    margin-bottom: 0.2rem

  .compact-action-score__warning
    background-color: #783030
    width: 100%
    text-align: center
    border-radius: 0.6em
    padding: 0.2em
    margin-bottom: 0.3rem
    font-size: 0.9rem

  .action-score__col
    flex-direction: column

  .action-score__value
    font-size: 24px
    background-color: neutral
    padding: 0.3em
    border-radius: 0.1em

  .compact-action-score__title
    align-self: center

  .compact-action-score__value
    padding: 0.3rem
    background-color: #545454
    border-radius: 0.3rem
    text-align: center
    width: 1.7rem

  .header
    background-color: #545454
    color: white
    padding: 0.4em 1em
    font-style: italic
    border-radius: 0.7em

  .compact-header
    background-color: #545454
    border-radius: 0.5rem
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5)
    padding: 0.2rem 0.3rem
    font-size: 0.9rem
    font-style: italic

  .roll-outcome,
  .stat__body
    color: white
    padding: 0.4em 1em
    margin: 0.2em 0
    border-radius: 1em

  .compact-stat__body
    padding: 0.5rem

  .compact-challenge-dice
    margin-top: 0.2rem

  .compact-challenge-dice__row,
  .compact-action-score__row
    display: flex
    justify-content: space-between

  .compact-roll-outcome__row
    display: flex

  .compact-challenge-dice__sub-col-1
    margin-right: 0.2rem

  .compact-challenge-dice__col-1
    align-self: center

  .compact-challenge-dice__sub-col-1,
  .compact-challenge-dice__sub-col-2
    padding: 0.3rem
    background: #545454
    border-radius: 0.3rem
    width: 1.7rem
    text-align: center

  .compact-row__gap
    width: 1.4rem

  .action-score__row,
  .challenge-dice__row
    display: flex
    justify-content: space-between
    margin-bottom: 0.3em

  .roll-outcome__row
    display: flex
    justify-content: space-between

  .action-score__title,
  .challenge-dice__col-1,
  .roll-outcome__col-1
    align-content: center
    font-size: 1em

  .stat__footer
    background-color: #545454
    border-radius: 1em
    box-shadow: 0 0 5px 0 rgba(0,0,0,0.5)

  .compact-stat__footer
    background-color: #545454
    border-radius: 0.5rem
    box-shadow: 0 0 5px 0 rgba(0,0,0,0.5)
    line-height: normal

  .compact-roll-outcome__box
    width: 0.7rem
    height: auto
    border-radius: 0.3rem 0rem 0rem 0.3rem

  .compact-roll-outcome__col-1
    margin-right: 0.5rem

  .compact-roll-outcome__col-2
    align-self: center

  .compact-roll-outcome__miss
    background: #ff4d4d
  .compact-roll-outcome__complication
    background: #d22e53
  .compact-roll-outcome__weak-hit
    background: #83dbff
  .compact-roll-outcome__strong-hit
    background: #63a9ca
  .compact-roll-outcome__opportunity
    background: #40819f

  .compact-roll-outcome
    height: 100%
</style>
