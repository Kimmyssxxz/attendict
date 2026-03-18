<template>
  <div class="min-h-screen flex flex-col md:flex-row bg-gray-100">
    <AdminSidebar />

    <div class="flex-1 flex flex-col">
      <header class="px-8 py-6 bg-blue-600 text-white">
        <h1 class="m-0 text-2xl font-bold">Student Certification</h1>
      </header>

      <main class="flex-1 px-8 py-6">
        <section class="bg-white rounded-lg p-6 shadow-sm">
          <div class="mb-4">
            <h2 class="m-0 text-xl text-gray-800">Student Certification</h2>
            <p class="mt-1 mb-0 text-sm text-gray-600">
              List of student interns with their OJT hours and completion certificate actions.
            </p>
          </div>

          <div class="flex flex-wrap gap-3 mb-4">
            <input
              v-model="search"
              type="text"
              class="flex-1 basis-[240px] px-3 py-2 rounded-md border border-gray-300 text-[0.95rem] focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
              placeholder="Search by name, username, or email"
            />
            <select v-model="roleFilter" class="flex-none basis-[200px] px-3 py-2 rounded-md border border-gray-300 text-[0.95rem] focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400">
              <option value="all">All</option>
              <option value="student-intern">Student Interns Only</option>
            </select>
          </div>

          <div v-if="loading" class="text-[0.95rem] text-gray-600">Loading interns...</div>
          <div v-else-if="error" class="text-[0.95rem] text-red-700">{{ error }}</div>
          <div v-else>
            <table class="w-full border-collapse text-sm" v-if="filteredInterns.length">
              <thead class="bg-gray-100">
                <tr>
                  <th class="border border-gray-300 px-3 py-2 text-left">#</th>
                  <th class="border border-gray-300 px-3 py-2 text-left">Full Name</th>
                  <th class="border border-gray-300 px-3 py-2 text-left">Username</th>
                  <th class="border border-gray-300 px-3 py-2 text-left">Email</th>
                  <th class="border border-gray-300 px-3 py-2 text-left">Role</th>
                  <th class="border border-gray-300 px-3 py-2 text-left">Position</th>
                  <th class="border border-gray-300 px-3 py-2 text-left">OJT Required Hours</th>
                  <th class="border border-gray-300 px-3 py-2 text-left">OJT Remaining Hours</th>
                  <th class="border border-gray-300 px-3 py-2 text-left">OJT Total Hours</th>
                  <th class="border border-gray-300 px-3 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(intern, index) in filteredInterns" :key="intern.id">
                  <td class="border border-gray-300 px-3 py-2">{{ index + 1 }}</td>
                  <td class="border border-gray-300 px-3 py-2">{{ formatName(intern) }}</td>
                  <td class="border border-gray-300 px-3 py-2">{{ intern.username || '-' }}</td>
                  <td class="border border-gray-300 px-3 py-2">{{ intern.email || '-' }}</td>
                  <td class="border border-gray-300 px-3 py-2">{{ intern.role || '-' }}</td>
                  <td class="border border-gray-300 px-3 py-2">{{ intern.position || '-' }}</td>
                  <td class="border border-gray-300 px-3 py-2">{{ intern.ojtRequiredHours ?? '-' }}</td>
                  <td class="border border-gray-300 px-3 py-2">{{ intern.ojtRemainingHoursLabel || intern.ojtRemainingHours || '-' }}</td>
                  <td class="border border-gray-300 px-3 py-2">{{ intern.ojtTotalHoursLabel || intern.ojtTotalHours || '-' }}</td>
                  <td class="border border-gray-300 px-3 py-2">
                    <div class="flex gap-1">
                      <button
                        type="button"
                        class="px-2.5 py-1 text-xs rounded border border-gray-300 bg-gray-50 cursor-pointer whitespace-nowrap transition-colors hover:bg-gray-200"
                        @click="generateCertificate(intern)"
                      >
                        Generate Completion Certificate
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <div v-else class="text-[0.95rem] text-gray-600">No student interns found.</div>
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
    loadImage(url) {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = (e) => reject(e)
        img.src = url
      })
    },
    async generateCertificate(intern) {
      const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'letter' })
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()

      // Professional Elegant Borders
      // Outer Navy Blue Border
      doc.setDrawColor(15, 30, 84) // Navy Blue
      doc.setLineWidth(8)
      doc.rect(20, 20, pageWidth - 40, pageHeight - 40)

      // Inner Gold Border
      doc.setDrawColor(212, 175, 55) // Gold
      doc.setLineWidth(2)
      doc.rect(32, 32, pageWidth - 64, pageHeight - 64)

      // Inner Thin Navy Blue Border
      doc.setDrawColor(15, 30, 84)
      doc.setLineWidth(1)
      doc.rect(36, 36, pageWidth - 72, pageHeight - 72)

      // Background accent (very light gray/yellow in the center)
      doc.setFillColor(252, 252, 250)
      doc.rect(37, 37, pageWidth - 74, pageHeight - 74, 'F')

      // Load logos
      try {
        const logo1 = await this.loadImage('/dictlogo2.png')
        const logo2 = await this.loadImage('/Bagongpilipinas.png')
        
        // DICT Logo (Left) - Moved closer to edge
        doc.addImage(logo1, 'PNG', 50, 55, 65, 65)
        // Bagong Pilipinas Logo (Right) - Moved closer to edge
        doc.addImage(logo2, 'PNG', pageWidth - 115, 55, 65, 65)
      } catch (err) {
        console.error('Could not load logos for certificate', err)
      }

      const internName = this.formatName(intern) || intern.username || 'Intern'
      const requiredHours = intern.ojtRequiredHours || ''
      const hoursText = requiredHours ? String(requiredHours) : '[Number of Hours]'

      const now = new Date()
      const day = this.formatOrdinal(now.getDate())
      const monthName = now.toLocaleString('en-US', { month: 'long' })
      const year = now.getFullYear()
      const issuedText = `${day} of ${monthName}, ${year}`

      const centerText = (text, y, size, font = 'Times', style = 'normal', color = [0, 0, 0]) => {
        doc.setFont(font, style)
        doc.setFontSize(size)
        doc.setTextColor(color[0], color[1], color[2])
        const textWidth = doc.getTextWidth(text)
        const x = (pageWidth - textWidth) / 2
        doc.text(text, x, y)
      }

      const centerParagraph = (text, startY, size, lineHeight = 18) => {
        doc.setFont('Times', 'normal')
        doc.setFontSize(size)
        doc.setTextColor(0, 0, 0)
        let y = startY
        const lines = doc.splitTextToSize(text, pageWidth - 160)
        lines.forEach(l => {
          const w = doc.getTextWidth(l)
          doc.text(l, (pageWidth - w) / 2, y)
          y += lineHeight
        })
        return y
      }

      let currentY = 70
      centerText('Republic of the Philippines', currentY, 11)
      currentY += 15
      centerText('Department of Information and Communications Technology', currentY, 13, 'Times', 'bold')
      currentY += 14
      centerText('Oriental Mindoro Provincial Office', currentY, 11, 'Times', 'italic')

      currentY += 50
      centerText('CERTIFICATE OF COMPLETION', currentY, 34, 'Times', 'bold', [15, 30, 84]) // Navy Blue Title
      
      currentY += 35
      centerText('This is to certify that', currentY, 16, 'Times', 'italic')
      
      currentY += 40
      centerText(internName.toUpperCase(), currentY, 28, 'Times', 'bold')
      
      const nameWidth = doc.getTextWidth(internName.toUpperCase())
      const nameX = (pageWidth - nameWidth) / 2
      doc.setDrawColor(0, 0, 0)
      doc.setLineWidth(1)
      doc.line(nameX - 25, currentY + 8, nameX + nameWidth + 25, currentY + 8)

      currentY += 40
      
      const p1 = `Has successfully completed his/her On-the-Job Training (OJT) at the Department of Information and Communications Technology – Oriental Mindoro Provincial Office.`
      currentY = centerParagraph(p1, currentY, 14, 20)
      
      currentY += 10
      const p2 = `He/She has rendered a total of ${hoursText} hours of service and has satisfactorily complied with all the requirements of the internship program.`
      currentY = centerParagraph(p2, currentY, 14, 20)
      
      currentY += 10
      const p3 = `Throughout the training period, he/she demonstrated dedication, professionalism, and competence in performing assigned tasks and responsibilities in support of the office's programs and initiatives.`
      currentY = centerParagraph(p3, currentY, 14, 20)
      
      currentY += 30
      centerText(`Issued this ${issuedText} at DICT Oriental Mindoro Provincial Office, Philippines.`, currentY, 12, 'Times', 'italic', [40, 40, 40])

      currentY += 40
      const sigX = pageWidth - 300
      doc.setFont('Times', 'bold')
      doc.setFontSize(14)
      const sigName = 'ENGR. MARVIN D. BEJASA'
      const sigWidth = doc.getTextWidth(sigName)
      doc.text(sigName, sigX + (200 - sigWidth)/2, currentY) // Center within right block
      
      doc.setDrawColor(0, 0, 0)
      doc.setLineWidth(1)
      doc.line(sigX, currentY + 4, sigX + 200, currentY + 4)

      currentY += 18
      doc.setFont('Times', 'normal')
      doc.setFontSize(12)
      const pos1 = 'OIC - Provincial Officer'
      const pos1Width = doc.getTextWidth(pos1)
      doc.text(pos1, sigX + (200 - pos1Width)/2, currentY)
      
      currentY += 16
      const pos2 = 'Department of Information and Communications Technology'
      doc.setFontSize(10)
      const pos2Width = doc.getTextWidth(pos2)
      doc.text(pos2, sigX + (200 - pos2Width)/2, currentY)
      
      currentY += 14
      const pos3 = 'Oriental Mindoro Provincial Office'
      const pos3Width = doc.getTextWidth(pos3)
      doc.text(pos3, sigX + (200 - pos3Width)/2, currentY)

      // Subtle seal/accent in the bottom left - Adjusted position to avoid border
      doc.setDrawColor(212, 175, 55)
      doc.setFillColor(212, 175, 55)
      doc.circle(80, pageHeight - 90, 25, 'F')
      doc.setDrawColor(255, 255, 255)
      doc.setLineWidth(1)
      doc.circle(80, pageHeight - 90, 20, 'S')
      doc.circle(80, pageHeight - 90, 15, 'S')
      doc.setFontSize(8)
      doc.setTextColor(255, 255, 255)
      doc.text('DICT', 72, pageHeight - 87)

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

