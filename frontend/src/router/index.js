import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/intern/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import AdminLoginView from '../views/admin/AdminLoginView.vue';
import StaffLoginView from '../views/staff/StaffLoginView.vue';

const routes = [
  {
    path: '/auth/intern/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/auth/admin/login',
    name: 'AdminLogin',
    component: AdminLoginView
  },
  {
    path: '/auth/staff/login',
    name: 'StaffLogin',
    component: StaffLoginView
  },
  {
    path: '/auth/register',
    name: 'Register',
    component: RegisterView
  },
  {
    path: '/',
    redirect: '/auth/intern/login'
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
