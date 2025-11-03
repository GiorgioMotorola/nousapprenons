import { createRouter, createWebHistory } from 'vue-router'
import Flashcard from '../Flashcard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'flashcard',
      component: Flashcard
    }
  ]
})

export default router
