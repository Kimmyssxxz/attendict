<template>
  <div class="min-h-screen flex bg-gray-50/50 font-sans antialiased text-gray-900">
    <AdminSidebar />

    <div class="flex-1 flex flex-col min-w-0">
      <header class="px-8 py-6 bg-white border-b border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">Attendance Validation</h1>
            <p class="text-sm text-gray-500 mt-1">Review and validate staff attendance logs for compliance.</p>
          </div>
          <div class="flex items-center gap-4">
             <div class="bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              <span class="text-xs font-bold text-blue-700 uppercase tracking-wider">Live Monitoring</span>
            </div>
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
              <div class="flex items-center gap-3">
                <select 
                  v-model="statusFilter"
                  class="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 shadow-sm"
                >
                  <option value="All">All Status</option>
                  <option value="At Office">At Office</option>
                  <option value="On Field">On Field</option>
                  <option value="Travel">Travel</option>
                  <option value="Leave">Leave</option>
                </select>
                <select 
                  v-model="validationFilter"
                  class="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 shadow-sm"
                >
                  <option value="All">All Validation</option>
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>
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
                    <th class="px-6 py-4">Photo</th>
                    <th class="px-6 py-4 text-center">Validation</th>
                    <th class="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr v-if="loading" class="animate-pulse">
                    <td colspan="9" class="px-6 py-20 text-center text-gray-400 font-medium">Fetching records...</td>
                  </tr>
                  <tr v-else-if="filteredAttendances.length === 0">
                    <td colspan="9" class="px-6 py-20 text-center text-gray-400 font-medium">No attendance records found matched your criteria.</td>
                  </tr>
                  <tr 
                    v-for="att in filteredAttendances" 
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

                    <!-- Photo -->
                    <td class="px-6 py-5 whitespace-nowrap">
                      <button 
                        v-if="att.photoUrl" 
                        @click="previewPhoto(att.photoUrl)"
                        class="w-10 h-10 rounded-lg overflow-hidden border-2 border-white shadow-sm ring-1 ring-gray-100 hover:ring-blue-400 transition-all"
                      >
                        <img :src="att.photoUrl" class="w-full h-full object-cover" />
                      </button>
                      <span v-else class="text-[10px] text-gray-300 italic font-medium">No photo</span>
                    </td>

                    <!-- Validation Status -->
                    <td class="px-6 py-5 whitespace-nowrap">
                      <div class="flex flex-col gap-1">
                        <span :class="getValidationClass(att)" class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border text-center shadow-sm">
                          {{ getValidationDisplayText(att) }}
                        </span>
                        <span v-if="att.validatedAt" class="text-[8px] text-gray-400 text-center italic">Validated {{ formatLastUpdate(att.validatedAt) }}</span>
                      </div>
                    </td>



                    <!-- Actions -->
                    <td class="px-6 py-5 whitespace-nowrap text-right">
                      <div class="flex items-center justify-end gap-2">
                        <button 
                          @click="approveAttendance(att)"
                          :disabled="att.validationStatus === 'Approved'"
                          class="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-transparent hover:border-green-100 disabled:opacity-30 tooltip"
                          title="Approve"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </button>
                        <button 
                          @click="rejectAttendance(att)"
                          :disabled="att.validationStatus === 'Rejected'"
                          class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100 disabled:opacity-30"
                          title="Reject"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"></path></svg>
                        </button>
                        <button 
                          @click="viewDetails(att)"
                          class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                          title="Details/Edit"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      <!-- Photo Preview Modal -->
      <div v-if="showingPhoto" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-md animate-fade-in" @click.self="showingPhoto = null">
        <div class="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/20">
          <button @click="showingPhoto = null" class="absolute top-4 right-4 z-10 w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center text-xl backdrop-blur-sm transition-all border border-white/10">✕</button>
          <img :src="showingPhoto" class="w-full h-auto max-h-[85vh] object-contain" />
        </div>
      </div>

      <!-- Detail/Remark Modal -->
      <div v-if="activeAttendance" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/20 backdrop-blur-sm animate-fade-in" @click.self="activeAttendance = null">
        <div class="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 overflow-hidden transform transition-all">
          <div class="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
            <h3 class="text-xl font-bold text-gray-900">Attendance Validation</h3>
            <p class="text-xs text-gray-500 mt-1">Submit your manual validation and remarks.</p>
          </div>
          
          <div class="p-8 space-y-6">
            <div class="flex items-center gap-4 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
               <div class="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg border-2 border-white shadow-sm overflow-hidden">
                <img v-if="getStaffPhoto(activeAttendance.staffId)" :src="getStaffPhoto(activeAttendance.staffId)" class="w-full h-full object-cover" />
                <span v-else>{{ getStaffInitials(activeAttendance.staffId) }}</span>
              </div>
              <div>
                <p class="font-bold text-gray-900">{{ getStaffName(activeAttendance.staffId) }}</p>
                <p class="text-xs text-gray-500">{{ formatDate(activeAttendance.date) }} • {{ activeAttendance.staffStatus }}</p>
              </div>
            </div>

            <div class="space-y-4">
              <div class="flex flex-col gap-1.5">
                <label class="text-[0.65rem] font-black uppercase tracking-widest text-gray-400 pl-1">Validation Action</label>
                <div class="grid grid-cols-2 gap-3">
                  <button 
                    @click="validationForm.status = 'Approved'"
                    :class="['py-3 rounded-xl border-2 text-xs font-bold transition-all', validationForm.status === 'Approved' ? 'bg-green-50 border-green-500 text-green-700 shadow-sm' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200']"
                  >
                    APPROVE
                  </button>
                  <button 
                    @click="validationForm.status = 'Rejected'"
                    :class="['py-3 rounded-xl border-2 text-xs font-bold transition-all', validationForm.status === 'Rejected' ? 'bg-red-50 border-red-500 text-red-700 shadow-sm' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200']"
                  >
                    REJECT
                  </button>
                </div>
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="text-[0.65rem] font-black uppercase tracking-widest text-gray-400 pl-1">Remarks / Notes</label>
                <textarea 
                  v-model="validationForm.remarks"
                  placeholder="Enter reason for rejection or special notes..."
                  rows="3"
                  class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm resize-none"
                ></textarea>
              </div>
            </div>
          </div>

          <div class="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex justify-end gap-3">
            <button @click="activeAttendance = null" class="px-5 py-2.5 text-xs font-bold text-gray-500 hover:text-gray-700 transition-colors">CANCEL</button>
            <button 
              @click="submitValidation"
              :disabled="!validationForm.status || validating"
              class="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-md shadow-blue-600/20 disabled:opacity-50 disabled:shadow-none flex items-center gap-2"
            >
              <svg v-if="validating" class="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <span>SUBMIT ACTION</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import AdminSidebar from './AdminSidebar.vue'
