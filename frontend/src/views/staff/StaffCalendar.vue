<template>
  <div class="flex h-screen bg-[#f5f5f5] font-sans antialiased text-gray-900">
    <!-- Sidebar -->
    <aside class="w-[260px] bg-white/95 backdrop-blur-xl border-r border-gray-200 py-8 px-5 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 shrink-0 hidden md:flex">
      <div class="flex justify-between items-center mb-10 px-2">
        <div class="text-2xl font-extrabold tracking-tight bg-gradient-to-br from-blue-900 to-blue-800 bg-clip-text text-transparent">
          <span class="text-blue-900">ATTEND</span><span class="text-blue-800">ICT</span>
        </div>
      </div>

      <nav class="flex flex-col gap-2">
        <div class="flex items-center gap-3 py-3 px-4 rounded-xl cursor-pointer text-sm font-medium transition-all duration-200"
             :class="activeNav === 'dashboard' ? 'bg-gradient-to-br from-blue-900 to-blue-800 text-white shadow-md shadow-blue-900/20' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'"
             @click="navigateTo('StaffDashboard', 'dashboard')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span>Dashboard</span>
        </div>

        <div class="flex items-center gap-3 py-3 px-4 rounded-xl cursor-pointer text-sm font-medium transition-all duration-200"
             :class="activeNav === 'attendance' ? 'bg-gradient-to-br from-blue-900 to-blue-800 text-white shadow-md shadow-blue-900/20' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'"
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

        <div class="flex items-center gap-3 py-3 px-4 rounded-xl cursor-pointer text-sm font-medium transition-all duration-200"
             :class="activeNav === 'attendance-logs' ? 'bg-gradient-to-br from-blue-900 to-blue-800 text-white shadow-md shadow-blue-900/20' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'"
             @click="navigateTo('StaffAttendanceLogs', 'attendance-logs')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>Attendance Logs</span>
        </div>

        <div class="flex items-center gap-3 py-3 px-4 rounded-xl cursor-pointer text-sm font-medium transition-all duration-200"
             :class="activeNav === 'monthly-summary' ? 'bg-gradient-to-br from-blue-900 to-blue-800 text-white shadow-md shadow-blue-900/20' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'"
             @click="navigateTo('StaffMonthlySummary', 'monthly-summary')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          <span>Monthly Summary</span>
        </div>

        <div class="flex items-center gap-3 py-3 px-4 rounded-xl cursor-pointer text-sm font-medium transition-all duration-200"
             :class="activeNav === 'fingerprint' ? 'bg-gradient-to-br from-blue-900 to-blue-800 text-white shadow-md shadow-blue-900/20' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'"
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
    <main class="flex-1 flex flex-col relative min-w-0 overflow-hidden z-0">
      <!-- Top Header -->
      <header class="bg-white border-b border-gray-200 px-8 py-5 flex justify-between items-center z-20 sticky top-0">
        <div class="flex flex-col">
          <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Calendar</h1>
          <p class="text-sm text-gray-500 mt-1">Review your monthly attendance records</p>
        </div>
        <div class="flex items-center gap-6">
          <div class="flex items-center gap-3 pl-6 border-l border-gray-200">
            <div ref="avatarWrapEl" class="relative">
              <button class="w-10 h-10 rounded-full bg-blue-100 border-2 border-white shadow-sm flex items-center justify-center text-blue-700 font-bold overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all hover:scale-105" type="button" @click.stop="toggleAvatarTooltip">
                <img v-if="avatarTooltipImage" :src="avatarTooltipImage" class="w-full h-full object-cover" alt="Profile" />
                <span v-else class="text-sm tracking-wider">{{ avatarInitial }}</span>
              </button>
              
              <transition enter-active-class="transition duration-200 ease-out" enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
                <div v-if="showAvatarTooltip" class="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 origin-top-right" role="tooltip">
                  <div class="p-4 border-b border-gray-50 flex items-center gap-3">
                    <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                      <img v-if="avatarTooltipImage" :src="avatarTooltipImage" class="w-full h-full object-cover" alt="Profile" />
                      <div v-else class="text-lg font-bold text-gray-500">{{ avatarInitial }}</div>
                    </div>
                    <div class="overflow-hidden">
                      <div class="text-[15px] font-bold text-gray-900 truncate">{{ avatarTooltipName }}</div>
                      <div class="text-xs text-gray-500 truncate">{{ avatarTooltipEmail }}</div>
                    </div>
                  </div>
                  <div class="py-2">
                    <div class="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors" @click="navigateTo('StaffSettings', 'settings')">
                      <div class="flex items-center gap-3 text-sm font-medium text-gray-700">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400">
                          <circle cx="12" cy="12" r="3"></circle>
                          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                        </svg>
                        Settings
                      </div>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-400"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                    <div class="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors text-sm font-medium text-gray-700" @click="handleLogout">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      Log Out
                    </div>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <div class="flex-1 overflow-y-auto p-4 sm:p-8">
        <div class="max-w-4xl mx-auto">
          <!-- Calendar Panel -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 sm:p-8 border-b border-gray-100 gap-4">
              <div>
                <h2 class="text-2xl font-bold text-gray-900">{{ monthYearLabel }}</h2>
                <p class="text-sm text-gray-500 mt-1">Monthly Attendance Record</p>
              </div>

              <div class="flex items-center gap-2 bg-gray-50 p-1 rounded-xl border border-gray-200">
                <button type="button" aria-label="Previous month" @click="prevMonth" class="p-2 hover:bg-white rounded-lg transition-colors text-gray-600 hover:text-gray-900 hover:shadow-sm">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
                <button type="button" @click="goToday" class="px-4 py-1.5 text-sm font-semibold text-gray-700 hover:bg-white rounded-lg transition-all hover:shadow-sm">Today</button>
                <button type="button" aria-label="Next month" @click="nextMonth" class="p-2 hover:bg-white rounded-lg transition-colors text-gray-600 hover:text-gray-900 hover:shadow-sm">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
            </div>

            <div class="p-6 sm:p-8">
              <div class="grid grid-cols-7 gap-px mb-4">
                <div class="text-center text-xs font-bold text-gray-500 uppercase tracking-wider pb-4">Sun</div>
                <div class="text-center text-xs font-bold text-gray-500 uppercase tracking-wider pb-4">Mon</div>
                <div class="text-center text-xs font-bold text-gray-500 uppercase tracking-wider pb-4">Tue</div>
                <div class="text-center text-xs font-bold text-gray-500 uppercase tracking-wider pb-4">Wed</div>
                <div class="text-center text-xs font-bold text-gray-500 uppercase tracking-wider pb-4">Thu</div>
                <div class="text-center text-xs font-bold text-gray-500 uppercase tracking-wider pb-4">Fri</div>
                <div class="text-center text-xs font-bold text-gray-500 uppercase tracking-wider pb-4">Sat</div>
              </div>

              <div class="grid grid-cols-7 gap-2 sm:gap-4">
                <div
                  v-for="cell in calendarCells"
                  :key="cell.key"
                  class="aspect-square flex flex-col items-center justify-center relative rounded-xl transition-all"
                  :class="[
                    !cell.inCurrentMonth ? 'opacity-30' : 'bg-gray-50/50 hover:bg-blue-50/50 border border-gray-100 hover:border-blue-100 cursor-pointer',
                    cell.status ? 'shadow-sm' : ''
                  ]"
                >
                  <span class="text-sm sm:text-base font-semibold text-gray-700 z-10" :class="{'text-blue-600': cell.isToday}">{{ cell.day }}</span>
                  <span v-if="cell.isToday" class="absolute top-1 sm:top-2 text-[10px] font-bold text-blue-600 uppercase tracking-wider">Today</span>
                  <span 
                    v-if="cell.status" 
                    class="absolute bottom-2 sm:bottom-3 w-3 sm:w-4 h-3 sm:h-4 rounded-full shadow-sm ring-2 ring-white" 
                    :style="getDotStyle(cell.status)" 
                    :aria-label="`AM: ${cell.status.am}, PM: ${cell.status.pm}`"
                  ></span>
                </div>
              </div>
            </div>

            <div class="bg-gray-50 border-t border-gray-100 p-4 sm:p-6 flex flex-wrap justify-center gap-4 sm:gap-8" aria-label="Attendance legend">
              <div class="flex items-center gap-2 text-sm font-medium text-gray-600"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100" aria-hidden="true"></span><span>At Office</span></div>
              <div class="flex items-center gap-2 text-sm font-medium text-gray-600"><span class="w-2.5 h-2.5 rounded-full bg-orange-400 ring-2 ring-orange-100" aria-hidden="true"></span><span>Travel / On Field</span></div>
              <div class="flex items-center gap-2 text-sm font-medium text-gray-600"><span class="w-2.5 h-2.5 rounded-full bg-blue-500 ring-2 ring-blue-100" aria-hidden="true"></span><span>Leave</span></div>
              <div class="flex items-center gap-2 text-sm font-medium text-gray-600"><span class="w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-red-100" aria-hidden="true"></span><span>Absent</span></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>


