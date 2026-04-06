<template>
  <div class="min-h-screen flex bg-gray-50/50 font-sans antialiased text-gray-900">
    <AdminSidebar />

    <div class="flex-1 flex flex-col min-w-0">
      <header class="px-8 py-6 bg-white border-b border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">Leave Document Management</h1>
            <p class="text-sm text-gray-500 mt-1">Unified view of all staff leave documents and status updates.</p>
          </div>
          <div class="flex items-center gap-4">
             <div class="bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <span class="text-xs font-bold text-blue-700 uppercase tracking-wider">{{ leaveRequests.length }} Total Records</span>
            </div>
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-auto px-8 py-8">
        <div class="max-w-Full mx-auto">
          
          <section class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/30">
              <div class="relative flex-1 max-w-md">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                <input 
                  v-model="searchQuery"
                  type="text" 
                  placeholder="Search staff name..."
                  class="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                />
              </div>
              <div class="flex items-center gap-3">
                <select 
                  v-model="statusFilter"
                  class="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 shadow-sm transition-all"
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <button 
                  @click="refreshData" 
                  class="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm"
                  title="Refresh Data"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
                </button>
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-gray-50/80 text-[0.65rem] font-black uppercase tracking-widest text-gray-500 border-b border-gray-100">
                    <th class="px-6 py-4">Name</th>
                    <th class="px-6 py-4">Leave Start Date</th>
                    <th class="px-6 py-4">Leave End Date</th>
                    <th class="px-6 py-4">Leave Documents URL</th>
                    <th class="px-6 py-4 text-center">Status</th>
                    <th class="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr v-if="loading" class="animate-pulse">
                    <td colspan="6" class="px-6 py-20 text-center text-gray-400 font-medium italic">Retrieving leave records and documents...</td>
                  </tr>
                  <tr v-else-if="filteredRequests.length === 0">
                    <td colspan="6" class="px-6 py-20 text-center text-gray-400 font-medium italic">No leave documents matching your criteria were found.</td>
                  </tr>
                  <tr 
                    v-for="req in filteredRequests" 
                    :key="req.id"
                    class="hover:bg-blue-50/20 transition-colors group"
                  >
                    <!-- Name -->
                    <td class="px-6 py-5 whitespace-nowrap">
                      <div class="flex items-center gap-3">
                        <div class="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shadow-sm overflow-hidden border border-white ring-1 ring-blue-50">
                          <img v-if="getStaffPhoto(req.staffId)" :src="getStaffPhoto(req.staffId)" class="w-full h-full object-cover" />
                          <span v-else>{{ getStaffInitials(req.staffId) }}</span>
                        </div>
                        <div>
                          <p class="font-bold text-gray-900 leading-tight text-sm">{{ getStaffName(req.staffId) }}</p>
                          <p class="text-[10px] text-gray-400 tracking-wider font-semibold uppercase">{{ getStaffPosition(req.staffId) }}</p>
                        </div>
                      </div>
                    </td>

                    <!-- Start Date -->
                    <td class="px-6 py-5 whitespace-nowrap">
                       <span class="text-xs font-bold text-gray-700">{{ formatDate(req.leaveStartDate) }}</span>
                    </td>

                    <!-- End Date -->
                    <td class="px-6 py-5 whitespace-nowrap">
                       <span class="text-xs font-bold text-gray-700">{{ formatDate(req.leaveEndDate) }}</span>
                    </td>

                    <!-- Leave Documents URL -->
                    <td class="px-6 py-5 whitespace-nowrap">
                      <div v-if="getDocUrls(req).length > 0" class="flex flex-col gap-1.5 max-w-[250px]">
                        <div v-for="(url, idx) in getDocUrls(req)" :key="idx" class="flex items-center gap-2">
                           <a :href="url" target="_blank" class="text-[10px] text-blue-600 font-bold hover:underline truncate bg-blue-50/50 px-2 py-1 rounded border border-blue-100">
                             URL {{ idx + 1 }}: {{ getFileName(url) }}
                           </a>
                        </div>
                      </div>
                      <span v-else class="text-[10px] text-gray-300 italic font-medium">No files uploaded</span>
                    </td>

                    <!-- Status -->
                    <td class="px-6 py-5 whitespace-nowrap text-center">
                      <span :class="getStatusClass(req.validationStatus)" class="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm transition-all">
                        {{ req.validationStatus || 'Pending' }}
                      </span>
                    </td>

                    <!-- Actions -->
                    <td class="px-6 py-5 whitespace-nowrap text-right">
                      <div class="flex items-center justify-end gap-2">
                        <button 
                          @click="approveLeave(req)"
                          :disabled="req.validationStatus === 'Approved'"
                          class="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-100 disabled:opacity-30"
                          title="Approve"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </button>
                        <button 
                          @click="rejectLeave(req)"
                          :disabled="req.validationStatus === 'Rejected'"
                          class="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100 disabled:opacity-30"
                          title="Reject"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"></path></svg>
                        </button>
                        <button 
                          @click="viewDetails(req)"
                          class="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors border border-transparent hover:border-blue-200"
                          title="Details / Remarks"
                        >
                           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1-2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
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

      <!-- Detail/Remark Modal -->
      <div v-if="activeRequest" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/20 backdrop-blur-sm animate-fade-in" @click.self="activeRequest = null">
        <div class="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 overflow-hidden">
          <div class="px-8 py-6 border-b border-gray-100 bg-gray-50/50 text-center">
            <h3 class="text-xl font-bold text-gray-900">Process Leave Documents</h3>
            <p class="text-xs text-gray-500 mt-1">Review uploaded files and set validation status.</p>
          </div>
          
          <div class="p-8 space-y-6">
            <div class="flex items-center gap-4 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
               <div class="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg border-2 border-white shadow-sm overflow-hidden">
                <img v-if="getStaffPhoto(activeRequest.staffId)" :src="getStaffPhoto(activeRequest.staffId)" class="w-full h-full object-cover" />
                <span v-else>{{ getStaffInitials(activeRequest.staffId) }}</span>
              </div>
              <div>
                <p class="font-bold text-gray-900 font-sans tracking-tight">{{ getStaffName(activeRequest.staffId) }}</p>
                <p class="text-xs text-blue-600 font-bold uppercase tracking-widest text-[9px]">{{ getStaffPosition(activeRequest.staffId) }}</p>
              </div>
            </div>

            <div class="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
               <div class="flex justify-between items-center text-xs">
                  <span class="text-gray-500">Leave Duration:</span>
                  <span class="font-bold text-gray-900">{{ formatDate(activeRequest.leaveStartDate) }} - {{ formatDate(activeRequest.leaveEndDate) }}</span>
               </div>
               <div class="flex justify-between items-center text-xs">
                  <span class="text-gray-500">Total Days:</span>
                  <span class="px-2 py-0.5 bg-gray-200 rounded font-black text-gray-700">{{ calculateDuration(activeRequest.leaveStartDate, activeRequest.leaveEndDate) }} Days</span>
               </div>
            </div>

            <div class="space-y-4">
              <div class="flex flex-col gap-1.5">
                <label class="text-[0.65rem] font-black uppercase tracking-widest text-gray-400 pl-1 text-center">Status Action</label>
                <div class="grid grid-cols-2 gap-3">
                  <button 
                    @click="validationForm.status = 'Approved'"
                    :class="['py-3 rounded-xl border-2 text-xs font-bold transition-all', validationForm.status === 'Approved' ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200']"
                  >
                    APPROVE
                  </button>
                  <button 
                    @click="validationForm.status = 'Rejected'"
                    :class="['py-3 rounded-xl border-2 text-xs font-bold transition-all', validationForm.status === 'Rejected' ? 'bg-rose-50 border-rose-500 text-rose-700 shadow-sm' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200']"
                  >
                    REJECT
                  </button>
                </div>
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="text-[0.65rem] font-black uppercase tracking-widest text-gray-400 pl-1">Admin Remarks</label>
                <textarea 
                  v-model="validationForm.remarks"
                  placeholder="Notes regarding this leave validation..."
                  rows="3"
                  class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm resize-none"
                ></textarea>
              </div>
            </div>
          </div>

          <div class="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex justify-end gap-3">
            <button @click="activeRequest = null" class="px-5 py-2.5 text-xs font-bold text-gray-500 hover:text-gray-700 transition-colors tracking-widest uppercase">CLOSE</button>
            <button 
              @click="submitValidation"
              :disabled="!validationForm.status || validating"
              class="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-md shadow-blue-600/20 disabled:opacity-50 disabled:shadow-none flex items-center gap-2"
            >
              <svg v-if="validating" class="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <span>SAVE DECISION</span>
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
  name: 'AdminStaffLeave',
  components: {
    AdminSidebar
  },
  data() {
    return {
      searchQuery: '',
      statusFilter: 'All', // Default to all statuses as requested
      activeRequest: null,
      validating: false,
      validationForm: {
        status: '',
        remarks: ''
      }
    }
  },
  computed: {
    ...mapState(useStaffAttendanceStore, ['staffAttendances', 'staffUsers', 'loading']),
    
    leaveRequests() {
      // Filter for ANY record that has 'Leave' status OR leave dates populated
      return this.staffAttendances.filter(att => 
        att.staffStatus === 'Leave' || 
        att.staffStatusAM === 'Leave' || 
        att.staffStatusPM === 'Leave' ||
        (att.leaveStartDate && att.leaveStartDate !== null)
      )
    },

    filteredRequests() {
      return this.leaveRequests.filter(req => {
        const staffName = this.getStaffName(req.staffId).toLowerCase()
        const query = this.searchQuery.toLowerCase()
        const matchesSearch = staffName.includes(query)
        
        const status = req.validationStatus || 'Pending'
        const matchesStatus = this.statusFilter === 'All' || status === this.statusFilter
        
        return matchesSearch && matchesStatus
      }).sort((a, b) => {
          // Sort by updated time or start date desc
          const dateA = new Date(a.leaveStartDate)
          const dateB = new Date(b.leaveStartDate)
          return dateB - dateA
      })
    }
  },
  methods: {
    ...mapActions(useStaffAttendanceStore, [
      'fetchLeaveRequests', 
      'fetchStaffUsers', 
      'validateStaffAttendance'
    ]),
    
    async refreshData() {
       await this.fetchStaffUsers()
       await this.fetchLeaveRequests()
    },

    getStaffName(staffId) {
      const user = this.staffUsers.find(u => u.id === staffId)
      return user ? `${user.firstName} ${user.lastName}` : 'Unknown Staff'
    },

    getFileName(url) {
      try {
        const decodedUrl = decodeURIComponent(url)
        const parts = decodedUrl.split('/')
        const fileNameWithParams = parts[parts.length - 1]
        return fileNameWithParams.split('?')[0].split('%2F').pop()
      } catch (e) {
        return 'document'
      }
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

    getDocUrls(req) {
      if (Array.isArray(req.leaveDocumentUrls)) return req.leaveDocumentUrls
      if (req.leaveDocumentUrl) return [req.leaveDocumentUrl]
      return []
    },

    formatDate(dateStr) {
      if (!dateStr) return '-'
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) return dateStr
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    },

    formatTimestamp(ts) {
      if (!ts) return ''
      const date = ts.toDate ? ts.toDate() : new Date(ts)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    },

    calculateDuration(start, end) {
      if (!start || !end) return 0
      const d1 = new Date(start)
      const d2 = new Date(end)
      const diffTime = Math.abs(d2 - d1)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
      return diffDays
    },

    getStatusClass(status) {
      switch (status) {
        case 'Approved': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
        case 'Rejected': return 'bg-rose-50 text-rose-700 border-rose-200'
        default: return 'bg-blue-50 text-blue-700 border-blue-200'
      }
    },

    viewDetails(req) {
      this.activeRequest = req
      this.validationForm.status = req.validationStatus || 'Approved'
      this.validationForm.remarks = req.remarks || ''
    },

    async approveLeave(req) {
      if (confirm(`Approve leave request and documents for ${this.getStaffName(req.staffId)}?`)) {
        await this.validateStaffAttendance(req.id, 'Approved', 'Leave request and documents approved.')
      }
    },

    async rejectLeave(req) {
      const reason = prompt('Please provide a reason for rejecting these leave documents:')
      if (reason !== null) {
        await this.validateStaffAttendance(req.id, 'Rejected', reason || 'Request rejected.')
      }
    },

    async submitValidation() {
      if (!this.activeRequest) return
      this.validating = true
      const res = await this.validateStaffAttendance(
        this.activeRequest.id, 
        this.validationForm.status, 
        this.validationForm.remarks
      )
      this.validating = false
      if (res.success) {
        this.activeRequest = null
      } else {
        alert('Failed to update: ' + (res.error || 'Unknown error'))
      }
    }
  },
  async mounted() {
    await this.refreshData()
  }
}
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.max-w-Full {
    max-width: 100% !important;
}
</style>
