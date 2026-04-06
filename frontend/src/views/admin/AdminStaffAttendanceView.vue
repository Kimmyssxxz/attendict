<template>
  <div class="min-h-screen flex flex-col md:flex-row bg-gray-50/50">
    <AdminSidebar />

    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Premium Header -->
      <header class="px-8 py-8 bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-lg z-10">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 class="m-0 text-3xl font-extrabold tracking-tight">Staff Management</h1>
            <p class="text-blue-100 mt-2 text-sm font-medium opacity-90">Manage staff profiles, roles, and administrative access.</p>
          </div>
          <div class="flex items-center gap-3">
             <button 
              @click="openAddModal"
              class="bg-white text-blue-600 px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-blue-50 transition-all active:scale-95 flex items-center gap-2"
            >
              <span class="text-lg">+</span> Add Staff Member
            </button>
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-auto px-8 py-8">
        <div class="max-w-Full mx-auto">

          <!-- Table Section -->
          <section class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <!-- Table Controls -->
            <div class="p-6 border-b border-gray-50 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white/50 backdrop-blur-sm">
              <div class="flex-1 max-w-2xl relative">
                <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input
                  v-model="search"
                  type="text"
                  placeholder="Search by name, username, or email..."
                  class="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              <div class="flex flex-wrap items-center gap-3">
                <select 
                  v-model="positionFilter"
                  class="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                >
                  <option value="all">All Positions</option>
                  <option v-for="pos in uniquePositions" :key="pos" :value="pos">{{ pos }}</option>
                </select>

                <div class="h-8 w-[1px] bg-gray-200 mx-1 hidden sm:block"></div>

                <button 
                  @click="exportToPDF"
                  class="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition-all active:scale-95"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                  Export PDF
                </button>
                <button 
                  @click="exportToWord"
                  class="flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 rounded-xl text-sm font-bold hover:bg-blue-100 transition-all active:scale-95"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  Export Word
                </button>
              </div>
            </div>

            <!-- Table Content -->
            <div class="overflow-x-auto">
              <table class="w-full text-sm text-left">
                <thead>
                  <tr class="bg-gray-50/50 text-gray-500 font-bold uppercase tracking-wider text-[0.7rem]">
                    <th class="px-6 py-4">Full Name</th>
                    <th class="px-6 py-4">Username</th>
                    <th class="px-6 py-4">Email</th>
                    <th class="px-6 py-4">Role / Position</th>
                    <th class="px-6 py-4">Office</th>
                    <th class="px-6 py-4">Gender</th>
                    <th class="px-6 py-4">Age</th>
                    <th class="px-6 py-4">Phone</th>
                    <th class="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr v-if="loading" class="bg-white">
                    <td colspan="8" class="px-6 py-12 text-center text-gray-400 font-medium">
                      <div class="flex flex-col items-center gap-3">
                        <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        Loading staff data...
                      </div>
                    </td>
                  </tr>
                  <tr v-else-if="!paginatedStaff.length" class="bg-white">
                    <td colspan="8" class="px-6 py-12 text-center text-gray-500">
                      <div class="flex flex-col items-center gap-2">
                        <span class="text-3xl">🔍</span>
                        <p class="font-medium">No staff members found matching your criteria.</p>
                      </div>
                    </td>
                  </tr>
                  <tr 
                    v-for="s in paginatedStaff" 
                    :key="s.id" 
                    class="hover:bg-blue-50/30 transition-colors group"
                  >
                    <td class="px-6 py-5 whitespace-nowrap">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 flex items-center justify-center font-bold text-sm shadow-sm overflow-hidden">
                          <img v-if="s.photoUrl" :src="s.photoUrl" class="w-full h-full object-cover" :alt="formatName(s)" />
                          <span v-else>{{ getInitials(s) }}</span>
                        </div>
                        <div>
                          <p class="font-bold text-gray-900 leading-tight">{{ formatName(s) }}</p>
                          <p class="text-xs text-gray-500 mt-0.5">{{ formatAddress(s.address) }}</p>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-5 whitespace-nowrap text-gray-600 font-medium">{{ s.username || '-' }}</td>
                    <td class="px-6 py-5 whitespace-nowrap text-gray-600">{{ s.email || '-' }}</td>
                    <td class="px-6 py-5 whitespace-nowrap">
                      <div>
                        <span class="px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-[0.65rem] font-black uppercase tracking-tighter inline-block mb-1">
                          {{ s.role || 'Staff' }}
                        </span>
                        <p class="text-xs font-bold text-gray-700">{{ s.position || '-' }}</p>
                      </div>
                    </td>
                    <td class="px-6 py-5 whitespace-nowrap">
                      <span class="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-semibold">
                        {{ s.assignedOffice || '-' }}
                      </span>
                    </td>
                    <td class="px-6 py-5 whitespace-nowrap">
                      <span class="px-2 py-1 rounded-md bg-purple-50 text-purple-700 text-xs font-bold">
                        {{ s.gender || '-' }}
                      </span>
                    </td>
                    <td class="px-6 py-5 whitespace-nowrap text-gray-600 font-medium">
                      {{ calculateAge(s.dateOfBirth) }} yrs
                    </td>
                    <td class="px-6 py-5 whitespace-nowrap text-gray-600 font-medium">{{ s.phone || '-' }}</td>
                    <td class="px-6 py-5 whitespace-nowrap text-right">
                      <div class="flex items-center justify-end gap-2 pr-2">
                        <button 
                          @click="openViewEditModal(s, 'view')"
                          class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="View Details"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </button>
                        <button 
                          @click="openViewEditModal(s, 'edit')"
                          class="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                          title="Edit Staff"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button 
                          @click="confirmDeleteStaff(s)"
                          class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete Account"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Enhanced Pagination -->
            <div class="px-6 py-5 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100">
              <div class="text-xs text-gray-500 font-bold uppercase tracking-widest">
                Showing <span class="text-blue-600">{{ staffStartIndex }}</span> to <span class="text-blue-600">{{ staffEndIndex }}</span> of <span class="text-gray-900">{{ filteredStaff.length }}</span> staff members
              </div>
              
              <div class="flex items-center gap-6">
                <div class="flex items-center gap-3">
                  <span class="text-[0.7rem] font-black text-gray-400 uppercase tracking-tighter">Rows</span>
                  <select 
                    v-model.number="itemsPerPage" 
                    class="bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option :value="10">10</option>
                    <option :value="25">25</option>
                    <option :value="50">50</option>
                  </select>
                </div>

                <div class="flex items-center gap-1.5">
                  <button 
                    @click="currentPage--"
                    :disabled="currentPage === 1"
                    class="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-gray-600 transition-all active:scale-90"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <div class="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-black shadow-md shadow-blue-200">
                    {{ currentPage }} / {{ totalPages }}
                  </div>
                  <button 
                    @click="currentPage++"
                    :disabled="currentPage === totalPages"
                    class="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-gray-600 transition-all active:scale-90"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>

    <!-- Modals (Add/Edit) -->
    <transition enter-active-class="transition duration-300 ease-out" enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
      <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px]">
        <div class="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden border border-white/20">
          <div class="bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-6 text-white flex items-center justify-between">
            <h3 class="text-xl font-extrabold tracking-tight">{{ modalTitle }}</h3>
            <button @click="closeModal" class="p-2 hover:bg-white/20 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <form @submit.prevent="handleSave" class="p-8">
            <!-- Profile Photo Preview (if exists) -->
            <div v-if="form.photoUrl" class="flex justify-center mb-6">
              <div class="w-24 h-24 rounded-full border-4 border-blue-50 shadow-sm overflow-hidden bg-gray-100">
                <img :src="form.photoUrl" class="w-full h-full object-cover" alt="Staff Profile" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              <!-- Form Fields -->
              <div class="flex flex-col gap-1.5">
                <label class="text-[0.65rem] font-black uppercase tracking-widest text-gray-400 pl-1">Username</label>
                <input v-model="form.username" type="text" :disabled="isViewOnly" required class="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500" />
              </div>

              <div class="flex flex-col gap-1.5" v-if="modalMode === 'add'">
                <label class="text-[0.65rem] font-black uppercase tracking-widest text-gray-400 pl-1">Password</label>
                <input v-model="form.password" type="password" required class="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="text-[0.65rem] font-black uppercase tracking-widest text-gray-400 pl-1">First Name</label>
                <input v-model="form.firstName" type="text" :disabled="isViewOnly" required class="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500" />
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="text-[0.65rem] font-black uppercase tracking-widest text-gray-400 pl-1">Last Name</label>
                <input v-model="form.lastName" type="text" :disabled="isViewOnly" required class="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500" />
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="text-[0.65rem] font-black uppercase tracking-widest text-gray-400 pl-1">Email</label>
                <input v-model="form.email" type="email" :disabled="isViewOnly" required class="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500" />
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="text-[0.65rem] font-black uppercase tracking-widest text-gray-400 pl-1">Phone Number</label>
                <input v-model="form.phone" type="tel" :disabled="isViewOnly" class="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500" />
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="text-[0.65rem] font-black uppercase tracking-widest text-gray-400 pl-1">Position</label>
                <input v-model="form.position" type="text" :disabled="isViewOnly" class="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500" />
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="text-[0.65rem] font-black uppercase tracking-widest text-gray-400 pl-1">Assigned Office</label>
                <input v-model="form.assignedOffice" type="text" :disabled="isViewOnly" class="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500" />
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="text-[0.65rem] font-black uppercase tracking-widest text-gray-400 pl-1">Gender</label>
                <select v-model="form.gender" :disabled="isViewOnly" class="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="text-[0.65rem] font-black uppercase tracking-widest text-gray-400 pl-1">Date of Birth</label>
                <input v-model="form.dateOfBirth" type="date" :disabled="isViewOnly" class="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500" />
              </div>

              <div class="flex flex-col gap-1.5 md:col-span-2">
                <label class="text-[0.65rem] font-black uppercase tracking-widest text-gray-400 pl-1">Address</label>
                <textarea v-model="form.address" :disabled="isViewOnly" rows="2" class="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"></textarea>
              </div>
            </div>

            <div class="mt-8 flex justify-end gap-3">
              <button 
                type="button" 
                @click="closeModal" 
                class="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all active:scale-95"
              >
                {{ isViewOnly ? 'Close' : 'Cancel' }}
              </button>
              <button 
                v-if="!isViewOnly"
                type="submit" 
                class="px-8 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-black shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-70"
                :disabled="saving"
              >
                {{ saving ? 'Processing...' : 'Save Member' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useStaffAttendanceStore } from '../../stores/staffAttendanceStore'
import AdminSidebar from './AdminSidebar.vue'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default {
  name: 'AdminStaffAttendanceView',
  components: {
    AdminSidebar
  },
  data() {
    return {
      search: '',
      positionFilter: 'all',
      currentPage: 1,
      itemsPerPage: 10,
      showModal: false,
      modalMode: 'add',
      saving: false,
      form: {
        username: '',
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        position: '',
        assignedOffice: '',
        gender: 'Male',
        dateOfBirth: '',
        address: ''
      },
      selectedStaffId: null
    }
  },
  computed: {
    ...mapState(useStaffAttendanceStore, ['staffUsers', 'loading']),
    
    filteredStaff() {
      const term = this.search.trim().toLowerCase()
      let list = this.staffUsers

      if (this.positionFilter !== 'all') {
        list = list.filter(s => s.position === this.positionFilter)
      }

      if (!term) return list

      return list.filter(s => {
        const full = `${s.firstName} ${s.lastName}`.toLowerCase()
        return full.includes(term) || 
               (s.username || '').toLowerCase().includes(term) || 
               (s.email || '').toLowerCase().includes(term)
      })
    },

    totalPages() {
      return Math.ceil(this.filteredStaff.length / this.itemsPerPage) || 1
    },

    paginatedStaff() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      return this.filteredStaff.slice(start, start + this.itemsPerPage)
    },

    staffStartIndex() {
      return this.filteredStaff.length ? (this.currentPage - 1) * this.itemsPerPage + 1 : 0
    },

    staffEndIndex() {
      return Math.min(this.currentPage * this.itemsPerPage, this.filteredStaff.length)
    },


    uniquePositions() {
      return [...new Set(this.staffUsers.map(s => s.position).filter(Boolean))].sort()
    },

    modalTitle() {
      if (this.modalMode === 'add') return 'Add New Staff Member'
      if (this.modalMode === 'edit') return 'Edit Staff Member'
      return 'Staff Member Details'
    },

    isViewOnly() {
      return this.modalMode === 'view'
    }
  },
  methods: {
    ...mapActions(useStaffAttendanceStore, [
      'fetchStaffUsers', 
      'addStaffUser', 
      'updateStaffUser', 
      'deleteStaffUser'
    ]),

    formatName(s) {
      return `${s.firstName} ${s.lastName}`
    },

    formatAddress(address) {
      if (!address) return 'No address provided'
      
      let addr = address
      if (typeof address === 'string') {
        try {
          addr = JSON.parse(address)
        } catch (e) {
          return address
        }
      }

      if (typeof addr === 'object' && addr !== null) {
        const parts = [
          addr.streetAddress,
          addr.city,
          addr.province,
          addr.country
        ].filter(Boolean)
        return parts.length ? parts.join(', ') : 'No address provided'
      }

      return address
    },

    getInitials(s) {
      return `${s.firstName?.[0] || ''}${s.lastName?.[0] || ''}`.toUpperCase()
    },

    calculateAge(dob) {
      if (!dob) return 'N/A'
      const birthDate = new Date(dob)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const m = today.getMonth() - birthDate.getMonth()
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      return age
    },

    openAddModal() {
      this.modalMode = 'add'
      this.form = {
        username: '',
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        position: '',
        assignedOffice: '',
        gender: 'Male',
        dateOfBirth: '',
        address: ''
      }
      this.showModal = true
    },

    openViewEditModal(s, mode) {
      this.modalMode = mode
      this.selectedStaffId = s.id
      this.form = { ...s }
      this.showModal = true
    },

    closeModal() {
      this.showModal = false
      this.selectedStaffId = null
    },

    async handleSave() {
      this.saving = true
      try {
        if (this.modalMode === 'add') {
          await this.addStaffUser(this.form)
        } else {
          await this.updateStaffUser(this.selectedStaffId, this.form)
        }
        this.closeModal()
      } catch (err) {
        alert('Operation failed: ' + err.message)
      } finally {
        this.saving = false
      }
    },

    async confirmDeleteStaff(s) {
      if (confirm(`Are you sure you want to delete ${this.formatName(s)}? This action is permanent.`)) {
        await this.deleteStaffUser(s.id)
      }
    },

    exportToPDF() {
      const doc = new jsPDF('l', 'pt', 'a4')
      doc.setFontSize(20)
      doc.text('Staff Management Report', 40, 40)
      doc.setFontSize(10)
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 40, 60)

      autoTable(doc, {
        head: [['Full Name', 'Username', 'Email', 'Role', 'Position', 'Office', 'Gender', 'Age', 'Phone']],
        body: this.filteredStaff.map(s => [
          this.formatName(s),
          s.username || '-',
          s.email || '-',
          s.role || 'Staff',
          s.position || '-',
          s.assignedOffice || '-',
          s.gender || '-',
          this.calculateAge(s.dateOfBirth),
          s.phone || '-'
        ]),
        startY: 80,
        theme: 'grid',
        headStyles: { fillColor: [37, 99, 235], fontSize: 9 },
        styles: { fontSize: 8 }
      })
      doc.save('Staff_Report.pdf')
    },

    exportToWord() {
      let content = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset='utf-8'><title>Staff Report</title></head>
        <body>
          <h1>Staff Management Report</h1>
          <p>Generated: ${new Date().toLocaleString()}</p>
          <table border="1" cellspacing="0" cellpadding="5">
            <thead>
              <tr>
                <th>Full Name</th><th>Username</th><th>Email</th><th>Role</th><th>Position</th><th>Office</th><th>Phone</th>
              </tr>
            </thead>
            <tbody>
              ${this.filteredStaff.map(s => `
                <tr>
                  <td>${this.formatName(s)}</td>
                  <td>${s.username || '-'}</td>
                  <td>${s.email || '-'}</td>
                  <td>${s.role || 'Staff'}</td>
                  <td>${s.position || '-'}</td>
                  <td>${s.assignedOffice || '-'}</td>
                  <td>${s.gender || '-'}</td>
                  <td>${this.calculateAge(s.dateOfBirth)}</td>
                  <td>${s.phone || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
        </html>
      `
      const blob = new Blob(['\ufeff', content], { type: 'application/msword' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = 'Staff_Report.doc'
      link.click()
    }
  },
  created() {
    this.fetchStaffUsers()
  },
  watch: {
    search() { this.currentPage = 1 },
    positionFilter() { this.currentPage = 1 },
    itemsPerPage() { this.currentPage = 1 }
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
</style>
