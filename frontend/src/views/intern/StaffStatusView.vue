<template>
  <div class="intern-layout">
    <header class="intern-header">
      <h1>Staff Status</h1>
      <div class="intern-header-right">
        <nav class="intern-nav">
          <router-link to="/intern/dashboard">Dashboard</router-link>
          <router-link to="/intern/time">Time In / Out</router-link>
          <router-link to="/intern/attendance">My Attendance</router-link>
          <router-link to="/intern/staff-status">Staff Status</router-link>
          <router-link to="/intern/notifications">Notifications</router-link>
          <router-link to="/intern/profile">Profile</router-link>
          <router-link to="/intern/settings">Settings</router-link>
        </nav>
      </div>
    </header>

    <main class="staff-main">
      <section class="card-container">
        <div class="card-header">
          <div>
            <h2>All Staff</h2>
            <p class="note">List of staff accounts retrieved from the system.</p>
          </div>
          <div class="card-actions">
            <button class="btn small" :disabled="loading" @click="fetchStaff">
              {{ loading ? 'Loading...' : 'Refresh' }}
            </button>
          </div>
        </div>

        <p v-if="error" class="note">{{ error }}</p>

        <div v-if="!loading && staff.length === 0" class="empty-state">
          No staff found
        </div>

        <div v-else class="staff-grid">
          <div v-for="s in staff" :key="s.id" class="staff-card">
            <div class="staff-avatar">
              {{ s.firstName ? s.firstName.charAt(0).toUpperCase() : 'S' }}
            </div>
            <div class="staff-info">
              <h3 class="staff-name">{{ formatName(s) }}</h3>
              <span class="staff-position">{{ s.position || 'No Position' }}</span>
              
              <div class="staff-detail">
                <span class="detail-icon">@</span>
                <span class="detail-text">{{ s.username || '-' }}</span>
              </div>
              
              <div class="staff-detail">
                <span class="detail-icon">✉</span>
                <span class="detail-text" :title="s.email || '-'">{{ s.email || '-' }}</span>
              </div>
              
              <div class="status-badge" :class="{'has-status': s.staffStatus, 'no-status': !s.staffStatus || s.staffStatus === 'No status yet'}">
                <span class="status-dot"></span>
                {{ s.staffStatus || 'No status yet' }}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  name: 'InternStaffStatusView',
  data() {
    return {
      staff: [],
      loading: false,
      error: '',
    }
  },
  created() {
    this.fetchStaff()
  },
  methods: {
    formatName(s) {
      const last = (s && s.lastName) || ''
      const first = (s && s.firstName) || ''
      const middle = (s && s.middleName) || ''

      if (last || first || middle) {
        const main = `${last}${last && (first || middle) ? ', ' : ''}${first}`.trim()
        return middle ? `${main} ${middle}`.trim() : main
      }
      return (s && (s.fullName || s.name)) || ''
    },
    async fetchStaff() {
      this.loading = true
      this.error = ''
      try {
        const res = await fetch('http://localhost:3001/staff')
        const json = await (res.ok ? res.json() : Promise.resolve(null))
        if (!json || !Array.isArray(json.staff)) {
          this.staff = []
          this.error = 'Failed to load staff list.'
          return
        }
        this.staff = json.staff

        await this.fetchStaffStatuses()
      } catch (e) {
        this.staff = []
        this.error = 'Failed to load staff list.'
      } finally {
        this.loading = false
      }
    },

    async fetchStaffStatuses() {
      if (!Array.isArray(this.staff) || this.staff.length === 0) return

      const base = 'http://localhost:3001'

      const results = await Promise.all(
        this.staff.map(async (s) => {
          try {
            if (!s || !s.id) return { id: s && s.id, staffStatus: '' }
            const res = await fetch(`${base}/staff/${encodeURIComponent(s.id)}/status`)
            const json = await (res.ok ? res.json() : Promise.resolve(null))
            return {
              id: s.id,
              staffStatus: (json && typeof json.staffStatus === 'string') ? json.staffStatus : '',
            }
          } catch {
            return { id: s && s.id, staffStatus: '' }
          }
        })
      )

      const map = new Map(results.map((r) => [r.id, r.staffStatus]))
      this.staff = this.staff.map((s) => ({
        ...s,
        staffStatus: map.get(s.id) || s.staffStatus || '',
      }))
    },
  },
}
</script>

<style scoped>
.intern-layout {
  min-height: 100vh;
  background: #f5f7fb;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.intern-header {
  background: #1e293b;
  color: #fff;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.intern-header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.intern-header h1 {
  margin: 0;
  font-size: 1.4rem;
}

.intern-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.intern-nav a {
  color: #e5e7eb;
  text-decoration: none;
  padding: 0.35rem 0.8rem;
  border-radius: 999px;
  border: 1px solid transparent;
  font-size: 0.9rem;
}

.intern-nav a.router-link-active {
  background: #f97316;
  color: #111827;
  border-color: #f97316;
}

.intern-nav a:hover {
  background: #111827;
}

.staff-main {
  max-width: 1100px;
  margin: 2rem auto;
  padding: 0 1rem 2rem;
}

.card {
  background: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
  padding: 1.5rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.card-header h2 {
  margin: 0;
  font-size: 1.1rem;
  color: #0f172a;
}

.note {
  margin: 0.25rem 0 0;
  font-size: 0.85rem;
  color: #6b7280;
}

.card-actions {
  display: flex;
  justify-content: flex-end;
}

.btn {
  padding: 0.6rem 1rem;
  border-radius: 999px;
  border: none;
  background: #e5e7eb;
  color: #111827;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn.small {
  padding: 0.5rem 0.9rem;
}

.staff-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.staff-card {
  background: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  border: 1px solid #f1f5f9;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.staff-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04);
}

.staff-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #eff6ff;
  color: #3b82f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.staff-info {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.staff-name {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  color: #1e293b;
  font-weight: 600;
}

.staff-position {
  font-size: 0.85rem;
  color: #64748b;
  margin-bottom: 1rem;
  font-weight: 500;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f1f5f9;
}

.staff-detail {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #475569;
  margin-bottom: 0.5rem;
  text-align: left;
}

.detail-icon {
  color: #94a3b8;
  width: 16px;
  text-align: center;
}

.detail-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.status-badge {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: #f1f5f9;
  color: #475569;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #94a3b8;
}

.status-badge.has-status {
  background: #ecfdf5;
  color: #059669;
}

.status-badge.has-status .status-dot {
  background-color: #10b981;
}

.status-badge.no-status {
  background: #f8fafc;
  color: #64748b;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #64748b;
  background: #f8fafc;
  border-radius: 1rem;
  border: 2px dashed #e2e8f0;
}

@media (max-width: 900px) {
  .intern-header {
    padding: 1rem 1rem;
    flex-direction: column;
    align-items: flex-start;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
