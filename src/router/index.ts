import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LineApp.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/home",
      name: "Home",
      component: HomeView,
    },
    {
      path: "/upload",
      name: "Upload",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("@/views/UploadView.vue"),
    },
    {
      path: "/",
      name: "Login",
      component: LoginView,
    },
  ],
});

export default router;
