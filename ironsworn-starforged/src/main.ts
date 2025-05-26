import { createPinia } from 'pinia';
import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import { Effect } from 'effect';

import App from './App.vue';
import router from './router';

import './sheet/scss/index.scss';
import './sheet/css/index.css';

import { createRelay, machine } from './external/relay';
import { createActor } from 'xstate';

// @ts-ignore
const env = import.meta.env.MODE || '';
// Determines if the offline mode dev relay should be used
const isDevEnvironment = ['development', 'test'].includes(env);

const main = async () => {
  const pinia = createPinia();
  const i18n = createI18n({});
  const app = createApp(App);
  // const syncActor = createActor(machine);
  const { relayPinia, relayVue } = await Effect.runPromise(
    createRelay({
      devMode: isDevEnvironment,
    }),
  );

  // syncActor.subscribe((snapshot) => {
  //   const matched = snapshot.matches();
  // });
  // syncActor.start();
  app.use(pinia);
  app.use(router);
  app.use(i18n);
  app.use(relayVue);
  pinia.use(relayPinia);

  app.mount('#app');
};

main();
