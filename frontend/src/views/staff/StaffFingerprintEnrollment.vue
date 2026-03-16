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
          <span>AttendanceLogs</span>
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
          <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Fingerprint Enrollment</h1>
          <p class="text-sm text-gray-500 mt-1">Enroll your fingerprint for faster and more secure attendance</p>
        </div>
        <div class="flex items-center gap-6">
          <div class="flex items-center gap-3 pl-6 border-l border-gray-200">
            <div ref="avatarWrapEl" class="relative">
              <button class="w-10 h-10 rounded-full bg-blue-100 border-2 border-white shadow-sm flex items-center justify-center text-blue-700 font-bold overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all hover:scale-105" type="button" @click="toggleAvatarMenu" aria-haspopup="true" :aria-expanded="avatarMenuOpen">
                <img v-if="userPhotoUrl" :src="userPhotoUrl" class="w-full h-full object-cover" alt="Profile" />
                <span v-else class="text-sm tracking-wider">{{ userInitials || 'U' }}</span>
              </button>

              <!-- Dropdown Menu -->
              <div v-if="avatarMenuOpen" class="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 transform origin-top-right transition-all">
                <div class="p-4 border-b border-gray-100 bg-gray-50/50">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold overflow-hidden shrink-0">
                      <img v-if="userPhotoUrl" :src="userPhotoUrl" class="w-full h-full object-cover" alt="Profile" />
                      <span v-else class="text-base tracking-wider">{{ userInitials || 'U' }}</span>
                    </div>
                    <div class="min-w-0">
                      <p class="text-sm font-bold text-gray-900 truncate">{{ userDisplayName || 'User' }}</p>
                      <p class="text-xs text-gray-500 truncate mt-0.5">{{ userEmail || '' }}</p>
                    </div>
                  </div>
                </div>
                <div class="p-2">
                  <button @click="goToSettings" class="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-100 hover:text-gray-900 transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400">
                      <circle cx="12" cy="12" r="3"></circle>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                    Settings
                  </button>
                  <button @click="logout" class="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors mt-1">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-500">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Log Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <!-- Page Content -->
      <div class="flex-1 overflow-y-auto p-4 sm:p-8">
        <div class="max-w-7xl mx-auto">
          <div class="bg-white/90 rounded-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden backdrop-blur-xl p-6 sm:p-8 md:p-10 mb-8">
            <div class="mb-8">
              <h2 class="text-2xl font-bold text-gray-900">Enroll Fingerprint</h2>
              <p class="text-sm text-gray-500 mt-1 relative z-10">Connect your fingerprint scanner and follow the steps</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 relative z-10">
              <!-- Step 1 Card -->
              <div class="bg-white rounded-xl border border-gray-200 p-8 shadow-sm hover:border-gray-300 hover:shadow-md transition-all flex flex-col">
                <h3 class="text-lg font-bold text-gray-900 mb-2">Step 1</h3>
                <p class="text-sm text-gray-500 mb-8 flex-1">Make sure your fingerprint device is connected.</p>
                <button type="button" @click="checkDevice" class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-br from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg w-fit hover:-translate-y-0.5">Check device</button>
                <div class="mt-5 text-sm font-semibold flex items-center gap-2" :class="deviceConnected ? 'text-emerald-600' : 'text-amber-500'">
                  <span v-if="deviceConnected" class="flex h-2 w-2 relative">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span v-else class="flex h-2 w-2 relative">
                    <span class="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                  {{ deviceConnected ? 'Device detected' : 'No device detected' }}
                </div>
              </div>
              
              <!-- Step 2 Card -->
              <div class="bg-white rounded-xl border border-gray-200 p-8 shadow-sm hover:border-gray-300 hover:shadow-md transition-all flex flex-col">
                <h3 class="text-lg font-bold text-gray-900 mb-2">Step 2</h3>
                <p class="text-sm text-gray-500 mb-8 flex-1">Start enrollment and place your finger when prompted.</p>
                <button type="button" :disabled="!deviceConnected || enrolling" @click="startEnrollment" class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold rounded-xl shadow-md shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed w-fit hover:-translate-y-0.5 disabled:hover:translate-y-0 disabled:hover:shadow-none">
                  {{ enrolling ? 'Enrolling…' : 'Start enrollment' }}
                </button>
                <div class="mt-5 text-sm font-semibold flex items-center gap-2 text-gray-600" :class="{'text-emerald-600': enrollmentStatus === 'Enrollment successful', 'text-red-500': enrollmentStatus === 'Enrollment failed', 'text-amber-600': enrolling}">
                  <span v-if="enrollmentStatus === 'Enrollment successful'" class="flex h-2 w-2 relative"><span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span>
                  <span v-else-if="enrollmentStatus === 'Enrollment failed'" class="flex h-2 w-2 relative"><span class="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span></span>
                  <span v-else-if="enrolling" class="flex h-2 w-2 relative"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span><span class="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span></span>
                  {{ enrollmentStatus }}
                </div>
              </div>
            </div>
            
            <div class="bg-gray-50 rounded-xl border border-gray-200 p-6 relative z-10">
              <h3 class="text-base font-bold text-gray-900 mb-2">Notes</h3>
              <p class="text-sm text-gray-600 leading-relaxed max-w-2xl">
                This page only provides the UI. Your backend/device integration still needs an API endpoint to communicate with the fingerprint scanner.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>


