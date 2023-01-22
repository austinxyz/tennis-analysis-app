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
            path: 'team',
            component:() => import("../views/usta/USTATeamView.vue"),
        },
        {
            path: 'player',
            component:() => import("../views/usta/USTAPlayerSearchView.vue"),
        },
        {
            path: 'playerfinder',
            component:() => import("../views/usta/USTAPlayerFinderView.vue"),
        }
      ]
    },
  ],
});

export default router;
