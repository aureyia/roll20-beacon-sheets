import { createStore } from '@xstate/store'

type Log = {
  seed: string
  name: string
  data: any
}

type Event = {
  seed: string
  name: string
  origin: string
  context: any
}

export const metricsStore = createStore({
  context: {
    logs: [] as Log[],
    events: [] as Event[],
  },
  on: {
    saveLog: (context, log: Log) => {
      context.logs.push(log)
    },
    saveEvent: (context, event: Event) => {
      context.events.push(event)
    },
  },
})
