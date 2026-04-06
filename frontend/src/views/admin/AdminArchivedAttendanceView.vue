<template>
  <div class="min-h-screen flex bg-gray-50/50 font-sans antialiased text-gray-900">
    <AdminSidebar activeNav="archive" />

    <div class="flex-1 flex flex-col min-w-0">
      <header class="px-8 py-6 bg-white border-b border-gray-200">
        <div class="flex items-center gap-4">
          <router-link to="/admin/archive" class="p-2 bg-gray-50 text-gray-400 hover:text-gray-600 rounded-lg transition-colors border border-gray-200">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          </router-link>
          <div>
            <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">Archived Attendance Logs</h1>
            <p class="text-sm text-gray-500 mt-1">View staff attendance logs that have been archived.</p>
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-auto px-8 py-8">
        <div class="max-w-Full mx-auto">
          
          <!-- Table Section -->
          <section class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <!-- Table Header / Search -->
            <div class="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/30">
              <div class="relative flex-1 max-w-md">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
                <input 
                  v-model="searchQuery"
                  type="text" 
                  placeholder="Search staff, date, or address..."
                  class="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                />
              </div>
            </div>

            <!-- Table Container -->
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-gray-50/80 text-[0.65rem] font-black uppercase tracking-widest text-gray-500">
                    <th class="px-6 py-4">Staff Member</th>
                    <th class="px-6 py-4">Date</th>
                    <th class="px-6 py-4">Time In</th>
                    <th class="px-6 py-4">Time Out</th>
                    <th class="px-6 py-4">Status</th>
                    <th class="px-6 py-4">Location/Address</th>
                    <th class="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr v-if="loading" class="animate-pulse">
                    <td colspan="7" class="px-6 py-20 text-center text-gray-400 font-medium">Fetching archived records...</td>
                  </tr>
                  <tr v-else-if="archivedAttendances.length === 0">
                    <td colspan="7" class="px-6 py-20 text-center text-gray-400 font-medium">No archived attendance records found.</td>
                  </tr>
                  <tr 
                    v-for="att in archivedAttendances" 
                    :key="att.id"
                    class="hover:bg-blue-50/30 transition-colors group"
                  >
                    <!-- Staff Member -->
                    <td class="px-6 py-5 whitespace-nowrap">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shadow-sm overflow-hidden border border-white ring-1 ring-blue-50">
                          <img v-if="getStaffPhoto(att.staffId)" :src="getStaffPhoto(att.staffId)" class="w-full h-full object-cover" />
                          <span v-else>{{ getStaffInitials(att.staffId) }}</span>
                        </div>
                        <div>
                          <p class="font-bold text-gray-900 leading-tight">{{ getStaffName(att.staffId) }}</p>
                          <p class="text-[10px] text-gray-400 tracking-wider font-semibold uppercase">{{ getStaffPosition(att.staffId) }}</p>
                        </div>
                      </div>
                    </td>

                    <!-- Date -->
                    <td class="px-6 py-5 whitespace-nowrap text-xs font-bold text-gray-700 tabular-nums">
                      {{ formatDate(att.date) }}
                    </td>

                    <!-- Time In -->
                    <td class="px-6 py-5 whitespace-nowrap">
                      <div class="flex flex-col">
                        <span class="text-xs font-bold text-gray-800">{{ att.timeInAM || '-' }} <span class="text-[10px] text-gray-400 font-medium">AM</span></span>
                        <span class="text-xs font-bold text-gray-800">{{ att.timeInPM || '-' }} <span class="text-[10px] text-gray-400 font-medium">PM</span></span>
                      </div>
                    </td>

                    <!-- Time Out -->
                    <td class="px-6 py-5 whitespace-nowrap">
                      <div class="flex flex-col">
                        <span class="text-xs font-bold text-gray-800">{{ att.timeOutAM || '-' }} <span class="text-[10px] text-gray-400 font-medium">AM</span></span>
                        <span class="text-xs font-bold text-gray-800">{{ att.timeOutPM || '-' }} <span class="text-[10px] text-gray-400 font-medium">PM</span></span>
                      </div>
                    </td>

                    <!-- Status -->
                    <td class="px-6 py-5 whitespace-nowrap">
                      <span :class="getStatusClass(att.staffStatus)" class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border">
                        {{ att.staffStatus || 'Pending' }}
                      </span>
                    </td>

                    <!-- Address -->
                    <td class="px-6 py-5 whitespace-nowrap">
                      <div class="max-w-[200px] overflow-hidden text-ellipsis italic text-[11px] text-gray-500 leading-relaxed bg-gray-50/50 px-2 py-1 rounded-lg border border-gray-100">
                        {{ att.LocAM?.address || att.LocPM?.address || att.address || 'Location data unavailable' }}
                      </div>
                    </td>

                    <!-- Actions -->
                    <td class="px-6 py-5 whitespace-nowrap flex gap-2">
                      <button 
                        @click="restoreAttendance(att)" 
                        class="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-transparent hover:border-green-100" 
                        title="Restore Log"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 14 4 9 9 4"></polyline><path d="M20 20v-7a4 4 0 0 0-4-4H4"></path></svg>
                      </button>
                      <button 
                        @click="deleteAttendance(att)" 
                        class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100" 
                        title="Delete Permanently"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

    </div>
  </div>
