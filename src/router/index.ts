import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import FocusLayout from '@/layouts/FocusLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/app',
      component: AppLayout,
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/views/DashboardView.vue'),
        },
        {
          path: 'libros',
          name: 'books',
          component: () => import('@/views/BooksView.vue'),
        },
        {
          path: 'practica',
          name: 'practice',
          component: () => import('@/views/PracticeView.vue'),
        },
        {
          path: 'repaso',
          name: 'saved',
          component: () => import('@/views/SavedView.vue'),
        },
        {
          path: 'perfil',
          name: 'profile',
          component: () => import('@/views/ProfileView.vue'),
        },
        {
          path: 'unidades/:unitId',
          name: 'unit-hub',
          component: () => import('@/views/UnitHubView.vue'),
        },
        {
          path: 'libros/:seriesId',
          name: 'series-detail',
          component: () => import('@/views/SeriesDetailView.vue'),
        },
        {
          path: 'libro/:bookId',
          name: 'book-units',
          component: () => import('@/views/BookUnitsView.vue'),
        },
      ],
    },
    {
      path: '/estudio',
      component: FocusLayout,
      children: [
        {
          path: 'quiz/:unitId',
          name: 'unit-quiz',
          component: () => import('@/views/QuizRunnerView.vue'),
        },
        {
          path: 'flashcards/:unitId',
          name: 'unit-flashcards',
          component: () => import('@/views/FlashcardsView.vue'),
        },
      ],
    },
    {
      path: '/',
      redirect: '/app', // Luego aquí irá tu LandingView
    },
  ],
})

export default router
