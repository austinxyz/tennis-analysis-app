import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "about",
      component: () => import("../views/AboutView.vue"),
    },
    {
        path: "/zijing",
        name: "zijing",
        component: () => import("../views/zijing/ZijingView.vue"),
        children: [
          {
            path: "team",
            component: () => import("../views/zijing/TeamView.vue"),
          },
          {
            path: "analysis",
            component: () => import("../views/zijing/TeamComparationView.vue"),
          },
        ]
    },
    {
      path: "/utr",
      name: "utr",
      component: () => import("../views/utr/UTRView.vue"),
      children: [
        {
            path: "event",
            component: () => import("../views/utr/EventView.vue"),
        },
        {
            path: "bat",
            component: () => import("../views/utr/ClubView.vue"),
        },
        {
            path: "single",
            component: () => import("../views/utr/SingleAnalysisView.vue"),
        },
        {
            path: 'player',
            component:() => import("../views/utr/UTRPlayerSearchView.vue"),
        }
      ]
    },
    {
      path: "/usta",
      name: "usta",
      component: () => import("../views/usta/USTAView.vue"),
      children: [
        {
            path: 'league',
            component:() => import("../views/usta/USTALeagueView.vue"),
        },
        {
            path: 'candidateteam',
            component:() => import("../views/usta/USTACandidateTeamView.vue"),
        },
        {
            path: 'team',
            component:() => import("../views/usta/USTATeamSearchView.vue"),
        },
        {
            path: 'player',
            component:() => import("../views/usta/USTAPlayerFinderView.vue"),
        },
        {
            path: 'teamanalysis',
            component:() => import("../views/usta/USTATeamComparationView.vue"),
        },
        {
            path: 'playerstat',
            component:() => import("../views/usta/USTAPlayerStatView.vue"),
        }
      ]
    },
    {
      path: "/event",
      name: "event",
      component: () => import("../views/event/EventView.vue"),
      children: [
        {
            path: 'buildteam',
            component:() => import("../views/event/CandidateView.vue"),
        }
      ]
    },
  ],
});

export default router;
