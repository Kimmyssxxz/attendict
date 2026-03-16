<template>
  <div class="min-h-screen flex flex-col md:flex-row bg-gray-100">
    <AdminSidebar />

    <div class="flex-1 flex flex-col">
      <header class="px-8 py-6 bg-blue-600 text-white">
        <h1 class="m-0 text-2xl font-bold">Student Attendance Validation</h1>
      </header>

      <main class="flex-1 px-8 py-6">
        <section class="bg-white rounded-lg p-6 shadow-sm">
          <div class="border border-gray-200 rounded-xl bg-white p-5 mb-5">
            <div class="mb-3">
              <h3 class="m-0 text-base text-gray-900">Available Interns</h3>
            </div>

            <div class="grid grid-cols-[repeat(auto-fill,minmax(240px,240px))] justify-start gap-3">
              <button
                v-for="intern in filteredInternCards"
                :key="intern.id"
                type="button"
                :class="[
                  'text-left bg-white border rounded-[10px] p-3.5 cursor-pointer transition-all',
                  intern.id === selectedInternId 
                    ? 'border-blue-400 shadow-[0_10px_24px_rgba(37,99,235,0.12)]' 
                    : 'border-gray-200 hover:border-blue-200 hover:shadow-[0_8px_22px_rgba(15,23,42,0.08)] hover:-translate-y-[1px]'
                ]"
                @click="selectIntern(intern)"
              >
                <div class="flex items-center justify-between gap-3 mb-2">
                  <div class="font-bold text-gray-900">{{ intern.name || '-' }}</div>
                  <div class="w-[30px] h-[30px] rounded-full bg-blue-50 flex items-center justify-center text-blue-600">▣</div>
                </div>
                <div class="text-gray-500 text-[0.85rem]">
                  <div class="flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-blue-400"></span>
                    <span>Review attendance</span>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div class="border border-gray-200 rounded-xl bg-white p-5">
            <div class="min-h-[180px]">
              <div v-if="!selectedInternId" class="min-h-[180px] flex flex-col items-center justify-center gap-1.5 text-center">
                <div class="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center text-xl text-blue-700 mb-1">▣</div>
                <h3 class="m-0 text-[1.05rem] text-gray-900">Select an intern to review</h3>
                <p class="mt-0.5 mb-0 text-[0.9rem] text-gray-500">Click any intern above to view attendance details</p>
              </div>

              <div v-else>
                <div class="flex flex-col items-start justify-start gap-2 mb-4 md:mb-4">
                  <div>
                    <h3 class="m-0 text-[1.05rem] text-gray-900">Attendance for {{ selectedInternName }}</h3>
                    <p class="mt-0.5 mb-0 text-[0.9rem] text-gray-500">Review and validate student intern attendance.</p>
                  </div>

                  <div class="flex items-center justify-between gap-3 w-full flex-wrap border border-gray-200 bg-slate-50 rounded-xl p-2.5">
                    <div class="flex-1 basis-[420px] min-w-[260px]">
                      <div class="flex items-center gap-2 w-full border border-gray-200 rounded-xl bg-white px-3 py-2">
                        <span class="text-[0.95rem] text-slate-400 leading-none">🔍</span>
                        <input
                          v-model="search"
                          type="text"
                          class="w-full p-0 border-none text-[0.95rem] bg-white focus:outline-none"
                          placeholder="Search by date (YYYY-MM-DD)"
                        />
                      </div>
                    </div>
                    <div class="flex items-center justify-end gap-2 flex-none flex-nowrap">
                      <div class="relative">
                        <button type="button" class="flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] text-[0.9rem] font-semibold cursor-pointer bg-white text-slate-900 border border-gray-200 whitespace-nowrap transition-all hover:bg-slate-50 hover:border-slate-300 disabled:opacity-70 disabled:cursor-default" @click="toggleFilters">
                          <span class="text-base">⚙️</span> Filters
                        </button>
                        
                        <!-- Filter Dropdown -->
                        <div v-if="showFilterMenu" class="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.1)] z-50 p-4">
                          <div class="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
                            <h4 class="m-0 text-sm font-bold text-gray-800">Filter Records</h4>
                            <button @click="showFilterMenu = false" class="text-gray-400 hover:text-gray-600 cursor-pointer">
                              <span class="text-xl leading-none">&times;</span>
                            </button>
                          </div>
                          
                          <div class="mb-4">
                            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Month</label>
                            <select v-model="filterMonth" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors mb-3" @change="currentPage = 1">
                              <option value="All">All Months</option>
                              <option value="01">January</option>
                              <option value="02">February</option>
                              <option value="03">March</option>
                              <option value="04">April</option>
                              <option value="05">May</option>
                              <option value="06">June</option>
                              <option value="07">July</option>
                              <option value="08">August</option>
                              <option value="09">September</option>
                              <option value="10">October</option>
                              <option value="11">November</option>
                              <option value="12">December</option>
                            </select>

                            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Validation Status</label>
                            <select v-model="filterValidationStatus" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors" @change="currentPage = 1">
                              <option value="All">All Statuses</option>
                              <option value="Pending">Pending</option>
                              <option value="Approved">Approved</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          </div>
                          
                          <div class="flex justify-between items-center mt-2">
                           <button class="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer" @click="resetFilters">Reset filters</button>
                           <button class="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 font-medium cursor-pointer transition-colors" @click="showFilterMenu = false">Done</button>
                          </div>
                        </div>
                      </div>

                      <button type="button" class="flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] text-[0.9rem] font-semibold cursor-pointer bg-white text-slate-900 border border-gray-200 whitespace-nowrap transition-all hover:bg-slate-50 hover:border-slate-300 disabled:opacity-70 disabled:cursor-default" @click="fetchRecords" :disabled="loading">
                        {{ loading ? 'Refreshing...' : 'Refresh' }}
                      </button>
                    </div>
                  </div>
                </div>

                <div v-if="loading" class="text-[0.95rem] text-gray-600">Loading attendance records...</div>
                <div v-else-if="error" class="text-[0.95rem] text-red-700">{{ error }}</div>
                <div v-else>
                  <div class="overflow-x-auto border border-gray-200 rounded-xl bg-white" v-if="filteredRecords.length">
                    <table class="w-full border-collapse text-[0.9rem] bg-white">
                      <thead>
                        <tr>
                          <th class="px-4 py-3 text-left border-b border-slate-100 bg-slate-50 text-slate-500 font-semibold uppercase text-xs tracking-wide">Date</th>
                          <th class="px-4 py-3 text-left border-b border-slate-100 bg-slate-50 text-slate-500 font-semibold uppercase text-xs tracking-wide">AM In</th>
                          <th class="px-4 py-3 text-left border-b border-slate-100 bg-slate-50 text-slate-500 font-semibold uppercase text-xs tracking-wide">AM Out</th>
                          <th class="px-4 py-3 text-left border-b border-slate-100 bg-slate-50 text-slate-500 font-semibold uppercase text-xs tracking-wide">PM In</th>
                          <th class="px-4 py-3 text-left border-b border-slate-100 bg-slate-50 text-slate-500 font-semibold uppercase text-xs tracking-wide">PM Out</th>
                          <th class="px-4 py-3 text-left border-b border-slate-100 bg-slate-50 text-slate-500 font-semibold uppercase text-xs tracking-wide">Total Hours</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="row in paginatedRecords" :key="row.id" class="hover:bg-slate-50 cursor-pointer transition-colors" @click="openDetailsModal(row)">
                          <td class="px-4 py-3 text-left border-b border-slate-100">{{ formatDate(row.date) }}</td>
                          <td class="px-4 py-3 text-left border-b border-slate-100">{{ formatTime(row.timeInAM) }}</td>
                          <td class="px-4 py-3 text-left border-b border-slate-100">{{ formatTime(row.timeOutAM) }}</td>
                          <td class="px-4 py-3 text-left border-b border-slate-100">{{ formatTime(row.timeInPM) }}</td>
                          <td class="px-4 py-3 text-left border-b border-slate-100">{{ formatTime(row.timeOutPM) }}</td>
                          <td class="px-4 py-3 text-left border-b border-slate-100">
                            <div class="flex items-center gap-2">
                              {{ row.totalHoursLabel || '-' }}
                              <div v-if="row.validationStatusAM === 'Pending' || row.validationStatusPM === 'Pending'" class="w-2 h-2 rounded-full bg-amber-400" title="Has pending validations"></div>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <!-- Pagination Controls -->
                  <div class="flex flex-col sm:flex-row justify-between items-center p-4 bg-slate-50 border-t border-gray-200 rounded-b-xl gap-4" v-if="filteredRecords.length">
                    <div class="text-[0.85rem] text-slate-500">
                      Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredRecords.length) }} of {{ filteredRecords.length }} entries
                    </div>
                    <div class="flex items-center gap-6">
                      <div class="flex items-center gap-2 text-[0.85rem] text-slate-500">
                        <label>Rows per page:</label>
                        <select v-model="itemsPerPage" class="px-2 py-1 rounded-md border border-gray-200 bg-white text-[0.85rem] outline-none" @change="currentPage = 1">
                          <option v-for="size in pageSizeOptions" :key="size" :value="size">{{ size }}</option>
                        </select>
                      </div>
                      <div class="flex items-center gap-3">
                        <button 
                          class="px-3 py-1.5 text-[0.85rem] rounded-md border border-gray-200 bg-white text-slate-800 cursor-pointer transition-all hover:bg-slate-100 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed" 
                          :disabled="currentPage === 1" 
                          @click="currentPage--"
                        >
                          Previous
                        </button>
                        <span class="text-[0.85rem] text-slate-800 font-medium">Page {{ currentPage }} of {{ totalPages }}</span>
                        <button 
                          class="px-3 py-1.5 text-[0.85rem] rounded-md border border-gray-200 bg-white text-slate-800 cursor-pointer transition-all hover:bg-slate-100 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed" 
                          :disabled="currentPage === totalPages" 
                          @click="currentPage++"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>

                  <div v-else class="text-[0.95rem] text-gray-600">No attendance records found.</div>
                </div>
              </div>
            </div>
          </div>

        </section>
      </main>
    </div>

    <!-- Reject Modal -->
    <div v-if="rejectReasonModalVisible" class="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 class="m-0 text-lg font-bold text-gray-900">Reject {{ rejectingSession }} Attendance</h3>
          <button type="button" class="text-gray-400 hover:text-gray-600 transition-colors" @click="closeRejectModal">
            <span class="text-xl leading-none">&times;</span>
          </button>
        </div>
        <div class="p-6 flex-1 overflow-y-auto">
          <div class="mb-4">
            <label class="block text-sm font-semibold text-gray-700 mb-2">Reason for Rejection</label>
            <select v-model="selectedRejectReason" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
              <option value="" disabled>Select a reason</option>
              <option value="Not in exact location">Not in exact location</option>
              <option value="Incorrect time logged">Incorrect time logged</option>
              <option value="Invalid proof of attendance">Invalid proof of attendance</option>
              <option value="Suspected spoofed location">Suspected spoofed location</option>
              <option value="Others">Others</option>
            </select>
          </div>
          <div v-if="selectedRejectReason === 'Others'" class="mb-2">
            <label class="block text-sm font-semibold text-gray-700 mb-2">Please specify</label>
            <textarea v-model="otherRejectReason" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="Enter reason here..."></textarea>
          </div>
        </div>
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
          <button type="button" class="px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors" @click="closeRejectModal">
            Cancel
          </button>
          <button type="button" class="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors" @click="submitReject">
            Reject
          </button>
        </div>
      </div>
    </div>

    <!-- Details Modal -->
    <div v-if="detailsModalVisible" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" @click.self="closeDetailsModal">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 class="m-0 text-lg font-bold text-gray-900">Attendance Details - {{ formatDate(selectedRecordDetails?.date) }}</h3>
          <button type="button" class="text-gray-400 hover:text-gray-600 transition-colors" @click="closeDetailsModal">
            <span class="text-xl leading-none">&times;</span>
          </button>
        </div>
        <div class="p-6 flex-1 overflow-y-auto" v-if="selectedRecordDetails">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <!-- AM Details -->
            <div class="border border-gray-200 rounded-lg p-4 bg-gray-50 flex flex-col h-full">
              <h4 class="font-bold text-md mb-4 text-gray-800 border-b pb-2">AM Session</h4>
              
              <div class="mb-3">
                <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Validation Status</span>
                <div class="mt-1">
                  <span v-if="selectedRecordDetails.timeInAM || selectedRecordDetails.timeOutAM" :class="[
                    'px-2.5 py-1 rounded-full text-xs font-semibold capitalize',
                    (selectedRecordDetails.validationStatusAM || 'Pending').toLowerCase() === 'pending' ? 'bg-amber-100 text-amber-800' :
                    (selectedRecordDetails.validationStatusAM || 'Pending').toLowerCase() === 'approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  ]">
                    {{ selectedRecordDetails.validationStatusAM || 'Pending' }}
                  </span>
                  <span v-else class="text-slate-400">-</span>
                </div>
              </div>

              <div class="mb-3">
                <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Location</span>
                <div class="mt-1 text-sm text-gray-900 border bg-white p-2 rounded">
                  {{ extractLocationLabel(selectedRecordDetails.locationAM) || 'No location data' }}
                </div>
              </div>

              <div class="mb-3 flex-1 flex flex-col justify-end">
                <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Actions</span>
                <div class="flex flex-wrap gap-2">
                  <div v-if="selectedRecordDetails.timeInAM || selectedRecordDetails.timeOutAM" class="flex flex-wrap gap-2 w-full">
                    <button 
                      type="button" 
                      class="flex-1 px-3 py-2 text-sm font-medium rounded border border-gray-300 bg-white shadow-sm cursor-pointer hover:bg-gray-50 disabled:opacity-50 transition-colors" 
                      :disabled="!!savingRowIds[selectedRecordDetails.id + '_AM']"
                      @click="approveRow(selectedRecordDetails, 'AM')"
                    >
                      {{ savingRowIds[selectedRecordDetails.id + '_AM'] ? 'Processing...' : 'Approve AM' }}
                    </button>
                    <button 
                      type="button" 
                      class="flex-1 px-3 py-2 text-sm font-medium rounded border border-red-300 text-red-700 bg-red-50 shadow-sm cursor-pointer hover:bg-red-100 disabled:opacity-50 transition-colors" 
                      :disabled="!!savingRowIds[selectedRecordDetails.id + '_AM']"
                      @click="openRejectModal(selectedRecordDetails, 'AM')"
                    >
                      {{ savingRowIds[selectedRecordDetails.id + '_AM'] ? 'Processing...' : 'Reject AM' }}
                    </button>
                  </div>
                  <span v-else class="text-slate-400 text-sm italic">No AM entry recorded</span>
                </div>
              </div>
            </div>

            <!-- PM Details -->
            <div class="border border-gray-200 rounded-lg p-4 bg-gray-50 flex flex-col h-full">
              <h4 class="font-bold text-md mb-4 text-gray-800 border-b pb-2">PM Session</h4>
              
              <div class="mb-3">
                <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Validation Status</span>
                <div class="mt-1">
                  <span v-if="selectedRecordDetails.timeInPM || selectedRecordDetails.timeOutPM" :class="[
                    'px-2.5 py-1 rounded-full text-xs font-semibold capitalize',
                    (selectedRecordDetails.validationStatusPM || 'Pending').toLowerCase() === 'pending' ? 'bg-amber-100 text-amber-800' :
                    (selectedRecordDetails.validationStatusPM || 'Pending').toLowerCase() === 'approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  ]">
                    {{ selectedRecordDetails.validationStatusPM || 'Pending' }}
                  </span>
                  <span v-else class="text-slate-400">-</span>
                </div>
              </div>

              <div class="mb-3">
                <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Location</span>
                <div class="mt-1 text-sm text-gray-900 border bg-white p-2 rounded">
                  {{ extractLocationLabel(selectedRecordDetails.locationPM) || 'No location data' }}
                </div>
              </div>

              <div class="mb-3 flex-1 flex flex-col justify-end">
                <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Actions</span>
                <div class="flex flex-wrap gap-2">
                  <div v-if="selectedRecordDetails.timeInPM || selectedRecordDetails.timeOutPM" class="flex flex-wrap gap-2 w-full">
                    <button 
                      type="button" 
                      class="flex-1 px-3 py-2 text-sm font-medium rounded border border-gray-300 bg-white shadow-sm cursor-pointer hover:bg-gray-50 disabled:opacity-50 transition-colors" 
                      :disabled="!!savingRowIds[selectedRecordDetails.id + '_PM']"
                      @click="approveRow(selectedRecordDetails, 'PM')"
                    >
                      {{ savingRowIds[selectedRecordDetails.id + '_PM'] ? 'Processing...' : 'Approve PM' }}
                    </button>
                    <button 
                      type="button" 
                      class="flex-1 px-3 py-2 text-sm font-medium rounded border border-red-300 text-red-700 bg-red-50 shadow-sm cursor-pointer hover:bg-red-100 disabled:opacity-50 transition-colors" 
                      :disabled="!!savingRowIds[selectedRecordDetails.id + '_PM']"
                      @click="openRejectModal(selectedRecordDetails, 'PM')"
                    >
                      {{ savingRowIds[selectedRecordDetails.id + '_PM'] ? 'Processing...' : 'Reject PM' }}
                    </button>
                  </div>
                  <span v-else class="text-slate-400 text-sm italic">No PM entry recorded</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end">
          <button type="button" class="px-6 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors cursor-pointer" @click="closeDetailsModal">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AdminSidebar from './AdminSidebar.vue'
