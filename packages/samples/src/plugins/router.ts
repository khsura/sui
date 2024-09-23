import { createRouter, createWebHistory } from 'vue-router'
import { Index } from '@khsura/samples/pages'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index,
    },
  ],
})
