import { createRouter, createWebHistory } from 'vue-router'

import MoreView from '../views/MoreView.vue'
import HomeView from '../views/user/HomeView.vue'
import LoginView from "../views/LoginView.vue"
import RegisterView from '../views/RegisterView.vue'
import ForgetView from '../views/ForgetView.vue'
import ManageView from '../views/ManageView.vue'
import NetworkView from '@/views/user/NetworkView.vue'
import NotificationsView from '@/views/user/NotificationsView.vue'
import AminHomeView from '@/views/amin/AminHomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/forget',
      name: 'forget',
      component: ForgetView
    },
    {
      path: '/manage',
      name: 'manage',
      component: ManageView
    },
    {
      path: '/more',
      name: 'more',
      component: MoreView
    },
    {
      path: '/network',
      name: 'network',
      component: NetworkView
    },
    {
      path: '/notifications',
      name: 'notifications',
      component: NotificationsView
    },
    {
      path: '/aminhome',
      name: 'aminhome',
      component: AminHomeView
    },
  ]
})


export default router

