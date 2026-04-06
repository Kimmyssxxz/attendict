<template>
  <div class="flex h-screen bg-gray-50 font-sans">
    <AdminSidebar />
    
    <main class="flex-1 overflow-y-auto">
      <div class="p-8">
        <header class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p class="text-gray-500 mt-1">Overview of system status and intern activity</p>
          </div>
          <div class="flex gap-3">
             <button class="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
               Generate Report
             </button>
          </div>
        </header>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div v-for="stat in stats" :key="stat.title" class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-transform hover:scale-[1.02]">
            <div class="flex items-center gap-4">
              <div :class="`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${stat.bgColor}`">
                {{ stat.icon }}
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">{{ stat.title }}</p>
                <p class="text-2xl font-bold text-gray-900">{{ stat.value }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity Section -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 class="text-lg font-bold text-gray-900 mb-6 font-sans">System Status</h2>
            <div class="space-y-6">
               <div class="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100">
                 <div class="flex items-center gap-3">
                   <span class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                   <span class="font-medium text-green-800">Server Online</span>
                 </div>
                 <span class="text-sm text-green-600 font-medium">Port 3001 Connection: Active</span>
               </div>
               
               <div class="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100">
                 <div class="flex items-center gap-3">
                   <span class="text-xl">🔥</span>
                   <span class="font-medium text-blue-800">Firebase Operations</span>
                 </div>
                 <span class="text-sm text-blue-600 font-medium text-right">Firestore & Auth Status: Healthy</span>
               </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 class="text-lg font-bold text-gray-900 mb-6">Quick Links</h2>
            <nav class="space-y-3">
              <router-link to="/admin/manage-interns" class="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                <span class="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center transition-colors group-hover:bg-blue-100">📋</span>
                <span class="font-medium text-gray-700">Intern Management</span>
              </router-link>
              <router-link to="/admin/student-attendance-validation" class="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                <span class="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center transition-colors group-hover:bg-green-100">✅</span>
                <span class="font-medium text-gray-700">Attendance Validation</span>
              </router-link>
              <router-link to="/admin/settings" class="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                <span class="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center transition-colors group-hover:bg-purple-100">⚙️</span>
                <span class="font-medium text-gray-700">Office Settings</span>
              </router-link>
            </nav>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AdminSidebar from './AdminSidebar.vue'

const stats = ref([
  { title: 'Total Interns', value: 'Loading...', icon: '👥', bgColor: 'bg-blue-50 text-blue-600' },
  { title: 'Present Today', value: 'Loading...', icon: '📅', bgColor: 'bg-green-50 text-green-600' },
  { title: 'Pending Validation', value: 'Loading...', icon: '⏳', bgColor: 'bg-orange-50 text-orange-600' },
  { title: 'Offices Active', value: '4', icon: '🏢', bgColor: 'bg-purple-50 text-purple-600' }
])
</script>