<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { collection, doc, getDoc, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import { db } from '../../firebase'

const router = useRouter()
const activeTab = ref('current')
const activeNav = ref('monthly-summary')

const today = () => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

const pad2 = (n) => String(n).padStart(2, '0')

const toDateKey = (d) => {
  const dt = new Date(d)
  const yyyy = dt.getFullYear()
  const mm = pad2(dt.getMonth() + 1)
  const dd = pad2(dt.getDate())
  return `${yyyy}-${mm}-${dd}`
}

const visibleMonth = ref(new Date())
visibleMonth.value.setDate(1)
visibleMonth.value.setHours(0, 0, 0, 0)

const monthYearLabel = computed(() => {
  return visibleMonth.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
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

const currentStaff = computed(() => {
  return resolveStaffLocal()
})

const staffId = computed(() => {
  const u = currentStaff.value
  return u?.uid || u?.id || u?.staffId || u?._id || u?.username || null
})

const staffProfile = ref(null)

const showAvatarTooltip = ref(false)
const avatarWrapEl = ref(null)

const avatarInitial = computed(() => {
  const p = staffProfile.value || currentStaff.value || null
  const firstName = typeof p?.firstName === 'string' ? p.firstName.trim() : ''
  const lastName = typeof p?.lastName === 'string' ? p.lastName.trim() : ''
  const username = typeof p?.username === 'string' ? p.username.trim() : ''
  const email = typeof p?.email === 'string' ? p.email.trim() : ''

  const basis = firstName || lastName || username || email
  const letter = basis ? String(basis).trim().charAt(0) : 'U'
  return letter ? letter.toUpperCase() : 'U'
})

const avatarTooltipName = computed(() => {
  const p = staffProfile.value || currentStaff.value || null
  const firstName = typeof p?.firstName === 'string' ? p.firstName.trim() : ''
  const lastName = typeof p?.lastName === 'string' ? p.lastName.trim() : ''

  const full = `${firstName} ${lastName}`.trim()
  return full || 'Unknown User'
})

const avatarTooltipEmail = computed(() => {
  const p = staffProfile.value || currentStaff.value || null
  const email = typeof p?.email === 'string' ? p.email.trim() : ''
  return email || ''
})

const avatarTooltipImage = computed(() => {
  const p = staffProfile.value || currentStaff.value || null
  return p?.photoUrl || p?.photoURL || p?.avatarUrl || p?.profilePicture || p?.profileImage || null
})

const toggleAvatarTooltip = () => {
  showAvatarTooltip.value = !showAvatarTooltip.value
}

const handleLogout = () => {
  localStorage.removeItem('staffUser')
  localStorage.removeItem('user') // Also clear unified user if it exists
  router.push({ name: 'LoginView' })
}

const onDocumentClick = (e) => {
  if (!showAvatarTooltip.value) return
  const el = avatarWrapEl.value
  if (!el) return
  if (el.contains(e.target)) return
  showAvatarTooltip.value = false
}

const loadStaffProfile = async () => {
  staffProfile.value = null
  if (!staffId.value) return

  try {
    const snap = await getDoc(doc(db, 'users', staffId.value))
    if (snap.exists()) {
      staffProfile.value = { id: snap.id, ...(snap.data() || {}) }
    }
  } catch {
    // ignore; avatar will fall back to localStorage user
  }
}

const monthStartKey = computed(() => {
  const d = new Date(visibleMonth.value)
  d.setDate(1)
  return toDateKey(d)
})

const monthEndKey = computed(() => {
  const d = new Date(visibleMonth.value)
  d.setMonth(d.getMonth() + 1)
  d.setDate(0)
  return toDateKey(d)
})

const attendanceByDate = ref({})
let unsubscribeAttendance = null

const normalizeStatus = (raw) => {
  const s = String(raw || '').toLowerCase()
  if (s.includes('office')) return 'office'
  if (s.includes('present')) return 'office' // legacy fallback
  if (s.includes('travel') || s.includes('field')) return 'travel'
  if (s.includes('leave')) return 'leave'
  if (s.includes('absent')) return 'absent'
  return null
}

const resolveDayStatus = (docData) => {
  if (!docData) return null

  // If the whole day has a status (like 'Leave' or 'Absent')
  if (docData.staffStatus === 'Leave') {
    return { am: 'leave', pm: 'leave' }
  }
  if (docData.staffStatus === 'Absent') {
    return { am: 'absent', pm: 'absent' }
  }

  const am = normalizeStatus(docData.staffStatusAM || docData.statusAM)
  const pm = normalizeStatus(docData.staffStatusPM || docData.statusPM)

  if (!am && !pm) return null

  return {
    am: am || 'absent',
    pm: pm || 'absent'
  }
}

const getStatusColor = (status) => {
  switch (status) {
    case 'office': return '#10b981' // Green
    case 'absent': return '#ef4444' // Red
    case 'travel': return '#f59e0b' // Orange
    case 'leave': return '#3b82f6'  // Blue
    default: return '#transparent'
  }
}

const getDotStyle = (statusObj) => {
  if (!statusObj) return {}
  const colorAm = getStatusColor(statusObj.am)
  const colorPm = getStatusColor(statusObj.pm)
  return {
    background: `linear-gradient(to right, ${colorAm} 50%, ${colorPm} 50%)`
  }
}

const subscribeToMonthAttendance = () => {
  if (unsubscribeAttendance) {
    unsubscribeAttendance()
    unsubscribeAttendance = null
  }

  attendanceByDate.value = {}

  if (!staffId.value) return

  // Widen query range to catch leaves that might have started outside the current month
  const qStart = new Date(visibleMonth.value)
  qStart.setMonth(qStart.getMonth() - 2) // Look back 2 months
  const qStartKey = toDateKey(qStart)

  const q = query(
    collection(db, 'staff_attendance'),
    where('staffId', '==', staffId.value),
    where('date', '>=', qStartKey),
    where('date', '<=', monthEndKey.value),
    orderBy('date', 'asc')
  )

  unsubscribeAttendance = onSnapshot(q, (snapshot) => {
    const map = {}
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() || {}
      
      // Traditional single-day mapping
      if (data.date) {
        map[data.date] = resolveDayStatus(data)
      }

      // Expand Leave duration if present
      if (data.staffStatus === 'Leave' && data.leaveStartDate && data.leaveEndDate) {
        const [sY, sM, sD] = data.leaveStartDate.split('-').map(Number)
        const [eY, eM, eD] = data.leaveEndDate.split('-').map(Number)
        
        const start = new Date(sY, sM - 1, sD)
        const end = new Date(eY, eM - 1, eD)
        
        const iter = new Date(start)
        while (iter <= end) {
          const k = toDateKey(iter)
          map[k] = { am: 'leave', pm: 'leave' }
          iter.setDate(iter.getDate() + 1)
        }
      }
    })
    attendanceByDate.value = map
  })
}

const calendarCells = computed(() => {
  const base = new Date(visibleMonth.value)
  base.setDate(1)
  base.setHours(0, 0, 0, 0)

  const firstDayOfWeek = base.getDay() // 0..6 (Sun..Sat)
  const start = new Date(base)
  start.setDate(base.getDate() - firstDayOfWeek)

  const end = new Date(base)
  end.setMonth(base.getMonth() + 1)
  end.setDate(0) // last day of month
  end.setHours(0, 0, 0, 0)
  const lastDayOfWeek = end.getDay()
  const gridEnd = new Date(end)
  gridEnd.setDate(end.getDate() + (6 - lastDayOfWeek))

  const cells = []
  const iter = new Date(start)
  const todayKey = toDateKey(today())
  const month = base.getMonth()

  while (iter <= gridEnd) {
    const key = toDateKey(iter)
    cells.push({
      key,
      dateKey: key,
      day: iter.getDate(),
      inCurrentMonth: iter.getMonth() === month,
      isToday: key === todayKey,
      status: attendanceByDate.value[key] || null
    })
    iter.setDate(iter.getDate() + 1)
  }

  return cells
})

const prevMonth = () => {
  const d = new Date(visibleMonth.value)
  d.setMonth(d.getMonth() - 1)
  d.setDate(1)
  d.setHours(0, 0, 0, 0)
  visibleMonth.value = d
}

const nextMonth = () => {
  const d = new Date(visibleMonth.value)
  d.setMonth(d.getMonth() + 1)
  d.setDate(1)
  d.setHours(0, 0, 0, 0)
  visibleMonth.value = d
}

const goToday = () => {
  const d = today()
  d.setDate(1)
  visibleMonth.value = d
}

const navigateTo = (routeName, navItem) => {
  activeNav.value = navItem
  router.push({ name: routeName })
}

onMounted(() => {
  subscribeToMonthAttendance()
  loadStaffProfile()
  document.addEventListener('click', onDocumentClick)
})

watch([monthStartKey, monthEndKey, staffId], () => {
  subscribeToMonthAttendance()
})

watch(staffId, () => {
  loadStaffProfile()
})

onUnmounted(() => {
  if (unsubscribeAttendance) unsubscribeAttendance()
  document.removeEventListener('click', onDocumentClick)
})
</script>
