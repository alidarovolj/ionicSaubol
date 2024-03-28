import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsBlock from "@/components/TabsBlock.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('../views/AuthLogin.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: TabsBlock,
    children: [
      {
        path: 'main',
        component: () => import('../views/MainPage.vue'),
        meta: { requiresAuth: true }
      },
    ],
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (to.meta.requiresAuth && !token) {
    next({ path: '/' }); // redirect to login page
  } else {
    next();
  }
});

export default router
