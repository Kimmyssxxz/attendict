<template>
  <div class="flex h-screen bg-[#f5f5f5] font-sans antialiased">
    <!-- Sidebar -->
    <aside class="w-[260px] bg-white/95 backdrop-blur-xl border-r border-white/20 py-8 px-5 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.1)]">
      <div class="flex justify-between items-center mb-10">
        <div class="text-2xl font-extrabold tracking-tight bg-gradient-to-br from-blue-900 to-blue-800 bg-clip-text text-transparent">
          <span class="text-blue-900">ATTEND</span><span class="text-blue-800">ICT</span>
        </div>
        <button class="hidden bg-white/80 p-2 rounded-lg text-slate-500 hover:bg-blue-900/10 hover:scale-105 transition-all duration-300">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>

      <nav class="flex flex-col gap-3">
        <div class="flex items-center gap-3 py-3 px-3 rounded-lg cursor-pointer text-sm transition-all duration-200"
             :class="activeNav === 'dashboard' ? 'bg-gradient-to-br from-blue-900 to-blue-800 text-white shadow-[0_8px_24px_rgba(30,58,138,0.3)]' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'"
             @click="navigateTo('StaffDashboard', 'dashboard')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span>Dashboard</span>
        </div>

        <div class="flex items-center gap-3 py-3 px-3 rounded-lg cursor-pointer text-sm transition-all duration-200"
             :class="activeNav === 'attendance' ? 'bg-gradient-to-br from-blue-900 to-blue-800 text-white shadow-[0_8px_24px_rgba(30,58,138,0.3)]' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'"
             @click="navigateTo('StaffAttendance', 'attendance')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="1"></circle>
            <path d="M12 1v6m0 6v6"></path>
            <path d="M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24"></path>
            <path d="M1 12h6m6 0h6"></path>
            <path d="M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24"></path>
          </svg>
          <span>My Attendance</span>
        </div>

        <div class="flex items-center gap-3 py-3 px-3 rounded-lg cursor-pointer text-sm transition-all duration-200"
             :class="activeNav === 'attendance-logs' ? 'bg-gradient-to-br from-blue-900 to-blue-800 text-white shadow-[0_8px_24px_rgba(30,58,138,0.3)]' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'"
             @click="navigateTo('StaffAttendanceLogs', 'attendance-logs')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>Attendance Logs</span>
        </div>

        <div class="flex items-center gap-3 py-3 px-3 rounded-lg cursor-pointer text-sm transition-all duration-200"
             :class="activeNav === 'monthly-summary' ? 'bg-gradient-to-br from-blue-900 to-blue-800 text-white shadow-[0_8px_24px_rgba(30,58,138,0.3)]' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'"
             @click="navigateTo('StaffMonthlySummary', 'monthly-summary')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          <span>Monthly Summary</span>
        </div>

        <div class="flex items-center gap-3 py-3 px-3 rounded-lg cursor-pointer text-sm transition-all duration-200"
             :class="activeNav === 'fingerprint' ? 'bg-gradient-to-br from-blue-900 to-blue-800 text-white shadow-[0_8px_24px_rgba(30,58,138,0.3)]' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'"
             @click="navigateTo('StaffFingerprintEnrollment', 'fingerprint')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 11a2 2 0 0 0-2 2v2"></path>
            <path d="M12 9a4 4 0 0 0-4 4v2"></path>
            <path d="M12 7a6 6 0 0 0-6 6v2"></path>
            <path d="M12 5a8 8 0 0 0-8 8v2"></path>
            <path d="M12 11a2 2 0 0 1 2 2v2"></path>
            <path d="M12 9a4 4 0 0 1 4 4v2"></path>
          </svg>
          <span>Fingerprint Enrollment</span>
        </div>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col bg-neutral-50 relative z-0">
      <!-- Top Header -->
      <header class="bg-white border-b border-gray-200 px-8 py-5 flex justify-between items-center relative z-20">
        <h1 class="text-base text-gray-800 font-medium"></h1>
        <div class="flex items-center gap-4">
          <!-- <button class="relative flex items-center justify-center p-2 text-gray-500 bg-transparent rounded-md hover:bg-gray-100 hover:text-gray-800 transition-colors duration-200">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span class="absolute top-0.5 right-0.5 bg-red-500 text-white w-[18px] h-[18px] rounded-full text-xs flex items-center justify-center font-semibold">1</span>
          </button> -->
          <div ref="avatarWrapEl" class="relative flex items-center">
            <button class="w-9 h-9 rounded-full bg-gray-800 text-white border-none cursor-pointer text-sm hover:bg-gray-900 transition-colors duration-200" type="button" @click="toggleAvatarMenu" aria-haspopup="true" :aria-expanded="avatarMenuOpen">
              <img v-if="userPhotoUrl" :src="userPhotoUrl" class="w-full h-full rounded-full object-cover block" alt="Profile" />
              <span v-else class="inline-flex w-full h-full items-center justify-center">{{ userInitials || 'U' }}</span>
            </button>

            <div v-if="avatarMenuOpen" class="absolute top-[calc(100%+10px)] right-0 w-[300px] bg-white border border-slate-900/5 rounded-xl shadow-[0_14px_30px_rgba(0,0,0,0.12)] overflow-hidden z-50 origin-top-right transition-all" role="menu">
              <div class="flex gap-3 p-3.5 border-b border-slate-900/5">
                <div class="w-11 h-11 rounded-full overflow-hidden shrink-0 bg-gray-900">
                  <img v-if="userPhotoUrl" class="w-full h-full object-cover block" :src="userPhotoUrl" alt="Profile" />
                  <div v-else class="w-full h-full flex items-center justify-center text-white font-bold">{{ userInitials || 'U' }}</div>
                </div>
                <div class="flex flex-col justify-center min-w-0">
                  <div class="font-bold text-slate-900 text-sm truncate">{{ userDisplayName || 'User' }}</div>
                  <div class="text-xs text-slate-500 truncate">{{ userEmail || '' }}</div>
                </div>
              </div>

              <button class="w-full flex items-center gap-2.5 px-3.5 py-3 border-none bg-transparent cursor-pointer text-slate-900 font-medium text-sm text-left hover:bg-slate-900/5 transition-colors" type="button" @click="goToSettings" role="menuitem">
                <svg class="text-slate-700 shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
                <span>Settings</span>
                <span class="ml-auto text-slate-400 text-lg font-bold">›</span>
              </button>

              <button class="w-full flex items-center gap-2.5 px-3.5 py-3 border-none bg-transparent cursor-pointer text-slate-900 font-medium text-sm text-left hover:bg-slate-900/5 transition-colors" type="button" @click="logout" role="menuitem">
                <svg class="text-slate-700 shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <div class="flex-1 p-8 overflow-y-auto">
        <div class="flex justify-between items-start mb-8">
          <div>
            <h2 class="text-2xl text-gray-800 font-bold mb-2">Dashboard Overview</h2>
            <p class="text-sm text-gray-400">Monitor your attendance</p>
          </div>
        </div>

        <!-- Cards Grid -->
        <div class="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6 mb-8">
          <!-- Total Records -->
          <div class="bg-white rounded-xl p-6 shadow-[0_4px_6px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.1)] transition-transform duration-300 hover:-translate-y-1 flex items-center gap-5">
            <div class="w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-blue-50 text-blue-500">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
            </div>
            <div class="flex flex-col">
              <h3 class="text-sm text-gray-500 font-medium mb-1">Total Records</h3>
              <p class="text-2xl font-bold text-gray-800">{{ dashboardMetrics.totalDays }}</p>
            </div>
          </div>
          <!-- Days Present -->
          <div class="bg-white rounded-xl p-6 shadow-[0_4px_6px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.1)] transition-transform duration-300 hover:-translate-y-1 flex items-center gap-5">
            <div class="w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-emerald-50 text-emerald-500">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <div class="flex flex-col">
              <h3 class="text-sm text-gray-500 font-medium mb-1">Days Present</h3>
              <p class="text-2xl font-bold text-gray-800">{{ dashboardMetrics.presentDays }}</p>
            </div>
          </div>
          <!-- Total Hours -->
          <div class="bg-white rounded-xl p-6 shadow-[0_4px_6px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.1)] transition-transform duration-300 hover:-translate-y-1 flex items-center gap-5">
            <div class="w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-purple-50 text-purple-500">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
            <div class="flex flex-col">
              <h3 class="text-sm text-gray-500 font-medium mb-1">Total Hours</h3>
              <p class="text-2xl font-bold text-gray-800">{{ dashboardMetrics.totalHours }}</p>
            </div>
          </div>
          <!-- Completion Rate -->
          <div class="bg-white rounded-xl p-6 shadow-[0_4px_6px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.1)] transition-transform duration-300 hover:-translate-y-1 flex items-center gap-5">
             <div class="w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-amber-50 text-amber-500">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
            </div>
            <div class="flex flex-col">
              <h3 class="text-sm text-gray-500 font-medium mb-1">Attendance Rate</h3>
              <p class="text-2xl font-bold text-gray-800">{{ dashboardMetrics.completionRate }}%</p>
            </div>
          </div>
        </div>

        <!-- Large Cards -->
        <div class="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)]">
          <div class="bg-white rounded-xl p-6 shadow-[0_4px_6px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.1)] transition-transform duration-300 flex flex-col min-h-[400px]">
            <h3 class="text-[17px] text-gray-800 font-semibold mb-6">Hours Worked Trend</h3>
            <div class="flex-1 min-h-0 relative">
              <VueApexCharts type="area" height="300" :options="areaOptions" :series="areaSeries" />
              
              <!-- Loading Overlay -->
              <div v-if="staffStore.loading" class="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
                <div class="flex flex-col items-center">
                  <div class="animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600 mb-3"></div>
                  <span class="text-sm text-gray-600 font-medium">Loading chart data...</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-xl p-6 shadow-[0_4px_6px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.1)] transition-transform duration-300 flex flex-col min-h-[400px]">
            <h3 class="text-[17px] text-gray-800 font-semibold mb-6">Status Distribution</h3>
            <div class="flex-1 min-h-0 relative flex items-center justify-center pt-5">
              <VueApexCharts type="donut" height="320" :options="donutOptions" :series="donutSeries" />
              
              <!-- Loading Overlay -->
              <div v-if="staffStore.loading" class="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
                <div class="flex flex-col items-center">
                  <div class="animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600 mb-3"></div>
                  <span class="text-sm text-gray-600 font-medium">Loading chart data...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { db } from '../../firebase.js'
