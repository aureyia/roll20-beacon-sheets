import { createPinia } from 'pinia';
import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import { Quasar } from 'quasar'

import App from './App.vue';
import router from './router';

import './sheet/scss/index.scss';

import 'quasar/src/css/index.sass'
import '@quasar/extras/material-icons/material-icons.css'

import { createRelay } from './relay/relay';

// @ts-ignore
const env = import.meta.env.MODE || '';
// Determines if the offline mode dev relay should be used
const isDevEnvironment = ['development', 'test'].includes(env);

const main = async () => {
  const pinia = createPinia();
  const i18n = createI18n({});
  const app = createApp(App);
  const { relayPinia, relayVue } = await createRelay({ devMode: isDevEnvironment });

  app.use(pinia);
  app.use(router);
  app.use(i18n);
  app.use(relayVue);
  app.use(Quasar, {
    // config: { dark: 'auto' },
    plugins: {},
  });
  pinia.use(relayPinia);

  app.mount('#app');
};

main();
