import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import { Effect } from 'effect';

import App from './App.vue';
import router from './router';

import './sheet/scss/index.scss';
import './sheet/css/index.css';

import { sheetRelayPlugin } from './external/vue.relay';
import { syncPlugin } from './external/sync';
import { storeRelay } from './external/store.relay';
import { simRelayPlugin, simRunner } from './simulation/simulator';

// @ts-ignore
const env = import.meta.env.MODE || '';
// Determines if the offline mode dev relay should be used
const isDevEnvironment = ['development', 'test'].includes(env);
const isSimEnvironment = env === 'simulation';

(async () => {
  const i18n = createI18n({});
  const app = createApp(App);

  const { sheetRelay, dispatch } = await Effect.runPromise(
    isSimEnvironment ? simRelayPlugin() : sheetRelayPlugin(isDevEnvironment)
  );
  const sync = syncPlugin(dispatch);

  app.use(router);
  app.use(i18n);
  app.use(sync);
  app.use(sheetRelay);
  
  Effect.runFork(storeRelay);
  if (isSimEnvironment) Effect.runFork(simRunner);

  app.mount('#app');
})();
