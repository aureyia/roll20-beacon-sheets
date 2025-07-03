import { createRouter, createWebHistory } from 'vue-router'
import ModeSelectView from '@/views/_common/ModeSelectView.vue'

import {
    StandardAssetsView,
    StandardConnectionsView,
    StandardLegaciesView,
    StandardMainView,
    StandardMovesDetailView,
    StandardMovesOverView,
    StandardMovesView,
    StandardProgressView,
    StandardSimView,
    StandardSummaryView,
    StandardVowsView,
} from '@/views/character_standard'
import { SharedMainView } from '@/views/shared'
import {
    EdgeAssetsView,
    EdgeConnectionsView,
    EdgeLegaciesView,
    EdgeMainView,
    EdgeMovesView,
    EdgeProgressView,
    EdgeSummaryView,
    EdgeVowsView,
} from './views/character_edge'
import { GuideMainView, GuideOraclesView } from './views/guide'
import { LocationsMainView } from './views/locations'
import { OraclesMainView } from './views/oracles'
import { ShipMainView } from './views/ship'

const characterStandardViews: any = {
    summary: StandardSummaryView,
    assets: StandardAssetsView,
    connections: StandardConnectionsView,
    legacies: StandardLegaciesView,
    moves: StandardMovesView,
    progress: StandardProgressView,
    vows: StandardVowsView,
    simulation: StandardSimView,
}

const characterEdgeViews: any = {
    summary: EdgeSummaryView,
    assets: EdgeAssetsView,
    connections: EdgeConnectionsView,
    legacies: EdgeLegaciesView,
    moves: EdgeMovesView,
    progress: EdgeProgressView,
    vows: EdgeVowsView,
}

const characterViewList = [
    'assets',
    'connections',
    'legacies',
    'moves',
    'progress',
    'summary',
    'vows',
    'simulation',
]

const characterStandardRoutes = () =>
    characterViewList.map(view => ({
        path: `/${view}`,
        name: `characterStandard${view.charAt(0).toUpperCase() + view.slice(1)}`,
        component: characterStandardViews[view],
        alias: `/character-${view}`,
    }))

const characterEdgeRoutes = () =>
    characterViewList.map(view => ({
        path: `/${view}`,
        name: `characterEdge${view.charAt(0).toUpperCase() + view.slice(1)}`,
        component: characterEdgeViews[view],
        alias: `/character-${view}`,
    }))

const router = createRouter({
    // @ts-ignore
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'mode-select',
            component: ModeSelectView,
        },
        {
            path: '/character/standard',
            name: 'character-standard',
            component: StandardMainView,
            children: [
                {
                    path: '/moves',
                    name: 'characterStandardMoves',
                    component: StandardMovesView,
                    alias: '/character-moves',
                    children: [
                        {
                            path: '/overview',
                            name: 'characterStandardMovesOverView',
                            component: StandardMovesOverView,
                            alias: '/character-moves-overview',
                        },
                        {
                            path: '/detail-view',
                            name: 'characterStandardMovesDetailView',
                            component: StandardMovesDetailView,
                            alias: '/character-moves-detail-view',
                        },
                    ],
                },
                ...characterStandardRoutes(),
            ],
        },
        {
            path: '/character/edge',
            name: 'character-edge',
            component: EdgeMainView,
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
            path: '/oracles',
            name: 'oracles',
            component: OraclesMainView,
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
})
export default router