import { doc, getDoc } from 'firebase/firestore'
import VueApexCharts from 'vue3-apexcharts'
import { useStaffAttendanceStore } from '../../stores/staffAttendanceStore.js'

const router = useRouter()
const staffStore = useStaffAttendanceStore()
const activeTab = ref('current')
const activeNav = ref('dashboard')

const avatarWrapEl = ref(null)
const avatarMenuOpen = ref(false)

const userProfile = ref(null)

const userDisplayName = computed(() => {
  if (!userProfile.value) return ''
  const { firstName, lastName, name, fullName, displayName, username } = userProfile.value
  if (firstName || lastName) {
    return `${firstName || ''} ${lastName || ''}`.trim()
  }
  return name || fullName || displayName || username || ''
})

const userEmail = computed(() => {
  if (!userProfile.value) return ''
  return userProfile.value.email || userProfile.value.emailAddress || userProfile.value.username || ''
})

const userPhotoUrl = computed(() => {
  return userProfile.value?.photoUrl || userProfile.value?.photoURL || userProfile.value?.avatarUrl || userProfile.value?.profilePicture || userProfile.value?.profileImage || ''
})

const userInitials = computed(() => {
  const name = userDisplayName.value || userEmail.value
  if (!name) return ''
  const parts = String(name).trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase()
  return (parts[0].slice(0, 1) + parts[parts.length - 1].slice(0, 1)).toUpperCase()
})