import { doc, serverTimestamp, updateDoc, collection, addDoc } from 'firebase/firestore'
import { db } from '../../firebase'

const AUTO_APPROVE_LOCATION = 'M. Roxas Drive, Lalom, Santa Isabel, Calapan, Oriental Mindoro, Mimaropa, Philippines'

export default {
  name: 'AdminStudentAttendanceValidationView',
  components: {
    AdminSidebar,
  },
  data() {
    return {
      records: [],
      interns: [],
      loading: false,
      error: '',
      search: '',
      selectedDate: '',
      selectedInternId: '',
      internCardSearch: '',
      savingRowIds: {},
      currentPage: 1,
      itemsPerPage: 10,
      pageSizeOptions: [10, 15, 20, 25],
      rejectReasonModalVisible: false,
      rejectingRow: null,
      selectedRejectReason: '',
      otherRejectReason: '',
      detailsModalVisible: false,
      selectedRecordDetails: null,
      showFilterMenu: false,
      filterValidationStatus: 'All',
      filterMonth: 'All',
    }
  },
  computed: {
    selectedInternName() {
      const found = this.interns.find((i) => i.id === this.selectedInternId)
      return found ? found.name : ''
    },
    filteredRecords() {
      const selectedId = this.selectedInternId
      let list = this.records
      if (selectedId) {
        list = list.filter((r) => r.internId === selectedId)
      }

      const status = this.filterValidationStatus.toLowerCase()
      if (status !== 'all') {
        list = list.filter((r) => {
          const am = (r.validationStatusAM || 'pending').toLowerCase()
          const pm = (r.validationStatusPM || 'pending').toLowerCase()
          
          if (status === 'pending') {
            return (r.timeInAM && am === 'pending') || (r.timeInPM && pm === 'pending') || (!r.validationStatusAM && !r.validationStatusPM && (r.timeInAM || r.timeInPM))
          }
          if (status === 'approved') {
            return (r.timeInAM && am === 'approved') || (r.timeInPM && pm === 'approved')
          }
          if (status === 'rejected') {
            return (r.timeInAM && am === 'rejected') || (r.timeInPM && pm === 'rejected')
          }
          return true
        })
      }

      if (this.filterMonth !== 'All') {
        const month = this.filterMonth
        list = list.filter((r) => {
          if (!r.date) return false
          const parts = r.date.split('-')
          if (parts.length < 2) return false
          return parts[1] === month
        })
      }

      const term = this.search.trim().toLowerCase()
      if (!term) return list
      return list.filter((r) => (r.date || '').includes(term))
    },
    filteredInternCards() {
      const term = this.internCardSearch.trim().toLowerCase()
      if (!term) return this.interns
      return this.interns.filter((i) => (i.name || '').toLowerCase().includes(term))
    },
    totalPages() {
      return Math.ceil(this.filteredRecords.length / this.itemsPerPage)
    },
    paginatedRecords() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredRecords.slice(start, end)
    },
  },
  methods: {
    normalizeLocation(value) {
      if (!value) return ''
      return String(value).trim().replace(/\s+/g, ' ').toLowerCase()
    },
    isAutoApproveLocationMatch(locationLabel) {
      return this.normalizeLocation(locationLabel) === this.normalizeLocation(AUTO_APPROVE_LOCATION)
    },
    async persistValidation(row, session, status) {
      if (!row || !row.id || !session) return

      const rowId = row.id
      const saveKey = `${rowId}_${session}`

      if (this.savingRowIds[saveKey]) return

      this.savingRowIds = { ...this.savingRowIds, [saveKey]: true }
      try {
        const ref = doc(db, 'intern_attendance', rowId)
        
        const updates = { validationUpdatedAt: serverTimestamp() }
        if (session === 'AM') {
          updates.validationStatusAM = status
        } else if (session === 'PM') {
          updates.validationStatusPM = status
        }

        await updateDoc(ref, updates)

        if (session === 'AM') {
          row.validationStatusAM = status
        } else if (session === 'PM') {
          row.validationStatusPM = status
        }
      } catch (e) {
        console.error('Failed to update validation status:', e)
        alert('Failed to save validation status. Please try again.')
      } finally {
        const copy = { ...this.savingRowIds }
        delete copy[saveKey]
        this.savingRowIds = copy
      }
    },
    getTodayDateString() {
      const now = new Date()
      const yyyy = now.getFullYear()
      const mm = String(now.getMonth() + 1).padStart(2, '0')
      const dd = String(now.getDate()).padStart(2, '0')
      return `${yyyy}-${mm}-${dd}`
    },
    formatDate(dateStr) {
      if (!dateStr) return '-'
      try {
        const date = new Date(dateStr)
        if (isNaN(date.getTime())) return dateStr
        return new Intl.DateTimeFormat('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        }).format(date)
      } catch (e) {
        return dateStr
      }
    },
    formatName(user) {
      const first = user.firstName || ''
      const middle = user.middleName || ''
      const last = user.lastName || ''
      return [first, middle, last].filter(Boolean).join(' ')
    },
    formatTime(timeStr) {
      if (!timeStr) return '-'
      const parts = String(timeStr).split(':')
      if (parts.length < 2) return String(timeStr)
      let hour = parseInt(parts[0], 10)
      const minute = parts[1]
      if (Number.isNaN(hour)) return String(timeStr)
      const suffix = hour >= 12 ? 'PM' : 'AM'
      hour = hour % 12
      if (hour === 0) hour = 12
      return `${hour}:${minute} ${suffix}`
    },
    computeTotalHoursLabel(row) {
      const toMinutes = (t) => {
        if (!t) return null
        const parts = String(t).split(':').map((x) => parseInt(x, 10))
        if (parts.length < 2 || parts.some((n) => Number.isNaN(n))) return null
        const h = parts[0]
        const m = parts[1]
        const s = parts[2] || 0
        return h * 60 + m + Math.round(s / 60)
      }

      const amIn = toMinutes(row.timeInAM)
      const amOut = toMinutes(row.timeOutAM)
      const pmIn = toMinutes(row.timeInPM)
      const pmOut = toMinutes(row.timeOutPM)

      let total = 0
      if (amIn !== null && amOut !== null && amOut >= amIn) total += amOut - amIn
      if (pmIn !== null && pmOut !== null && pmOut >= pmIn) total += pmOut - pmIn

      if (!total) return ''
      const h = Math.floor(total / 60)
      const m = total % 60
      return `${h}h ${m}m`
    },
    computeAttendanceStatus(row) {
      const parts = []
      if (row.statusAM) parts.push(`AM: ${row.statusAM}`)
      if (row.statusPM) parts.push(`PM: ${row.statusPM}`)
      return parts.join(' | ')
    },
    extractLocationLabel(loc) {
      if (!loc) return ''
      if (typeof loc === 'string') return loc
      if (typeof loc.address === 'string' && loc.address.trim()) return loc.address.trim()
      const lat = typeof loc.latitude === 'number' ? loc.latitude : null
      const lng = typeof loc.longitude === 'number' ? loc.longitude : null
      if (lat !== null && lng !== null) return `${lat}, ${lng}`
      return ''
    },
    computeLocationStatus(row) {
      const amLabel = this.extractLocationLabel(row.locationAM)
      const pmLabel = this.extractLocationLabel(row.locationPM)

      const parts = []
      if (row.timeInAM || row.timeOutAM) {
        parts.push(`AM: ${amLabel || '-'}`)
      }
      if (row.timeInPM || row.timeOutPM) {
        parts.push(`PM: ${pmLabel || '-'}`)
      }

      if (parts.length) return parts.join(' | ')
      if (amLabel || pmLabel) return [amLabel, pmLabel].filter(Boolean).join(' | ')
      return '-'
    },
    updateDisplayedLocation(row) {
      if (!row) return
      const slot = row.locationSlot === 'PM' ? 'PM' : 'AM'
      row.displayedLocation = slot === 'PM' ? (row.pmLocationLabel || '') : (row.amLocationLabel || '')
    },
    async maybeAutoApproveRow(row) {
      if (!row || !row.id) return
      
      if (row.timeInAM || row.timeOutAM) {
        if (row.validationStatusAM !== 'Approved' && row.validationStatusAM !== 'Rejected') {
          if (this.isAutoApproveLocationMatch(row.amLocationLabel)) {
            await this.persistValidation(row, 'AM', 'Approved')
          }
        }
      }
      
      if (row.timeInPM || row.timeOutPM) {
        if (row.validationStatusPM !== 'Approved' && row.validationStatusPM !== 'Rejected') {
          if (this.isAutoApproveLocationMatch(row.pmLocationLabel)) {
            await this.persistValidation(row, 'PM', 'Approved')
          }
        }
      }
    },
    async fetchInternHistory(internId) {
      if (!internId) {
        this.records = []
        return
      }

      this.loading = true
      this.error = ''

      try {
        const res = await fetch(
          `http://localhost:3001/attendance/intern/history?internId=${encodeURIComponent(internId)}`
        )
        const data = await res.json()

        if (!res.ok) {
          this.records = []
          this.error = data.message || 'Failed to load attendance history.'
          return
        }

        const history = Array.isArray(data.data) ? data.data : []
        const intern = this.interns.find((i) => i.id === internId)
        const internName = intern ? intern.name : ''

        this.records = history.map((h) => {
          const row = {
            id: h.id || `${internId}_${h.date || ''}`,
            internId,
            internName,
            date: h.date || '',
            timeInAM: h.timeInAM || null,
            timeOutAM: h.timeOutAM || null,
            timeInPM: h.timeInPM || null,
            timeOutPM: h.timeOutPM || null,
            statusAM: h.statusAM || null,
            statusPM: h.statusPM || null,
            locationAM: h.locationAM || null,
            locationPM: h.locationPM || null,
            totalHoursLabel: '',
            locationStatus: '',
            amLocationLabel: '',
            pmLocationLabel: '',
            locationSlot: 'AM',
            displayedLocation: '',
            attendanceStatus: '',
            validationStatusAM: h.validationStatusAM || '',
            rejectReasonAM: h.rejectReasonAM || null,
            validationStatusPM: h.validationStatusPM || '',
            rejectReasonPM: h.rejectReasonPM || null,
          }

          row.totalHoursLabel = this.computeTotalHoursLabel(row)
          row.attendanceStatus = this.computeAttendanceStatus(row)
          row.amLocationLabel = this.extractLocationLabel(row.locationAM)
          row.pmLocationLabel = this.extractLocationLabel(row.locationPM)
          row.locationStatus = this.computeLocationStatus(row)
          this.updateDisplayedLocation(row)

          return row
        }).sort((a, b) => (b.date || '').localeCompare(a.date || '')) // Show latest first

        for (const row of this.records) {
          await this.maybeAutoApproveRow(row)
        }
      } catch (err) {
        console.error('Error fetching intern attendance history:', err)
        this.error = 'Failed to load attendance history.'
        this.records = []
      } finally {
        this.loading = false
      }
    },
    async fetchRecords() {
      this.loading = true
      this.error = ''

      try {
        // Use an empty query to fetch all interns/history or handle based on selected intern
        const qs = '' 
        const res = await fetch(`http://localhost:3001/admin/attendance/today-interns${qs}`)
        const data = await res.json()

        if (!res.ok) {
          this.records = []
          this.error = data.message || 'Failed to load attendance records.'
          return
        }

        const interns = Array.isArray(data.interns) ? data.interns : []

        this.interns = interns
          .map((i) => ({
            id: i.id,
            name: this.formatName(i) || i.username || '',
          }))
          .sort((a, b) => (a.name || '').localeCompare(b.name || ''))

        if (this.selectedInternId) {
          await this.fetchInternHistory(this.selectedInternId)
        }
      } catch (err) {
        console.error('Error fetching attendance validation records:', err)
        this.error = 'Failed to load interns.'
        this.interns = []
      } finally {
        this.loading = false
      }
    },
    handleDateChange() {
      if (this.loading) return
      this.search = ''
      this.currentPage = 1
    },
    selectIntern(intern) {
      if (!intern?.id || this.loading) return
      this.selectedInternId = intern.id
      this.search = ''
      this.currentPage = 1
      this.fetchInternHistory(intern.id)
    },
    openDetailsModal(row) {
      if (!row) return;
      this.selectedRecordDetails = row;
      this.detailsModalVisible = true;
    },
    closeDetailsModal() {
      this.detailsModalVisible = false;
      this.selectedRecordDetails = null;
    },
    approveRow(row, session) {
      this.persistValidation(row, session, 'Approved')
    },
    openRejectModal(row, session) {
      this.rejectingRow = row;
      this.rejectingSession = session;
      this.selectedRejectReason = '';
      this.otherRejectReason = '';
      this.rejectReasonModalVisible = true;
    },
    closeRejectModal() {
      this.rejectReasonModalVisible = false;
      this.rejectingRow = null;
      this.rejectingSession = null;
    },
    async submitReject() {
      if (!this.rejectingRow) return;
      const reason = this.selectedRejectReason === 'Others' ? this.otherRejectReason : this.selectedRejectReason;
      if (!reason) {
        alert('Please provide a reason for rejection.');
        return;
      }

      const row = this.rejectingRow;
      const rowId = row.id;
      const session = this.rejectingSession;
      const saveKey = `${rowId}_${session}`;
      if (this.savingRowIds[saveKey]) return;

      this.savingRowIds = { ...this.savingRowIds, [saveKey]: true };
      try {
        const ref = doc(db, 'intern_attendance', rowId);
        
        const updates = { validationUpdatedAt: serverTimestamp() };
        if (session === 'AM') {
          updates.validationStatusAM = 'Rejected';
          updates.rejectReasonAM = reason;
        } else if (session === 'PM') {
          updates.validationStatusPM = 'Rejected';
          updates.rejectReasonPM = reason;
        }

        await updateDoc(ref, updates);
        
        if (session === 'AM') {
          row.validationStatusAM = 'Rejected';
          row.rejectReasonAM = reason;
        } else if (session === 'PM') {
          row.validationStatusPM = 'Rejected';
          row.rejectReasonPM = reason;
        }

        // Add a notification for the intern
        const d = new Date(row.date || new Date());
        const fDate = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(d);

        const notifPayload = {
          userId: row.internId,
          role: 'student',
          title: `Attendance Rejected (${session})`,
          message: `Your ${session} attendance record on ${fDate} was rejected. Reason: ${reason}`,
          type: 'attendance_rejected',
          metadata: {
            date: row.date,
            session,
            attendanceDocId: rowId,
            rejectReason: reason,
          },
          isRead: false,
          createdAt: serverTimestamp(),
        };
        await addDoc(collection(db, 'notifications'), notifPayload);

      } catch (e) {
        console.error('Failed to update validation status:', e);
        alert('Failed to save validation status. Please try again.');
      } finally {
        const copy = { ...this.savingRowIds };
        delete copy[saveKey];
        this.savingRowIds = copy;
        this.closeRejectModal();
      }
    },
    toggleFilters() {
      this.showFilterMenu = !this.showFilterMenu;
    },
    resetFilters() {
      this.filterValidationStatus = 'All';
      this.filterMonth = 'All';
      this.currentPage = 1;
    },

  },
  created() {
    this.selectedDate = this.getTodayDateString()
    this.fetchRecords()
  },
}
</script>