<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { db } from '../../firebase.js'
import { doc, getDoc } from 'firebase/firestore'

const router = useRouter()

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

onMounted(() => {
  document.addEventListener('click', onDocClick)
  fetchUserProfile()
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
})

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'
const FP_BRIDGE_URL = import.meta.env.VITE_FP_BRIDGE_URL || 'http://127.0.0.1:5055'

const activeNav = ref('fingerprint')

const deviceConnected = ref(false)
const enrolling = ref(false)
const enrollmentStatus = ref('Not started')

const enrollmentStatusClass = computed(() => {
  if (enrollmentStatus.value === 'Enrollment successful') return 'ok'
  if (enrollmentStatus.value === 'Enrollment failed') return 'error'
  if (enrolling.value) return 'warn'
  return ''
})

const navigateTo = (routeName, navItem) => {
  activeNav.value = navItem
  router.push({ name: routeName })
}

const checkDevice = () => {
  deviceConnected.value = true
}

const startEnrollment = async () => {
  enrolling.value = true
  enrollmentStatus.value = 'Starting scan…'

  try {
    let staffUser = null
    try {
      const rawUnified = localStorage.getItem('user')
      const rawStaff = localStorage.getItem('staffUser')

      staffUser = JSON.parse(rawUnified || rawStaff || 'null')
    } catch {
      staffUser = null
    }

    const resolvedUser = staffUser?.user ? staffUser.user : staffUser
    const staffId = resolvedUser?.id || resolvedUser?.staffId || resolvedUser?._id || null
    const username = resolvedUser?.username || null
    const email = resolvedUser?.email || null

    if (!staffId && !username && !email) {
      enrollmentStatus.value = 'Enrollment failed'
      alert('Missing staff user identity (id/username/email). Please log in again.')
      return
    }

    // 1) Trigger scan on local C# bridge
    enrollmentStatus.value = 'Scanning fingerprint…'
    let captureRes = null
    let captureJson = null
    let captureText = ''

    try {
      captureRes = await fetch(`${FP_BRIDGE_URL}/capture/once`, { method: 'POST' })
      captureText = await captureRes.text().catch(() => '')
      captureJson = captureText ? JSON.parse(captureText) : null
    } catch (e) {
      enrollmentStatus.value = 'Enrollment failed'
      console.error('Bridge fetch failed:', e)
      alert(`Scan failed: ${e?.message || 'Failed to reach bridge (possible CORS/block)'}\n\nBridge URL: ${FP_BRIDGE_URL}`)
      return
    }

    if (!captureRes?.ok) {
      enrollmentStatus.value = 'Enrollment failed'
      console.error('Bridge response not ok:', captureRes?.status, captureText)
      alert(`Scan failed: bridge returned HTTP ${captureRes?.status || 'unknown'}\n\n${captureText || '(no response body)'}`)
      return
    }

    if (!captureJson) {
      enrollmentStatus.value = 'Enrollment failed'
      console.error('Bridge response not JSON:', captureText)
      alert(`Scan failed: invalid JSON response from bridge\n\n${captureText || '(empty)'}`)
      return
    }

    if (!captureJson.ok) {
      enrollmentStatus.value = 'Enrollment failed'
      alert(`Scan failed: ${captureJson.error || 'Unknown error'}`)
      return
    }

    const templateBase64 = captureJson.templateBase64
    if (!templateBase64) {
      enrollmentStatus.value = 'Enrollment failed'
      alert('Scan did not return a template. Please try again.')
      return
    }

    // 2) Save template in backend
    enrollmentStatus.value = 'Saving template…'
    const enrollRes = await fetch(`${API_BASE_URL}/staff/fingerprint/enroll`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ staffId, username, email, template: templateBase64 }),
    })

    const enrollJson = await enrollRes.json().catch(() => null)
    if (!enrollRes.ok) {
      enrollmentStatus.value = 'Enrollment failed'
      alert(enrollJson?.message || 'Failed to save fingerprint template')
      return
    }

    enrollmentStatus.value = 'Enrollment successful'
    alert('Fingerprint enrolled successfully!')
  } catch (error) {
    enrollmentStatus.value = 'Enrollment failed'
    alert('Make sure the C# Fingerprint Bridge is running!')
  } finally {
    enrolling.value = false
  }
}
</script>