</template>

<script>
import AdminSidebar from './AdminSidebar.vue'
import { mapActions, mapState } from 'pinia'
import { useStaffAttendanceStore } from '../../stores/staffAttendanceStore'
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase.js'

export default {
  name: 'AdminArchivedAttendanceView',
  components: {
    AdminSidebar
  },
  data() {
    return {
      searchQuery: '',
    }
  },
  computed: {
    ...mapState(useStaffAttendanceStore, ['staffAttendances', 'staffUsers', 'loading']),
    
    archivedAttendances() {
      return this.staffAttendances.filter(att => {
        if (!att.isArchived) return false

        const staffName = this.getStaffName(att.staffId).toLowerCase()
        const date = this.formatDate(att.date).toLowerCase()
        const addr = (att.LocAM?.address || att.LocPM?.address || att.address || '').toLowerCase()
        const query = this.searchQuery.toLowerCase()
        
        return staffName.includes(query) || date.includes(query) || addr.includes(query)
      })
    }
  },
  methods: {
    ...mapActions(useStaffAttendanceStore, ['fetchAllStaffAttendances', 'fetchStaffUsers', 'deleteStaffAttendance']),
    
    getStaffName(staffId) {
      const user = this.staffUsers.find(u => u.id === staffId)
      return user ? `${user.firstName} ${user.lastName}` : 'Unknown Staff'
    },
    
    getStaffPhoto(staffId) {
      return this.staffUsers.find(u => u.id === staffId)?.photoUrl || null
    },

    getStaffPosition(staffId) {
      return this.staffUsers.find(u => u.id === staffId)?.position || 'Staff'
    },

    getStaffInitials(staffId) {
      const user = this.staffUsers.find(u => u.id === staffId)
      if (!user) return '?'
      return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
    },

    formatDate(dateStr) {
      if (!dateStr) return '-'
      const [y, m, d] = dateStr.split('-')
      if (!y || !m || !d) return dateStr
      const date = new Date(y, m - 1, d)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    },

    getStatusClass(status) {
      switch (status) {
        case 'At Office': return 'bg-blue-50 text-blue-700 border-blue-200'
        case 'On Field': return 'bg-amber-50 text-amber-700 border-amber-200'
        case 'Travel': return 'bg-purple-50 text-purple-700 border-purple-200'
        case 'Leave': return 'bg-red-50 text-red-700 border-red-200'
        default: return 'bg-gray-50 text-gray-700 border-gray-200'
      }
    },

    async restoreAttendance(att) {
      if (confirm(`Restore archived attendance for ${this.getStaffName(att.staffId)}?`)) {
        try {
          const docRef = doc(db, 'staff_attendance', att.id)
          await updateDoc(docRef, {
            isArchived: false,
            updatedAt: serverTimestamp()
          })
          
          // Refresh list locally
          const store = useStaffAttendanceStore()
          const index = store.staffAttendances.findIndex(a => a.id === att.id)
          if (index !== -1) {
            store.staffAttendances[index].isArchived = false
          }
        } catch (e) {
          console.error("Error restoring log:", e)
          alert("Failed to restore log.")
        }
      }
    },

    async deleteAttendance(att) {
      if (confirm(`Are you sure you want to PERMANENTLY delete the attendance for ${this.getStaffName(att.staffId)}? This action cannot be undone.`)) {
        try {
          const res = await this.deleteStaffAttendance(att.id)
          if (!res.success) throw new Error(res.error)
        } catch (e) {
          console.error('Error deleting log:', e)
          alert('Failed to delete log.')
        }
      }
    }
  },
  async mounted() {
    this.fetchStaffUsers()
    this.fetchAllStaffAttendances()
  }
}
</script>

<style scoped>
.max-w-Full {
    max-width: 100% !important;
}
</style>
