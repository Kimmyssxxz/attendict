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
import DtcTrainingEvaluation from '../views/client/DtcTrainingEvaluation.vue';
import AdminClientLogBookView from '../views/admin/AdminClientLogBookView.vue';
import AdminDtcEvaluationFormView from '../views/admin/AdminDtcEvaluationFormView.vue';
import AdminDtcEvaluationView from '../views/admin/AdminDtcEvaluationView.vue';
import AdminClientLogBookSettingsView from '../views/admin/AdminClientLogBookSettingsView.vue';

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
    path: '/admin/client-logbook',
    name: 'AdminClientLogBook',
    component: AdminClientLogBookView,
  },
  {
    path: '/admin/dtc-evaluation-form',
    name: 'AdminDtcEvaluationForm',
    component: AdminDtcEvaluationFormView,
  },
  {
    path: '/admin/client-logbook-settings',
    name: 'AdminClientLogBookSettings',
    component: AdminClientLogBookSettingsView,
  },
  {
    path: '/admin/dtc-evaluations',
    name: 'AdminDtcEvaluations',
    component: AdminDtcEvaluationView,
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
    path: '/client/dtc-training-evaluation',
    name: 'DtcTrainingEvaluation',
    component: DtcTrainingEvaluation
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

export default router;
