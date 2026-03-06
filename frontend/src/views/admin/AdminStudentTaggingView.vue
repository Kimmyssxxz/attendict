<template>
  <div class="admin-shell">
    <AdminSidebar />

    <div class="admin-layout">
      <header class="admin-header">
        <h1>Student Tagging</h1>
      </header>

      <main class="admin-main">
        <section class="section">
          <div class="section-header">
            <h2 class="section-title">Student Tagging</h2>
            <p class="section-subtitle">
              Configure and review tagging for student interns (AM/PM, normal hours, overtime, etc.).
            </p>
          </div>

          <div class="toolbar">
            <input
              v-model="search"
              type="text"
              class="search-input"
              placeholder="Search by name, username, or email"
            />
            <select v-model="roleFilter" class="filter-select">
              <option value="all">All</option>
              <option value="student-intern">Student Interns Only</option>
            </select>
          </div>

          <div v-if="loading" class="status-text">Loading interns...</div>
          <div v-else-if="error" class="status-text error">{{ error }}</div>
          <div v-else>
            <table class="interns-table" v-if="filteredInterns.length">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Full Name</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Position</th>
                  <th>Tagging</th>
                  <th>Today AM Tag</th>
                  <th>Today PM Tag</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(intern, index) in filteredInterns" :key="intern.id">
                  <td>{{ index + 1 }}</td>
                  <td>{{ formatName(intern) }}</td>
                  <td>{{ intern.username || '-' }}</td>
                  <td>{{ intern.email || '-' }}</td>
                  <td>{{ intern.role || '-' }}</td>
                  <td>{{ intern.position || '-' }}</td>
                  <td>{{ intern.tagging || '-' }}</td>
                  <td>{{ intern.todayAmTag || '-' }}</td>
                  <td>{{ intern.todayPmTag || '-' }}</td>
                  <td>
                    <div class="action-buttons">
                      <button
                        type="button"
                        class="action-button"
                        @click="openTagModal(intern)"
                        title="Edit Tagging"
                      >
                        ✏️ Tagging
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <div v-else class="status-text">No student interns found.</div>
          </div>

          <!-- Edit Tagging Modal -->
          <div v-if="showTagModal" class="modal-backdrop">
            <div class="modal">
              <h3 class="modal-title">Edit Student Tagging</h3>

              <form @submit.prevent="handleSaveTagging" class="modal-form">
                <div class="modal-grid">
                  <div class="form-group">
                    <label>Student</label>
                    <input :value="selectedInternName" type="text" disabled />
                  </div>

                  <div class="form-group">
                    <label>Tagging (day-level default)</label>
                    <select v-model="tagging">
                      <option value="Normal Hours">Normal Hours</option>
                      <option value="Overtime">Overtime</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label>Today AM Tag (attendance)</label>
                    <select v-model="todayTagAM">
                      <option value="Normal Hours">Normal Hours</option>
                      <option value="Overtime">Overtime</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label>Today PM Tag (attendance)</label>
                    <select v-model="todayTagPM">
                      <option value="Normal Hours">Normal Hours</option>
                      <option value="Overtime">Overtime</option>
                    </select>
                  </div>
                </div>

                <div class="modal-actions">
                  <button type="button" class="secondary-button" @click="closeTagModal" :disabled="savingTag">
                    Cancel
                  </button>
                  <button type="submit" class="primary-button" :disabled="savingTag">
                    {{ savingTag ? 'Saving...' : 'Save Tagging' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script>
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import AdminSidebar from './AdminSidebar.vue'

export default {
  name: 'AdminStudentTaggingView',
  components: {
    AdminSidebar,
  },
  data() {
    return {
      interns: [],
      loading: false,
      error: '',
      search: '',
      roleFilter: 'student-intern',
      showTagModal: false,
      savingTag: false,
      selectedIntern: null,
      tagging: 'Normal Hours',
      todayTagAM: 'Normal Hours',
      todayTagPM: 'Normal Hours',
    }
  },
  computed: {
    filteredInterns() {
      const term = this.search.trim().toLowerCase()

      let list = this.interns

      if (this.roleFilter === 'student-intern') {
        list = list.filter((i) => {
          const roleIsStudent = (i.role || '').toLowerCase() === 'student'
          const positionIsIntern = (i.position || '').toLowerCase() === 'intern'
          return roleIsStudent && positionIsIntern
        })
      }

      if (!term) return list

      return list.filter((i) => {
        const fullName = this.formatName(i).toLowerCase()
        const username = (i.username || '').toLowerCase()
        const email = (i.email || '').toLowerCase()
        return (
          fullName.includes(term) ||
          username.includes(term) ||
          email.includes(term)
        )
      })
    },
    selectedInternName() {
      if (!this.selectedIntern) return ''
      return this.formatName(this.selectedIntern)
    },
  },
  methods: {
    getLocalDateString() {
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    async fetchInterns() {
      this.loading = true
      this.error = ''

      try {
        const res = await fetch('http://localhost:3001/admin/attendance/today-interns')
        const data = await res.json()

        if (!res.ok) {
          console.error('Backend error fetching today intern attendance:', data)
          this.error = data.message || 'Failed to load student interns for tagging.'
          this.interns = []
          return
        }

        this.interns = Array.isArray(data.interns) ? data.interns : []
      } catch (err) {
        console.error('Error fetching interns for tagging:', err)
        this.error = 'Failed to load student interns for tagging.'
      } finally {
        this.loading = false
      }
    },
    formatName(user) {
      const first = user.firstName || ''
      const middle = user.middleName || ''
      const last = user.lastName || ''
      return [first, middle, last].filter(Boolean).join(' ')
    },
    formatTime(timeStr) {
      if (!timeStr) return '--:-- --'
      const parts = timeStr.split(':')
      if (parts.length < 2) return timeStr
      let hour = parseInt(parts[0], 10)
      const minute = parts[1]
      if (Number.isNaN(hour)) return timeStr
      const suffix = hour >= 12 ? 'PM' : 'AM'
      hour = hour % 12
      if (hour === 0) hour = 12
      return `${hour}:${minute} ${suffix}`
    },
    openTagModal(intern) {
      this.selectedIntern = { ...intern }

      if (!this.selectedIntern.tagging) {
        this.selectedIntern.tagging = 'Normal Hours'
      }

      this.tagging = this.selectedIntern.tagging || 'Normal Hours'
      this.todayTagAM = intern.todayAmTag || 'Normal Hours'
      this.todayTagPM = intern.todayPmTag || 'Normal Hours'
      this.showTagModal = true
    },
    closeTagModal() {
      if (this.savingTag) return
      this.showTagModal = false
      this.selectedIntern = null
    },
    async handleSaveTagging() {
      if (!this.selectedIntern?.id) {
        this.closeTagModal()
        return
      }

      this.savingTag = true

      try {
        const internId = this.selectedIntern.id
        const internRef = doc(db, 'users', internId)

        const payload = {
          tagging: this.tagging || 'Normal Hours',
          // Store today's AM/PM attendance tag snapshot on the user for display
          todayAmTag: this.todayTagAM || 'Normal Hours',
          todayPmTag: this.todayTagPM || 'Normal Hours',
          taggingLastResetDate: this.getLocalDateString(),
        }

        await updateDoc(internRef, payload)

        // Also ask backend to sync today's attendance tagging for this intern (day-level default)
        try {
          await fetch('http://localhost:3001/admin/attendance/update-tagging', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              internId,
              tagging: this.tagging || 'Normal Hours',
            }),
          })

          // Optionally retag today's AM/PM sessions individually
          const baseOptions = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          }

          const amTag = this.todayTagAM
          if (amTag) {
            await fetch('http://localhost:3001/admin/attendance/retag-session', {
              ...baseOptions,
              body: JSON.stringify({
                internId,
                session: 'AM',
                tag: amTag,
              }),
            })
          }

          const pmTag = this.todayTagPM
          if (pmTag) {
            await fetch('http://localhost:3001/admin/attendance/retag-session', {
              ...baseOptions,
              body: JSON.stringify({
                internId,
                session: 'PM',
                tag: pmTag,
              }),
            })
          }
        } catch (syncErr) {
          console.error('Failed to sync today attendance tagging:', syncErr)
        }

        this.showTagModal = false
        this.selectedIntern = null

        // Refresh list so Tagging / AM Tag / PM Tag columns show latest values from Firestore
        await this.fetchInterns()
      } catch (err) {
        console.error('Error saving tagging:', err)
        alert('Failed to save tagging for intern.')
      } finally {
        this.savingTag = false
      }
    },
  },
  created() {
    this.fetchInterns()
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

.search-input {
  flex: 1 1 240px;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 0.95rem;
}

.filter-select {
  flex: 0 0 200px;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 0.95rem;
}

.interns-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.interns-table th,
.interns-table td {
  border: 1px solid #e0e0e0;
  padding: 0.5rem 0.75rem;
  text-align: left;
}

.interns-table thead {
  background-color: #f0f0f0;
}

.status-text {
  font-size: 0.95rem;
  color: #555;
}

.status-text.error {
  color: #c62828;
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
  max-width: 640px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-title {
  margin: 0 0 1rem;
  font-size: 1.1rem;
  color: #333;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.modal-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.75rem 1rem;
}

.modal .form-group label {
  display: block;
  margin-bottom: 0.35rem;
  font-size: 0.85rem;
  color: #555;
}

.modal .form-group input {
  width: 100%;
  padding: 0.45rem 0.6rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 0.9rem;
}

.modal .form-group select {
  width: 100%;
  padding: 0.45rem 0.6rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 0.9rem;
  background-color: #fff;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.primary-button,
.secondary-button {
  padding: 0.5rem 0.9rem;
  border-radius: 4px;
  border: none;
  font-size: 0.9rem;
  cursor: pointer;
}

.primary-button {
  background-color: #1976d2;
  color: #ffffff;
}

.primary-button:disabled {
  opacity: 0.7;
  cursor: default;
}

.secondary-button {
  background-color: #e0e0e0;
  color: #333;
}

.action-buttons {
  display: flex;
  gap: 0.25rem;
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

@media (max-width: 900px) {
  .admin-shell {
    flex-direction: column;
  }
}
</style>
