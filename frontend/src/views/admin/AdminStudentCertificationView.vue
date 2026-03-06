<template>
  <div class="admin-shell">
    <AdminSidebar />

    <div class="admin-layout">
      <header class="admin-header">
        <h1>Student Certification</h1>
      </header>

      <main class="admin-main">
        <section class="section">
          <div class="section-header">
            <h2 class="section-title">Student Certification</h2>
            <p class="section-subtitle">
              List of student interns with their OJT hours and completion certificate actions.
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
                  <th>OJT Required Hours</th>
                  <th>OJT Remaining Hours</th>
                  <th>OJT Total Hours</th>
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
                  <td>{{ intern.ojtRequiredHours ?? '-' }}</td>
                  <td>{{ intern.ojtRemainingHoursLabel || intern.ojtRemainingHours || '-' }}</td>
                  <td>{{ intern.ojtTotalHoursLabel || intern.ojtTotalHours || '-' }}</td>
                  <td>
                    <div class="action-buttons">
                      <button
                        type="button"
                        class="action-button"
                        @click="generateCertificate(intern)"
                      >
                        Generate Completion Certificate
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <div v-else class="status-text">No student interns found.</div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script>
import AdminSidebar from './AdminSidebar.vue'
import jsPDF from 'jspdf'

export default {
  name: 'AdminStudentCertificationView',
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
  },
  methods: {
    async fetchInterns() {
      this.loading = true
      this.error = ''

      try {
        const res = await fetch('http://localhost:3001/admin/ojt-summary')
        const data = await res.json()

        if (!res.ok) {
          this.error = data.message || 'Failed to load student interns for certification.'
          this.interns = []
          return
        }

        this.interns = Array.isArray(data.interns) ? data.interns : []
      } catch (err) {
        console.error('Error fetching interns for certification:', err)
        this.error = 'Failed to load student interns for certification.'
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
    formatOrdinal(day) {
      const d = Number(day)
      if (!Number.isFinite(d)) return String(day)
      const mod10 = d % 10
      const mod100 = d % 100
      if (mod10 === 1 && mod100 !== 11) return `${d}st`
      if (mod10 === 2 && mod100 !== 12) return `${d}nd`
      if (mod10 === 3 && mod100 !== 13) return `${d}rd`
      return `${d}th`
    },
    generateCertificate(intern) {
      const doc = new jsPDF({ unit: 'pt', format: 'letter' })

      const internName = this.formatName(intern) || intern.username || 'Intern'

      const totalHoursLabel = intern.ojtTotalHoursLabel || intern.ojtTotalHours || ''
      const hoursText = totalHoursLabel ? String(totalHoursLabel) : '[Number of Hours]'

      const now = new Date()
      const day = this.formatOrdinal(now.getDate())
      const monthName = now.toLocaleString('en-US', { month: 'long' })
      const year = now.getFullYear()
      const issuedText = `${day} of ${monthName}, ${year}`

      const lines = [
        'Republic of the Philippines',
        'Department of Information and Communications Technology',
        'Oriental Mindoro Provincial Office',
        '',
        'CERTIFICATE OF COMPLETION',
        '',
        'This is to certify that',
        internName,
        'has successfully completed his/her On-the-Job Training (OJT) at the Department of Information and Communications Technology – Oriental Mindoro Provincial Office.',
        `He/She has rendered a total of ${hoursText} hours of service and has satisfactorily complied with all the requirements of the internship program.`,
        'Throughout the training period, he/she demonstrated dedication, professionalism, and competence in performing assigned tasks and responsibilities in support of the office\'s programs and initiatives.',
        `Issued this ${issuedText} at DICT Oriental Mindoro Provincial Office, Philippines.`,
        '',
        'ENGR. MARVIN D. BEJASA',
        'OIC - Provincial Officer',
        'Department of Information and Communications Technology',
        'Oriental Mindoro Provincial Office',
      ]

      const pageWidth = doc.internal.pageSize.getWidth()
      let y = 80

      doc.setFont('Times', 'Normal')
      doc.setFontSize(12)

      lines.forEach((line, index) => {
        let fontSize = 12
        let isTitle = false

        if (index === 4) {
          fontSize = 18
          isTitle = true
        } else if (index === 7) {
          fontSize = 14
        }

        doc.setFontSize(fontSize)

        const text = doc.splitTextToSize(line, pageWidth - 120)
        text.forEach((part) => {
          const textWidth = doc.getTextWidth(part)
          const x = (pageWidth - textWidth) / 2
          doc.text(part, x, y)
          y += isTitle ? 28 : 18
        })

        if (line === '') {
          y += 4
        }
      })

      const safeName = internName.replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '') || 'intern'
      const filename = `${safeName}_completion_certificate.pdf`
      doc.save(filename)
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

.action-buttons {
  display: flex;
  gap: 0.25rem;
}

.action-button {
  padding: 0.25rem 0.6rem;
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
