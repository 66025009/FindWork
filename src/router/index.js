import { createRouter, createWebHistory } from 'vue-router'

import MoreView from '../views/MoreView.vue'
import HomeView from '../views/user/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import Callback from '@/callback.vue'
import RegisterView from '../views/RegisterView.vue'
import ForgetView from '../views/ForgetView.vue'
import ManageView from '../views/ManageView.vue'
import NetworkView from '@/views/user/NetworkView.vue'
import NotificationsView from '@/views/user/NotificationsView.vue'
import ProfileView from '@/views/user/ProfileView.vue'
import EditProfileView from '@/views/user/EditProfileView.vue'
import ExperienceStudentView from '@/views/user/ExperienceStudentView.vue'
import ExperienceWorkView from '@/views/user/ExperienceWorkView.vue'
// Admin
import AdminLoginView from '@/views/admin/AdminLoginView.vue'
import AdminHomeView from '@/views/admin/AdminHomeView.vue'
import AdminPeopleView from '@/views/admin/AdminPeopleView.vue'
import AccountUserView from '@/views/admin/user/AccountUserView.vue'
import InformationView from '@/views/admin/user/InformationView.vue'
import CommunityView from '@/views/admin/user/CommunityView.vue'

import { useAccountStore } from '@/stores/account'





const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/callback',
      name: 'callback',
      component: Callback
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
      path: '/',
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
      path: '/profile',
      name: 'profile',
      component: ProfileView
    },
    {
      path: '/edit/profile',
      name: 'edit-profile',
      component: EditProfileView
    },
    {
      path: '/experience/student',
      name: 'experience-student',
      component: ExperienceStudentView
    },
    {
      path: '/experience/work',
      name: 'experience-work',
      component: ExperienceWorkView
    },

    // Amin site
    {
      path: '/admin/login',
      name: 'ad-login',
      component: AdminLoginView
    },
    {
      path: '/admin/home',
      name: 'admin-home',
      component: AdminHomeView,
      meta: { requiresAdmin: true } 
    },
    {
      path: '/admin/people',
      name: 'admin-people',
      component: AdminPeopleView,
      meta: { requiresAdmin: true } 
    },
    {
      path: '/admin/account-user',
      name: 'admin-account-user',
      component: AccountUserView,
      meta: { requiresAdmin: true }
    },
    {
      path: '/admin/information',
      name: 'admin-information',
      component: InformationView,
      meta: { requiresAdmin: true }
    },
    {
      path: '/admin/community',
      name: 'admin-community',
      component: CommunityView,
      meta: { requiresAdmin: true }
    },
  ]
})

router.beforeEach(async (to, from, next) => {
  const accountStore = useAccountStore()
  await accountStore.initializeAuth()
  
  if (to.meta.requiresAdmin && !accountStore.isAdmin) {
    next({ name: 'more' })
  } else {
    next()
  }
})

export default router

