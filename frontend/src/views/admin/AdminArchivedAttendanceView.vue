<template>
  <div class="min-h-screen flex bg-gray-50/50 font-sans antialiased text-gray-900">
    <AdminSidebar activeNav="archive" />

    <div class="flex-1 flex flex-col min-w-0">
      <header class="px-8 py-6 bg-white ">
        <div class="flex items-center gap-4">
          <router-link to="/admin/archive" class="p-2 text-gray-600 hover:text-gray-400">
            <svg width="32" height="32" viewBox="0 0 12 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill="currentColor" fill-rule="evenodd" d="m3.343 12l7.071 7.071L9 20.485l-7.778-7.778a1 1 0 0 1 0-1.414L9 3.515l1.414 1.414z"/>
            </svg>
          </router-link>
          <div>
            <h1 class="text-3xl font-semibold text-gray-900">Archived Attendance Logs</h1>
            <p class="text-gray-500 ">View staff attendance logs that have been archived.</p>
          </div>
          <div class="ml-auto flex gap-3">
            <button 
              @click="showRestoreAllModal = true"
              class="px-4 py-2 bg-green-50 text-green-700 rounded-xl text-sm font-bold border border-green-100 hover:bg-green-100 transition-all flex items-center gap-2"
              :disabled="loading || archivedAttendances.length === 0"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 14 4 9 9 4"></polyline><path d="M20 20v-7a4 4 0 0 0-4-4H4"></path></svg>
              Restore All
            </button>
            <button 
              @click="showDeleteAllModal = true"
              class="px-4 py-2 bg-red-50 text-red-700 rounded-xl text-sm font-bold border border-red-100 hover:bg-red-100 transition-all flex items-center gap-2"
              :disabled="loading || archivedAttendances.length === 0"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              Delete All
            </button>
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-auto px-6 py-6">
        <TableSkeleton v-if="loading" :rows="8" />
        <div v-else>
          
          <!-- Table Section -->
          <section class="bg-white rounded-xl shadow-sm overflow-hidden">
            <!-- Table Header / Search -->
            <div class="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/30">
              <div class="relative flex-1 max-w-md">
                <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0s.41-1.08 0-1.49zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14"/>
                </svg>
                <input 
                  v-model="searchQuery"
                  type="text" 
                  placeholder="Search staff, date, or address..."
                  class="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-blue-500/10 transition-all "
                />
              </div>
            </div>

            <!-- Table Container -->
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-gray-50/80 text-xs text-gray-500">
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
                  <tr v-if="archivedAttendances.length === 0">
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
 
      <!-- Restore Confirmation Modal -->
      <Transition name="modal">
        <div v-if="showRestoreModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center border border-gray-100">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <polyline points="9 14 4 9 9 4"></polyline>
                <path d="M20 20v-7a4 4 0 0 0-4-4H4"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">Restore Attendance Log</h3>
            <p class="text-gray-600 mb-8">
              Restore archived attendance for <span class="font-bold text-gray-900">{{ getStaffName(attendanceToRestore?.staffId) }}</span>?
            </p>
            <div class="flex gap-3">
              <button 
                @click="showRestoreModal = false"
                class="flex-1 py-3 bg-gray-50 text-gray-700 rounded-xl font-bold hover:bg-gray-100 transition-all cursor-pointer"
                :disabled="restoring"
              >
                Cancel
              </button>
              <button 
                @click="confirmRestore"
                class="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all cursor-pointer disabled:opacity-70"
                :disabled="restoring"
              >
                {{ restoring ? 'Restoring...' : 'Confirm Restore' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
 
      <!-- Delete Confirmation Modal -->
      <Transition name="modal">
        <div v-if="showDeleteModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center border border-gray-100">
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M3 6h18"></path>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-red-600 mb-2">Delete Permanently</h3>
            <p class="text-gray-600 mb-8">
              Are you sure you want to PERMANENTLY delete the attendance for <span class="font-bold text-gray-900">{{ getStaffName(attendanceToDelete?.staffId) }}</span>? This action cannot be undone.
            </p>
            <div class="flex gap-3">
              <button 
                @click="showDeleteModal = false"
                class="flex-1 py-3 bg-gray-50 text-gray-700 rounded-xl font-bold hover:bg-gray-100 transition-all cursor-pointer"
                :disabled="deleting"
              >
                Cancel
              </button>
              <button 
                @click="confirmDelete"
                class="flex-1 py-3 bg-[#b92e2b] text-white rounded-xl font-bold hover:bg-red-700 transition-all cursor-pointer disabled:opacity-70"
                :disabled="deleting"
              >
                {{ deleting ? 'Deleting...' : 'Confirm Delete' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Restore All Confirmation Modal -->
      <Transition name="modal">
        <div v-if="showRestoreAllModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center border border-gray-100">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <polyline points="9 14 4 9 9 4"></polyline>
                <path d="M20 20v-7a4 4 0 0 0-4-4H4"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">Restore All Logs</h3>
            <p class="text-gray-600 mb-8">
              Are you sure you want to restore <span class="font-bold text-gray-900">{{ archivedAttendances.length }}</span> archived attendance records?
            </p>
            <div class="flex gap-3">
              <button @click="showRestoreAllModal = false" class="flex-1 py-3 bg-gray-50 text-gray-700 rounded-xl font-bold hover:bg-gray-100 transition-all cursor-pointer">Cancel</button>
              <button @click="confirmRestoreAll" class="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all cursor-pointer disabled:opacity-70" :disabled="restoringAll">
                {{ restoringAll ? 'Restoring...' : 'Confirm Restore All' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Delete All Confirmation Modal -->
      <Transition name="modal">
        <div v-if="showDeleteAllModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center border border-gray-100">
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M3 6h18"></path>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-red-600 mb-2">Delete All Permanently</h3>
            <p class="text-gray-600 mb-8">
              Are you sure you want to PERMANENTLY delete <span class="font-bold text-gray-900">{{ archivedAttendances.length }}</span> records? This will also delete all associated photos and documents. This action cannot be undone.
            </p>
            <div class="flex gap-3">
              <button @click="showDeleteAllModal = false" class="flex-1 py-3 bg-gray-50 text-gray-700 rounded-xl font-bold hover:bg-gray-100 transition-all cursor-pointer">Cancel</button>
              <button @click="confirmDeleteAll" class="flex-1 py-3 bg-[#b92e2b] text-white rounded-xl font-bold hover:bg-red-700 transition-all cursor-pointer disabled:opacity-70" :disabled="deletingAll">
                {{ deletingAll ? 'Deleting All...' : 'Confirm Delete All' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
  </div>
</template>

<script>
import AdminSidebar from './AdminSidebar.vue'
import TableSkeleton from '../../components/skeletons/TableSkeleton.vue'
import { mapActions, mapState } from 'pinia'
import { useStaffAttendanceStore } from '../../stores/staffAttendanceStore'
import { doc, updateDoc, deleteDoc, serverTimestamp, writeBatch } from 'firebase/firestore'
import { ref as sRef, deleteObject } from 'firebase/storage'
import { db, storage } from '../../firebase.js'

export default {
  name: 'AdminArchivedAttendanceView',
  components: {
    AdminSidebar,
    TableSkeleton
  },
  data() {
    return {
      searchQuery: '',
      showRestoreModal: false,
      showDeleteModal: false,
      showRestoreAllModal: false,
      showDeleteAllModal: false,
      attendanceToRestore: null,
      attendanceToDelete: null,
      restoring: false,
      deleting: false,
      restoringAll: false,
      deletingAll: false,
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

    restoreAttendance(att) {
      this.attendanceToRestore = att
      this.showRestoreModal = true
    },

    async confirmRestore() {
      if (!this.attendanceToRestore) return
      this.restoring = true
      try {
        const docRef = doc(db, 'staff_attendance', this.attendanceToRestore.id)
        await updateDoc(docRef, {
          isArchived: false,
          updatedAt: serverTimestamp()
        })
        
        const store = useStaffAttendanceStore()
        const index = store.staffAttendances.findIndex(a => a.id === this.attendanceToRestore.id)
        if (index !== -1) {
          store.staffAttendances[index].isArchived = false
        }
        this.showRestoreModal = false
        this.attendanceToRestore = null
      } catch (e) {
        console.error("Error restoring log:", e)
        alert("Failed to restore log.")
      } finally {
        this.restoring = false
      }
    },

    deleteAttendance(att) {
      this.attendanceToDelete = att
      this.showDeleteModal = true
    },

    async confirmDelete() {
      if (!this.attendanceToDelete) return
      this.deleting = true
      try {
        // 1. Delete associated files from Storage
        await this.deleteAttendanceFiles(this.attendanceToDelete)

        // 2. Delete from Firestore
        const res = await this.deleteStaffAttendance(this.attendanceToDelete.id)
        if (!res.success) throw new Error(res.error)
        
        this.showDeleteModal = false
        this.attendanceToDelete = null
      } catch (e) {
        console.error('Error deleting log:', e)
        alert('Failed to delete log.')
      } finally {
        this.deleting = false
      }
    },

    async confirmRestoreAll() {
      if (this.archivedAttendances.length === 0) return
      this.restoringAll = true
      try {
        const batch = writeBatch(db)
        const store = useStaffAttendanceStore()
        
        this.archivedAttendances.forEach(att => {
          const docRef = doc(db, 'staff_attendance', att.id)
          batch.update(docRef, {
            isArchived: false,
            updatedAt: serverTimestamp()
          })
          
          const index = store.staffAttendances.findIndex(a => a.id === att.id)
          if (index !== -1) {
            store.staffAttendances[index].isArchived = false
          }
        })
        
        await batch.commit()
        this.showRestoreAllModal = false
      } catch (e) {
        console.error("Error restoring all logs:", e)
        alert("Failed to restore all logs.")
      } finally {
        this.restoringAll = false
      }
    },

    async confirmDeleteAll() {
      if (this.archivedAttendances.length === 0) return
      this.deletingAll = true
      try {
        const store = useStaffAttendanceStore()
        const recordsToDelete = [...this.archivedAttendances]

        // 1. Delete all associated files from Storage
        for (const att of recordsToDelete) {
          await this.deleteAttendanceFiles(att)
        }

        // 2. Delete from Firestore (Batched)
        const batchSize = 500
        for (let i = 0; i < recordsToDelete.length; i += batchSize) {
          const batch = writeBatch(db)
          const chunk = recordsToDelete.slice(i, i + batchSize)
          chunk.forEach(att => {
            batch.delete(doc(db, 'staff_attendance', att.id))
            store.staffAttendances = store.staffAttendances.filter(a => a.id !== att.id)
          })
          await batch.commit()
        }

        this.showDeleteAllModal = false
      } catch (e) {
        console.error("Error deleting all logs:", e)
        alert("Failed to delete all logs.")
      } finally {
        this.deletingAll = false
      }
    },

    async deleteAttendanceFiles(att) {
      const urls = [
        att.photoUrl,
        att.photoOutUrlAM,
        att.photoUrlPM,
        att.photoOutUrlPM,
        att.leaveDocumentUrl,
        ...(Array.isArray(att.leaveDocumentUrls) ? att.leaveDocumentUrls : [])
      ].filter(url => url && typeof url === 'string' && url.includes('firebasestorage.googleapis.com'))

      for (const url of urls) {
        try {
          const path = this.extractStoragePath(url)
          if (path) {
            const fileRef = sRef(storage, path)
            await deleteObject(fileRef)
          }
        } catch (err) {
          console.warn(`Could not delete file at ${url}:`, err)
          // Continue even if one file fails
        }
      }
    },

    extractStoragePath(url) {
      try {
        // Firebase Storage URL format: .../o/path%2Fto%2Ffile.ext?alt=media...
        const part = url.split('/o/')[1]
        if (!part) return null
        const encodedPath = part.split('?')[0]
        return decodeURIComponent(encodedPath)
      } catch (e) {
        return null
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
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-white {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-enter-from .bg-white {
  transform: scale(0.9) translateY(20px);
}
</style>
