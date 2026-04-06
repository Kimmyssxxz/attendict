<template>
  <!-- Sidebar / Bottom Nav -->
  <aside class="fixed bottom-0 left-0 right-0 md:static md:w-[260px] bg-white/95 backdrop-blur-xl border-t md:border-t-0 md:border-r border-gray-200 py-2 sm:py-3 md:py-8 px-2 md:px-5 flex md:flex-col shadow-[0_-4px_24px_rgba(0,0,0,0.02)] md:shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-[100] md:z-10 shrink-0">
    <div class="hidden md:flex justify-between items-center mb-10 px-2">
      <div class="text-2xl font-extrabold tracking-tight bg-gradient-to-br from-blue-900 to-blue-800 bg-clip-text text-transparent">
        <span class="text-blue-900">ATTEND</span><span class="text-blue-800">ICT</span>
      </div>
    </div>

    <nav class="flex flex-row md:flex-col w-full justify-around md:justify-start gap-1 md:gap-2">
      <div class="flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3 p-2 md:py-3 md:px-4 rounded-xl cursor-pointer text-[10px] sm:text-xs md:text-sm font-medium transition-all duration-200 flex-1 md:flex-none text-center"
           :class="activeNav === 'dashboard' ? 'bg-gradient-to-br from-blue-900 to-blue-800 text-white shadow-md shadow-blue-900/20' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'"
           @click="navigateTo('StaffDashboard')">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5 sm:w-6 sm:h-6 md:w-5 md:h-5">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        <span class="whitespace-nowrap mt-0.5 md:mt-0">Dashboard</span>
      </div>

      <div class="flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3 p-2 md:py-3 md:px-4 rounded-xl cursor-pointer text-[10px] sm:text-xs md:text-sm font-medium transition-all duration-200 flex-1 md:flex-none text-center"
           :class="activeNav === 'attendance' ? 'bg-gradient-to-br from-blue-900 to-blue-800 text-white shadow-md shadow-blue-900/20' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'"
           @click="navigateTo('StaffAttendance')">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5 sm:w-6 sm:h-6 md:w-5 md:h-5">
          <circle cx="12" cy="12" r="1"></circle>
          <path d="M12 1v6m0 6v6"></path>
          <path d="M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24"></path>
          <path d="M1 12h6m6 0h6"></path>
          <path d="M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24"></path>
        </svg>
        <span class="whitespace-nowrap mt-0.5 md:mt-0">Attendance</span>
      </div>

      <div class="flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3 p-2 md:py-3 md:px-4 rounded-xl cursor-pointer text-[10px] sm:text-xs md:text-sm font-medium transition-all duration-200 flex-1 md:flex-none text-center"
           :class="activeNav === 'attendance-logs' ? 'bg-gradient-to-br from-blue-900 to-blue-800 text-white shadow-md shadow-blue-900/20' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'"
           @click="navigateTo('StaffAttendanceLogs')">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5 sm:w-6 sm:h-6 md:w-5 md:h-5">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <span class="whitespace-nowrap mt-0.5 md:mt-0">Logs</span>
      </div>

      <div class="flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3 p-2 md:py-3 md:px-4 rounded-xl cursor-pointer text-[10px] sm:text-xs md:text-sm font-medium transition-all duration-200 flex-1 md:flex-none text-center"
           :class="activeNav === 'monthly-summary' ? 'bg-gradient-to-br from-blue-900 to-blue-800 text-white shadow-md shadow-blue-900/20' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'"
           @click="navigateTo('StaffMonthlySummary')">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5 sm:w-6 sm:h-6 md:w-5 md:h-5">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
        <span class="whitespace-nowrap mt-0.5 md:mt-0">Summary</span>
      </div>
    </nav>
  </aside>
</template>

<script setup>
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  activeNav: {
    type: String,
    required: true
  }
})

const router = useRouter()

const navigateTo = (routeName) => {
  router.push({ name: routeName })
}
</script>
