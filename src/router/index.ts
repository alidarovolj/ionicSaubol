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
        path: 'data',
        component: () => import('../views/MainPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'profile',
        component: () => import('../views/ProfileSpecs.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'schedule',
        component: () => import('../views/SchedulePage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'settings',
        component: () => import('../views/SettingsPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'orders',
        component: () => import('../views/OrdersPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'documents',
        component: () => import('../views/DocumentsPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'orders/:id',
        component: () => import('../views/DetailOrder.vue'),
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
  if (to.path === '/' && token) {
    next({ path: '/data' }); // redirect to main page
  } else if (to.meta.requiresAuth && !token) {
    next({ path: '/' }); // redirect to login page
  } else {
    next();
  }
});

export default router
