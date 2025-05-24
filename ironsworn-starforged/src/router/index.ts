import { createRouter, createWebHistory } from 'vue-router';
import ModeSelectView from '@/views/_common/ModeSelectView.vue';

import {
  MainView as CharacterStandardMainView,
  AssetsView as CharacterStandardAssetsView,
  ConnectionsView as CharacterStandardConnectionsView,
  LegaciesView as CharacterStandardLegaciesView,
  MovesView as CharacterStandardMovesView,
  ProgressView as CharacterStandardProgressView,
  SummaryView as CharacterStandardSummaryView,
  VowsView as CharacterStandardVowsView,
  MovesOverView as CharacterStandardMovesOverView,
  MovesDetailView as CharacterStandardMovesDetailView,
} from '@/views/character/standard';

import {
  MainView as CharacterEdgeMainView,
  AssetsView as CharacterEdgeAssetsView,
  ConnectionsView as CharacterEdgeConnectionsView,
  LegaciesView as CharacterEdgeLegaciesView,
  MovesView as CharacterEdgeMovesView,
  ProgressView as CharacterEdgeProgressView,
  SummaryView as CharacterEdgeSummaryView,
  VowsView as CharacterEdgeVowsView,
} from '../views/character/edge';

import {
  MainView as GuideMainView,
  OraclesView as GuideOraclesView,
} from '@/views/guide';

import { MainView as LocationsMainView } from '@/views/locations';
import { MainView as OrcalesMainView } from '@/views/orcales';
import { MainView as SharedMainView } from '@/views/ship';
import { MainView as ShipMainView } from '@/views/ship';

const characterStandardViews: any = {
  summary: CharacterStandardSummaryView,
  assets: CharacterStandardAssetsView,
  connections: CharacterStandardConnectionsView,
  legacies: CharacterStandardLegaciesView,
  moves: CharacterStandardMovesView,
  progress: CharacterStandardProgressView,
  vows: CharacterStandardVowsView,
};

const characterEdgeViews: any = {
  summary: CharacterEdgeSummaryView,
  assets: CharacterEdgeAssetsView,
  connections: CharacterEdgeConnectionsView,
  legacies: CharacterEdgeLegaciesView,
  moves: CharacterEdgeMovesView,
  progress: CharacterEdgeProgressView,
  vows: CharacterEdgeVowsView,
};

const characterViewList = [
  'assets',
  'connections',
  'legacies',
  'moves',
  'progress',
  'summary',
  'vows',
];

const charactercStandardRoutes = () =>
  characterViewList.map((view) => ({
    path: `/${view}`,
    name: `characterStandard${view.charAt(0).toUpperCase() + view.slice(1)}`,
    component: characterStandardViews[view],
    alias: `/character-${view}`,
  }));

const characterEdgeRoutes = () =>
  characterViewList.map((view) => ({
    path: `/${view}`,
    name: `characterEdge${view.charAt(0).toUpperCase() + view.slice(1)}`,
    component: characterEdgeViews[view],
    alias: `/character-${view}`,
  }));

const router = createRouter({
  // @ts-ignore
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'root',
      component: ModeSelectView,
    },
    {
      path: '/character/standard',
      name: 'character-standard',
      component: CharacterStandardMainView,
      children: [
        {
          path: '/moves',
          name: 'characterStandardMoves',
          component: CharacterStandardMovesView,
          alias: '/character-moves',
          children: [
            {
              path: '/overview',
              name: 'characterStandardMovesOverView',
              component: CharacterStandardMovesOverView,
              alias: '/character-moves-overview',
            },
            {
              path: '/detail-view',
              name: 'characterStandardMovesDetailView',
              component: CharacterStandardMovesDetailView,
              alias: '/character-moves-detail-view',
            },
          ],
        },
        ...charactercStandardRoutes(),
      ],
    },
    {
      path: '/character/edge',
      name: 'character-edge',
      component: CharacterEdgeMainView,
      children: [...characterEdgeRoutes()],
    },
    {
      path: '/guide',
      name: 'guide',
      component: GuideMainView,
      children: [
        {
          path: 'oracles',
          name: 'guideOracles',
          component: GuideOraclesView,
        },
      ],
    },
    {
      path: '/locations',
      name: 'locations',
      component: LocationsMainView,
    },
    {
      path: '/orcales',
      name: 'orcales',
      component: OrcalesMainView,
    },
    {
      path: '/ship',
      name: 'ship',
      component: ShipMainView,
    },
    {
      path: '/shared',
      name: 'shared',
      component: SharedMainView,
    },
  ],
});
export default router;