const resolveStaffLocal = () => {
  const keys = ['user', 'staffUser']
  for (const k of keys) {
    const raw = localStorage.getItem(k)
    if (!raw) continue
    try {
      const parsed = JSON.parse(raw)
      const resolved = parsed?.user ? parsed.user : parsed
      if (resolved) return resolved
    } catch {
      // ignore
    }
  }
  return null
}

const getCurrentUserId = () => {
  const staffLocal = resolveStaffLocal()
  return staffLocal?.uid || staffLocal?.id || staffLocal?.staffId || staffLocal?._id || null
}

const fetchUserProfile = async () => {
  const id = getCurrentUserId()
  if (!id) {
    userProfile.value = null
    return
  }

  try {
    const snap = await getDoc(doc(db, 'users', String(id)))
    userProfile.value = snap.exists() ? { id: snap.id, ...snap.data() } : null
  } catch (e) {
    console.error('Failed to load user profile from Firestore users collection:', e)
    userProfile.value = null
  }
}

const toggleAvatarMenu = () => {
  avatarMenuOpen.value = !avatarMenuOpen.value
}

const closeAvatarMenu = () => {
  avatarMenuOpen.value = false
}

const onDocClick = (e) => {
  if (!avatarMenuOpen.value) return
  const root = avatarWrapEl.value
  if (!root) return
  if (root.contains(e.target)) return
  closeAvatarMenu()
}

const goToSettings = () => {
  closeAvatarMenu()
  router.push({ name: 'StaffSettings' })
}

