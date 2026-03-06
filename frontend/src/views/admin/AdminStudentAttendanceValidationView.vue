<template>
  <div class="admin-shell">
    <AdminSidebar />

    <div class="admin-layout">
      <header class="admin-header">
        <h1>Student Attendance Validation</h1>
      </header>

      <main class="admin-main">
        <section class="section">
          <div class="selection-panel">
            <div class="selection-panel-inner">
              <div v-if="!selectedInternId" class="selection-empty">
                <div class="selection-icon">▣</div>
                <h3 class="selection-title">Select an intern to review</h3>
                <p class="selection-subtitle">Click any intern below to view attendance details</p>
              </div>

              <div v-else>
                <div class="selection-header">
                  <div>
                    <h3 class="selection-title">Attendance for {{ selectedInternName }}</h3>
                    <p class="selection-subtitle">Review and validate student intern attendance.</p>
                  </div>

                  <div class="toolbar-row">
                    <div class="toolbar-left">
                      <div class="search-wrap">
                        <span class="search-icon">🔍</span>
                        <input
                          v-model="search"
                          type="text"
                          class="search-input"
                          placeholder="Search by intern name"
                        />
                      </div>
                    </div>
                    <div class="toolbar-right">
                      <button type="button" class="secondary-button" @click="toggleFilters">
                        <span class="btn-icon">⚙️</span> Filters
                      </button>
                      <button type="button" class="secondary-button" @click="exportAttendance">
                        <span class="btn-icon">📥</span> Export
                      </button>
                      <input
                        v-model="selectedDate"
                        type="date"
                        class="filter-select"
                        @change="handleDateChange"
                      />
                      <button type="button" class="secondary-button" @click="fetchRecords" :disabled="loading">
                        {{ loading ? 'Refreshing...' : 'Refresh' }}
                      </button>
                    </div>
                  </div>
                </div>

                <div v-if="loading" class="status-text">Loading attendance records...</div>
                <div v-else-if="error" class="status-text error">{{ error }}</div>
                <div v-else>
                  <div class="table-container" v-if="filteredRecords.length">
                    <table class="interns-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>AM In</th>
                          <th>AM Out</th>
                          <th>PM In</th>
                          <th>PM Out</th>
                          <th>Total Hours</th>
                          <th>Location Status</th>
                          <th>Attendance Status</th>
                          <th>Validation</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="row in paginatedRecords" :key="row.id">
                          <td>{{ row.date || '-' }}</td>
                          <td>{{ formatTime(row.timeInAM) }}</td>
                          <td>{{ formatTime(row.timeOutAM) }}</td>
                          <td>{{ formatTime(row.timeInPM) }}</td>
                          <td>{{ formatTime(row.timeOutPM) }}</td>
                          <td>{{ row.totalHoursLabel || '-' }}</td>
                          <td>
                            <div class="notes-cell">
                              <select v-model="row.locationSlot" class="notes-select" @change="updateDisplayedLocation(row)">
                                <option value="AM">AM</option>
                                <option value="PM">PM</option>
                              </select>
                              <div class="notes-text small-text">{{ row.displayedLocation || '-' }}</div>
                            </div>
                          </td>
                          <td>{{ row.attendanceStatus || '-' }}</td>
                          <td>
                            <span :class="['validation-badge', (row.validationStatus || 'Pending').toLowerCase()]">
                              {{ row.validationStatus || 'Pending' }}
                            </span>
                          </td>
                          <td>
                            <div class="action-buttons">
                              <button 
                                type="button" 
                                class="action-button" 
                                :disabled="!!savingRowIds[row.id]"
                                @click="approveRow(row)"
                              >
                                {{ savingRowIds[row.id] ? '...' : 'Approve' }}
                              </button>
                              <button 
                                type="button" 
                                class="action-button danger" 
                                :disabled="!!savingRowIds[row.id]"
                                @click="rejectRow(row)"
                              >
                                {{ savingRowIds[row.id] ? '...' : 'Reject' }}
                              </button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <!-- Pagination Controls -->
                  <div class="pagination-container" v-if="filteredRecords.length">
                    <div class="pagination-info">
                      Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredRecords.length) }} of {{ filteredRecords.length }} entries
                    </div>
                    <div class="pagination-controls">
                      <div class="rows-per-page">
                        <label>Rows per page:</label>
                        <select v-model="itemsPerPage" class="page-size-select" @change="currentPage = 1">
                          <option v-for="size in pageSizeOptions" :key="size" :value="size">{{ size }}</option>
                        </select>
                      </div>
                      <div class="page-buttons">
                        <button 
                          class="pagination-button" 
                          :disabled="currentPage === 1" 
                          @click="currentPage--"
                        >
                          Previous
                        </button>
                        <span class="page-indicator">Page {{ currentPage }} of {{ totalPages }}</span>
                        <button 
                          class="pagination-button" 
                          :disabled="currentPage === totalPages" 
                          @click="currentPage++"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>

                  <div v-else class="status-text">No attendance records found.</div>
                </div>
              </div>
            </div>
          </div>

          <div class="batches-panel">
            <div class="batches-header">
              <h3 class="batches-title">Available Interns</h3>
            </div>

            <div class="batches-grid">
              <button
                v-for="intern in filteredInternCards"
                :key="intern.id"
                type="button"
                class="batch-card"
                :class="{ 'is-selected': intern.id === selectedInternId }"
                @click="selectIntern(intern)"
              >
                <div class="batch-card-top">
                  <div class="batch-card-date">{{ intern.name || '-' }}</div>
                  <div class="batch-card-icon">▣</div>
                </div>
                <div class="batch-card-meta">
                  <div class="batch-meta-row">
                    <span class="batch-meta-dot"></span>
                    <span>Review attendance</span>
                  </div>
                </div>
              </button>
            </div>
          </div>

        </section>
      </main>
    </div>
  </div>
