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
      path: "/team",
      name: "team",
      component: () => import("../views/TeamView.vue"),
    },
    {
      path: "/analysis",
      name: "Analysis",
      component: () => import("../views/TeamComparationView.vue"),
    },
    {
      path: "/event",
      name: "Event",
      component: () => import("../views/EventView.vue"),
    },
    {
      path: "/playersearch",
      name: "Player",
      component: () => import("../views/PlayerSearchView.vue"),
    },
  ],
});

export default router;