import { mapActions, mapState } from 'pinia'
import { useStaffAttendanceStore } from '../../stores/staffAttendanceStore'

export default {
  name: 'AdminStaffAttendanceValidation',
  components: {
    AdminSidebar
  },
  data() {
    return {
      searchQuery: '',
      statusFilter: 'All',
      validationFilter: 'All',
      showingPhoto: null,
      activeAttendance: null,
      validating: false,
      validationForm: {
        status: 'Approved',
        remarks: ''
      },
      // The specific Calapan address for auto-approval
      OFFICE_ADDRESS: 'M. Roxas Drive, Lalom, Santa Isabel, Calapan, Oriental Mindoro, Philippines'
    }
  },
  computed: {
    ...mapState(useStaffAttendanceStore, ['staffAttendances', 'staffUsers', 'loading']),
    
    filteredAttendances() {
      return this.staffAttendances.filter(att => {
        const staffName = this.getStaffName(att.staffId).toLowerCase()
        const date = this.formatDate(att.date).toLowerCase()
        const addr = (att.LocAM?.address || att.LocPM?.address || att.address || '').toLowerCase()
        const query = this.searchQuery.toLowerCase()
        
        const matchesSearch = staffName.includes(query) || date.includes(query) || addr.includes(query)
        const matchesStatus = this.statusFilter === 'All' || att.staffStatus === this.statusFilter
        
        const currentValidation = this.getValidationDisplayText(att)
        const matchesValidation = this.validationFilter === 'All' || currentValidation === this.validationFilter

        return matchesSearch && matchesStatus && matchesValidation
      })
    }
  },
  methods: {
    ...mapActions(useStaffAttendanceStore, ['fetchAllStaffAttendances', 'fetchStaffUsers', 'validateStaffAttendance']),
    
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

    formatLastUpdate(timestamp) {
      if (!timestamp) return ''
      if (timestamp.toDate) return timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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

    getValidationClass(att) {
      const status = this.getValidationDisplayText(att)
      switch (status) {
        case 'Approved': return 'bg-green-50 text-green-700 border-green-200'
        case 'Rejected': return 'bg-red-50 text-red-700 border-red-200'
        default: return 'bg-amber-50 text-amber-700 border-amber-200'
      }
    },

    getValidationDisplayText(att) {
      // If manually set in DB, use that
      if (att.validationStatus) return att.validationStatus
      
      // Auto-approval logic
      const addr = att.LocAM?.address || att.LocPM?.address || att.address || ''
      if (addr.includes('M. Roxas Drive') || addr.includes('Santa Isabel') || addr.includes('Calapan')) {
        return 'Approved'
      }
      
      return 'Pending'
    },

    previewPhoto(url) {
      this.showingPhoto = url
    },

    viewDetails(att) {
      this.activeAttendance = att
      this.validationForm.status = this.getValidationDisplayText(att)
      this.validationForm.remarks = att.remarks || ''
    },

    async approveAttendance(att) {
      if (confirm(`Approve attendance for ${this.getStaffName(att.staffId)}?`)) {
        await this.validateStaffAttendance(att.id, 'Approved', 'Validated by Admin')
      }
    },

    async rejectAttendance(att) {
      const reason = prompt('Reason for rejection:')
      if (reason !== null) {
        await this.validateStaffAttendance(att.id, 'Rejected', reason || 'Rejected by Admin')
      }
    },

    async submitValidation() {
      if (!this.activeAttendance) return
      this.validating = true
      const res = await this.validateStaffAttendance(
        this.activeAttendance.id, 
        this.validationForm.status, 
        this.validationForm.remarks
      )
      this.validating = false
      if (res.success) {
        this.activeAttendance = null
      } else {
        alert('Failed to update validation: ' + (res.error || 'Unknown error'))
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
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f8fafc;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}

@keyframes fade-in {
  from { opacity: 0; transform: scale(0.98); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fade-in {
  animation: fade-in 0.2s ease-out forwards;
}

.max-w-Full {
    max-width: 100% !important;
}
</style>