</template>

<script>
import AdminSidebar from './AdminSidebar.vue'
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore'
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

      // REMOVED: Date filter restriction to show all attendance for specific student
      /*
      const selectedDate = (this.selectedDate || '').trim()
      if (selectedDate) {
        list = list.filter((r) => (r.date || '') === selectedDate)
      }
      */

      const term = this.search.trim().toLowerCase()
      if (!term) return list
      return list.filter((r) => (r.internName || '').toLowerCase().includes(term))
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
    async persistValidation(row, status) {
      if (!row || !row.id) return

      const rowId = row.id
      if (this.savingRowIds[rowId]) return

      this.savingRowIds = { ...this.savingRowIds, [rowId]: true }
      try {
        const ref = doc(db, 'intern_attendance', rowId)
        await updateDoc(ref, {
          validationStatus: status,
          validationUpdatedAt: serverTimestamp(),
        })
        row.validationStatus = status
      } catch (e) {
        console.error('Failed to update validation status:', e)
        alert('Failed to save validation status. Please try again.')
      } finally {
        const copy = { ...this.savingRowIds }
        delete copy[rowId]
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
      if (row.validationStatus === 'Approved' || row.validationStatus === 'Rejected') return

      const isMatch = this.isAutoApproveLocationMatch(row.amLocationLabel) || this.isAutoApproveLocationMatch(row.pmLocationLabel)
      if (!isMatch) return

      await this.persistValidation(row, 'Approved')
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
            validationStatus: h.validationStatus || '',
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
          // No longer auto-approving here. Validation status is set during time-in.
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
    approveRow(row) {
      this.persistValidation(row, 'Approved')
    },
    rejectRow(row) {
      this.persistValidation(row, 'Rejected')
    },
    toggleFilters() {
      // Implement filter logic or modal here
      alert('Filter functionality triggered');
    },
    exportAttendance() {
      if (!this.filteredRecords.length) {
        alert('No records to export');
        return;
      }
      
      const headers = ['Intern Name', 'Date', 'AM In', 'AM Out', 'PM In', 'PM Out', 'Total Hours', 'Validation Status'];
      const rows = this.filteredRecords.map(r => [
        r.internName,
        r.date,
        this.formatTime(r.timeInAM),
        this.formatTime(r.timeOutAM),
        this.formatTime(r.timeInPM),
        this.formatTime(r.timeOutPM),
        r.totalHoursLabel,
        r.validationStatus || 'Pending'
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `attendance_${this.selectedInternName || 'export'}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  },
  created() {
    this.selectedDate = this.getTodayDateString()
    this.fetchRecords()
  },
}
</script>

<style scoped>
.admin-shell {
  min-height: 100vh;
  display: flex;
  background-color: #f5f5f5;
}

.admin-layout {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.admin-header {
  padding: 1.5rem 2rem;
  background-color: #1976d2;
  color: #ffffff;
}

.admin-main {
  flex: 1;
  padding: 1.5rem 2rem;
}

.section {
  background: #ffffff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.section-header {
  margin-bottom: 1rem;
}

.section-title {
  margin: 0;
  font-size: 1.25rem;
  color: #333;
}

.section-subtitle {
  margin: 0.25rem 0 0;
  font-size: 0.9rem;
  color: #666;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.selection-panel {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #ffffff;
  padding: 1.25rem;
  margin-bottom: 1.25rem;
}

.selection-panel-inner {
  min-height: 180px;
}

.selection-empty {
  min-height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  text-align: center;
}

.selection-icon {
  width: 56px;
  height: 56px;
  border-radius: 999px;
  background: #eef2ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: #1d4ed8;
  margin-bottom: 0.25rem;
}

.selection-header {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.toolbar-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  width: 100%;
  flex-wrap: wrap;
  border: 1px solid #e5e7eb;
  background: #f8fafc;
  border-radius: 14px;
  padding: 0.65rem;
}

.toolbar-left {
  flex: 1 1 420px;
  min-width: 260px;
}

.toolbar-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  flex: 0 0 auto;
  flex-wrap: nowrap;
}

.btn-icon {
  font-size: 1rem;
}

.search-wrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #ffffff;
  padding: 0.55rem 0.75rem;
}

.search-icon {
  font-size: 0.95rem;
  color: #94a3b8;
  line-height: 1;
}

.selection-title {
  margin: 0;
  font-size: 1.05rem;
  color: #111827;
}

.selection-subtitle {
  margin: 0.15rem 0 0;
  font-size: 0.9rem;
  color: #6b7280;
}

.selection-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
}

.batches-panel {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #ffffff;
  padding: 1.25rem;
}

.batches-header {
  margin-bottom: 0.75rem;
}

.batches-title {
  margin: 0;
  font-size: 1rem;
  color: #111827;
}

.batches-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 240px));
  justify-content: start;
  gap: 0.75rem;
}

.batch-card {
  text-align: left;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0.9rem;
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease, transform 0.1s ease;
}

.batch-card:hover {
  border-color: #bfdbfe;
  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.08);
  transform: translateY(-1px);
}

.batch-card.is-selected {
  border-color: #60a5fa;
  box-shadow: 0 10px 24px rgba(37, 99, 235, 0.12);
}

.batch-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.batch-card-date {
  font-weight: 700;
  color: #111827;
}

.batch-card-icon {
  width: 30px;
  height: 30px;
  border-radius: 999px;
  background: #eff6ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2563eb;
}

.batch-card-meta {
  color: #6b7280;
  font-size: 0.85rem;
}

.batch-meta-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.batch-meta-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #60a5fa;
}

.search-input {
  width: 100%;
  padding: 0;
  border-radius: 0;
  border: none;
  font-size: 0.95rem;
  background: #ffffff;
}

.search-input:focus {
  outline: none;
}

.filter-select {
  flex: 0 0 180px;
  padding: 0.55rem 0.75rem;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  font-size: 0.95rem;
  background-color: #fff;
}

.interns-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
  background: #ffffff;
}

.interns-table th,
.interns-table td {
  padding: 0.85rem 1rem;
  text-align: left;
  border-bottom: 1px solid #f1f5f9;
}

.interns-table thead th {
  background-color: #f8fafc;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.025em;
}

.interns-table tbody tr:hover {
  background-color: #f8fafc;
}

.table-container {
  overflow-x: auto;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #ffffff;
}

.validation-badge {
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.validation-badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.validation-badge.approved {
  background: #dcfce7;
  color: #166534;
}

.validation-badge.rejected {
  background: #fee2e2;
  color: #991b1b;
}

.notes-text.small-text {
  font-size: 0.75rem;
  color: #64748b;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.status-text {
  font-size: 0.95rem;
  color: #555;
}

.status-text.error {
  color: #c62828;
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8fafc;
  border-top: 1px solid #e5e7eb;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}

.pagination-info {
  font-size: 0.85rem;
  color: #64748b;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.rows-per-page {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #64748b;
}

.page-size-select {
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  background: #fff;
  font-size: 0.85rem;
  outline: none;
}

.page-buttons {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.pagination-button {
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #1e293b;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-button:hover:not(:disabled) {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-indicator {
  font-size: 0.85rem;
  color: #1e293b;
  font-weight: 500;
}

.primary-button,
.secondary-button {
  padding: 0.55rem 0.95rem;
  border-radius: 10px;
  border: 1px solid transparent;
  font-size: 0.9rem;
  cursor: pointer;
}

.secondary-button {
  background-color: #ffffff;
  color: #0f172a;
  border: 1px solid #e5e7eb;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  white-space: nowrap;
  transition: all 0.2s;
}

.secondary-button:hover {
  background-color: #f8fafc;
  border-color: #cbd5e1;
}

.secondary-button:disabled {
  opacity: 0.7;
  cursor: default;
}

.action-buttons {
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
}

.action-button {
  padding: 0.25rem 0.4rem;
  font-size: 0.8rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: #f5f5f5;
  cursor: pointer;
  white-space: nowrap;
}

.action-button:hover {
  background-color: #e0e0e0;
}

.action-button.danger {
  border-color: #ef9a9a;
  background-color: #ffebee;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #ffffff;
  border-radius: 8px;
  padding: 1.5rem;
  width: 100%;
  max-width: 720px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-title {
  margin: 0 0 1rem;
  font-size: 1.1rem;
  color: #333;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 0.5rem 1rem;
  margin-bottom: 1rem;
}

.detail-item {
  font-size: 0.9rem;
  color: #333;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

@media (max-width: 900px) {
  .admin-shell {
    flex-direction: column;
  }

  .selection-header {
    flex-direction: column;
  }

  .batches-grid {
    grid-template-columns: 1fr;
  }

  .attendance-grid {
    grid-template-columns: 1fr;
  }
}
</style>
