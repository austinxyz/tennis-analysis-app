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
        component: () => import("../views/ZijingView.vue"),
        children: [
          {
            path: "team",
            component: () => import("../views/TeamView.vue"),
          },
          {
            path: "analysis",
            component: () => import("../views/TeamComparationView.vue"),
          },
        ]
    },
    {
      path: "/utr",
      name: "utr",
      component: () => import("../views/UTRView.vue"),
      children: [
        {
        path: "event",
        component: () => import("../views/EventView.vue"),
        },
        {
          path: "bat",
          component: () => import("../views/ClubView.vue"),
        },
        {
          path: "single",
          component: () => import("../views/SingleAnalysisView.vue"),
        },
      ]
    },
    {
      path: "/playersearch",
      name: "Player",
      component: () => import("../views/PlayerSearchView.vue"),
    },
    {
      path: "/usta",
      name: "usta",
      component: () => import("../views/USTAView.vue"),
      children: [
        {
            path: 'team',
            component:() => import("../views/USTATeamView.vue"),
        }
      ]
    },
  ],
});

export default router;
