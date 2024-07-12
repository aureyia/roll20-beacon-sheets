import { createRouter, createWebHistory } from 'vue-router';
import SummaryView from '../views/SummaryView.vue';
import AssetsView from '../views/AssetsView.vue';
import ConnectionsView from '../views/ConnectionsView.vue';
import LegaciesView from '../views/LegaciesView.vue';
import MovesView from '../views/MovesView.vue';
import OraclesView from '../views/OraclesView.vue';
import ProgressView from '../views/ProgressView.vue';
import ShipView from '../views/ShipView.vue';
import VowsView from '../views/SettingsView.vue';

/*
 * Vue Router is used for switching between the 2 different views in the sheet.
 * It's a good solution for when using tabs, character builder, settings page, etc.
 * */
const router = createRouter({
  // @ts-ignore
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/summary',
      name: 'summary',
      component: SummaryView,
      alias: '/',
    },
    {
      path: '/assets',
      name: 'assets',
      component: AssetsView,
    },
    {
      path: '/connections',
      name: 'connections',
      component: ConnectionsView,
    },
    {
      path: '/legacies',
      name: 'legacies',
      component: LegaciesView,
    },
    {
      path: '/moves',
      name: 'moves',
      component: MovesView,
    },
    {
      path: '/oracles',
      name: 'oracles',
      component: OraclesView,
    },
    {
      path: '/progress',
      name: 'progress',
      component: ProgressView,
    },
    {
      path: '/ship',
      name: 'ship',
      component: ShipView,
    },
    {
      path: '/vows',
      name: 'vows',
      component: VowsView,
    },
  ],
});
export default router;