const logout = () => {
  closeAvatarMenu()
  localStorage.removeItem('user')
  localStorage.removeItem('staffUser')
  router.push({ name: 'Login' })
}

const navigateTo = (routeName, navItem) => {
  activeNav.value = navItem
  router.push({ name: routeName })
}

const staffAttendances = computed(() => staffStore.getAllStaffAttendances)

const getMinutesDiff = (start, end) => {
   if (!start || !end) return 0
   try {
     const [sh, sm] = start.split(':').map(Number)
     const [eh, em] = end.split(':').map(Number)
     const diff = (eh * 60 + em) - (sh * 60 + sm)
     return diff > 0 ? diff : 0
   } catch { return 0 }
}

const dashboardMetrics = computed(() => {
  const records = staffAttendances.value || []
  const totalDays = records.length
  
  let presentDays = 0
  let totalMinutes = 0
  
  records.forEach(record => {
    if (record.timeInAM || record.timeInPM) presentDays++
    
    let mins = 0
    if (record.timeInAM && record.timeOutAM) mins += getMinutesDiff(record.timeInAM, record.timeOutAM)
    if (record.timeInPM && record.timeOutPM) mins += getMinutesDiff(record.timeInPM, record.timeOutPM)
    totalMinutes += mins
  })

  const hrs = Math.floor(totalMinutes / 60)
  const remainderMins = totalMinutes % 60
  
  return {
    totalDays,
    presentDays,
    totalHours: `${hrs}h ${remainderMins}m`,
    completionRate: totalDays ? Math.round((presentDays / totalDays) * 100) : 0
  }
})

// Charts Options
const areaSeries = computed(() => {
  const records = [...(staffAttendances.value || [])].sort((a,b) => new Date(a.date) - new Date(b.date))
  const data = records.map(r => {
    let mins = 0
    if (r.timeInAM && r.timeOutAM) mins += getMinutesDiff(r.timeInAM, r.timeOutAM)
    if (r.timeInPM && r.timeOutPM) mins += getMinutesDiff(r.timeInPM, r.timeOutPM)
    return parseFloat((mins / 60).toFixed(1))
  })
  return [{ name: 'Hours Worked', data }]
})

const areaOptions = computed(() => {
  const records = [...(staffAttendances.value || [])].sort((a,b) => new Date(a.date) - new Date(b.date))
  const categories = records.map(r => {
    const d = new Date(r.date)
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  })
  
  return {
    chart: { type: 'area', height: 300, fontFamily: 'inherit', toolbar: { show: false } },
    colors: ['#3b82f6'],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    xaxis: { categories },
    yaxis: { title: { text: 'Hours' } },
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.0, stops: [0, 100] }
    }
  }
})

const donutSeries = computed(() => {
  const counts = { Office: 0, Travel: 0, Leave: 0, Absent: 0 }
  staffAttendances.value?.forEach(r => {
     if (r.staffStatusAM === 'At Office') counts.Office++
     else if (r.staffStatusAM === 'Travel/On Field') counts.Travel++
     else if (r.staffStatusAM === 'Leave') counts.Leave++
     else if (r.staffStatusAM === 'Absent') counts.Absent++

     if (r.staffStatusPM === 'At Office') counts.Office++
     else if (r.staffStatusPM === 'Travel/On Field') counts.Travel++
     else if (r.staffStatusPM === 'Leave') counts.Leave++
     else if (r.staffStatusPM === 'Absent') counts.Absent++
  })
  return [counts.Office, counts.Travel, counts.Leave, counts.Absent]
})

const donutOptions = computed(() => {
  return {
    chart: { type: 'donut' },
    labels: ['At Office', 'Travel/On Field', 'Leave', 'Absent'],
    colors: ['#10b981', '#f59e0b', '#3b82f6', '#ef4444'],
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            name: { show: true },
            value: { show: true },
            total: { show: true, label: 'Total Statuses', color: '#6b7280' }
          }
        }
      }
    },
    dataLabels: { enabled: false },
    legend: { position: 'bottom' }
  }
})

const fetchAttendanceData = async () => {
  const staffId = getCurrentUserId()
  if (staffId) {
    await staffStore.getStaffAttendancesByStaffId(staffId, 30) // last 30 entries
  }
}

onMounted(() => {
  document.addEventListener('click', onDocClick)
  fetchUserProfile()
  fetchAttendanceData()
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
})
</script>

<style scoped>
/* Scoped styles removed because the component now uses Tailwind CSS */
</style>