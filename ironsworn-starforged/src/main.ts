import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import { Effect } from 'effect';

import App from './App.vue';
import router from './router';

import './sheet/scss/index.scss';
import './sheet/css/index.css';

import { getVueRelay } from './external/vue.relay';
import { syncPlugin } from './external/sync';
import { busPlugin } from './external/bus';

// @ts-ignore
const env = import.meta.env.MODE || '';
// Determines if the offline mode dev relay should be used
const isDevEnvironment = ['development', 'test'].includes(env);

(async () => {
  const i18n = createI18n({});
  const app = createApp(App);

  const { vueRelay, dispatch } = await Effect.runPromise(getVueRelay());
  const sync = syncPlugin(dispatch);
  const bus = busPlugin();

  app.use(router);
  app.use(i18n);
  app.use(sync);
  app.use(bus);
  app.use(vueRelay);

  app.mount('#app');
})();

// const MainLive = pipe(
//   main()
// )

// BrowserRuntime.runMain(MainLive);
