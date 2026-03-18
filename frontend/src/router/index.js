import { createRouter, createWebHistory } from 'vue-router';
import RegisterView from '../views/RegisterView.vue';
import LoginView from '../views/LoginView.vue';
import AdminLoginView from '../views/admin/AdminLoginView.vue';
import AdminStudentInternsView from '../views/admin/AdminStudentInternsView.vue';
import AdminStudentTaggingView from '../views/admin/AdminStudentTaggingView.vue';
import AdminStudentCertificationView from '../views/admin/AdminStudentCertificationView.vue';
import AdminStudentAttendanceValidationView from '../views/admin/AdminStudentAttendanceValidationView.vue';
import AdminSettingsView from '../views/admin/AdminSettingsView.vue';
import DashboardView from '../views/intern/DashboardView.vue';
import TimeView from '../views/intern/TimeView.vue';
import AttendanceView from '../views/intern/AttendanceView.vue';
import ProfileView from '../views/intern/ProfileView.vue';
import SettingsView from '../views/intern/SettingsView.vue';
import StaffDashboardView from '../views/staff/StaffDashboardView.vue';
import NotificationsView from '../views/intern/NotificationsView.vue';
import StaffStatusView from '../views/intern/StaffStatusView.vue';
import ClientLogBook from '../views/client/ClientLogBook.vue';
import ClientEvaluation from '../views/client/ClientEvaluation.vue';
import staffRoutes from './staff.routes.js';

const routes = [
  {
    path: '/auth/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/intern/dashboard',
    name: 'InternDashboard',
    component: DashboardView
  },
  {
    path: '/intern/time',
    name: 'InternTime',
    component: TimeView
  },
  {
    path: '/intern/attendance',
    name: 'InternAttendance',
    component: AttendanceView
  },
  {
    path: '/intern/staff-status',
    name: 'InternStaffStatus',
    component: StaffStatusView
  },
  {
    path: '/intern/notifications',
    name: 'InternNotifications',
    component: NotificationsView
  },
  {
    path: '/intern/profile',
    name: 'InternProfile',
    component: ProfileView
  },
  {
    path: '/intern/settings',
    name: 'InternSettings',
    component: SettingsView
  },
  ...staffRoutes,
  {
    path: '/staff/dashboard',
    name: 'StaffDashboard',
    component: StaffDashboardView,
  },
  {
    path: '/admin/manage-interns',
    name: 'AdminStudentInterns',
    component: AdminStudentInternsView,
  },
  {
    path: '/admin/student-tagging',
    name: 'AdminStudentTagging',
    component: AdminStudentTaggingView,
  },
  {
    path: '/admin/student-certification',
    name: 'AdminStudentCertification',
    component: AdminStudentCertificationView,
  },
  {
    path: '/admin/student-attendance-validation',
    name: 'AdminStudentAttendanceValidation',
    component: AdminStudentAttendanceValidationView,
  },
  {
    path: '/admin/settings',
    name: 'AdminSettings',
    component: AdminSettingsView,
  },
  {
    path: '/auth/admin/login',
    name: 'AdminLogin',
    component: AdminLoginView
  },
  {
    path: '/auth/register',
    name: 'Register',
    component: RegisterView
  },
  {
    path: '/client/logbook',
    name: 'ClientLogBook',
    component: ClientLogBook
  },
  {
    path: '/client/evaluation',
    name: 'ClientEvaluation',
    component: ClientEvaluation
  },
  {
    path: '/',
    redirect: '/auth/login'
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach((to) => {
  if (to.name === 'Login') {
    // Prefer unified storage key `user`, fall back to legacy `staffUser` / `internUser`
    let unified = null
    try {
      unified = JSON.parse(localStorage.getItem('user') || 'null')
    } catch {
      unified = null
    }

    const resolved = unified?.user ? unified.user : unified
    const role = resolved?.role || null

    if (role === 'staff') {
      return { name: 'StaffDashboard' }
    }

    if (role === 'student' || role === 'intern') {
      return { name: 'InternDashboard' }
    }

    const staffUser = localStorage.getItem('staffUser')
    if (staffUser) return { name: 'StaffDashboard' }

    const internUser = localStorage.getItem('internUser')
    if (internUser) return { name: 'InternDashboard' }
  }

  return true
})

export default router;
