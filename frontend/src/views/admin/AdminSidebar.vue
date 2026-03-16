<template>
  <aside class="admin-sidebar">
    <div class="sidebar-header">
      <div class="sidebar-logo">AD</div>
      <div>
        <h2 class="sidebar-title">Admin Panel</h2>
        <p class="sidebar-subtitle">Manage users and dashboard</p>
      </div>
    </div>

    <div class="sidebar-section">
      <p class="sidebar-section-label">Menus</p>
      <nav class="sidebar-nav">
        <router-link
          to="/admin/dashboard"
          class="sidebar-link"
          active-class="sidebar-link-active"
        >
          <span class="sidebar-icon">🏠</span>
          <span>Dashboard</span>
        </router-link>
        <button
          type="button"
          class="sidebar-link sidebar-link-group"
          @click="userMgmtOpen = !userMgmtOpen"
        >
          <span class="sidebar-icon">👥</span>
          <span class="sidebar-link-group-label">User Management</span>
          <span class="sidebar-link-group-chevron" :class="{ 'is-open': userMgmtOpen }">
            ▾
          </span>
        </button>

        <div v-if="userMgmtOpen" class="sidebar-submenu">
          <div class="sidebar-submenu-line"></div>
          <div class="sidebar-submenu-items">
            <router-link
              to="/admin/interns"
              class="sidebar-link sidebar-link-child"
              active-class="sidebar-link-active"
            >
              <span class="sidebar-icon">📋</span>
              <span>Student Interns</span>
            </router-link>
            <router-link
              to="/admin/staff"
              class="sidebar-link sidebar-link-child"
              active-class="sidebar-link-active"
            >
              <span class="sidebar-icon">👤</span>
              <span>Staff</span>
            </router-link>
          </div>
        </div>
        <router-link
          to="/admin/settings"
          class="sidebar-link"
          active-class="sidebar-link-active"
        >
          <span class="sidebar-icon">⚙️</span>
          <span>Set Office Hours</span>
        </router-link>
      </nav>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'AdminSidebar',
  data() {
    return {
      userMgmtOpen: true,
    };
  },
};
</script>

<style scoped>
.admin-sidebar {
  width: 250px;
  padding: 1.5rem 1.25rem;
  background-color: #ffffff;
  border-right: 3px solid #e5e7eb;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.sidebar-logo {
  width: 38px;
  height: 38px;
  border-radius: 999px;
  background: linear-gradient(135deg, #1d4ed8, #60a5fa);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f9fafb;
  font-weight: 700;
  font-size: 0.95rem;
}

.sidebar-title {
  margin: 0;
  font-size: 1.05rem;
  color: #111827;
}

.sidebar-subtitle {
  margin: 0.1rem 0 0;
  font-size: 0.8rem;
  color: #6b7280;
}

.sidebar-section-label {
  margin: 0 0 0.35rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #9ca3af;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.75rem;
  color: #374151;
  text-decoration: none;
  font-size: 0.9rem;
  transition: background 0.15s ease, color 0.15s ease, transform 0.1s ease;
}

.sidebar-link-child {
  padding-left: 1.9rem;
  font-size: 0.85rem;
}

.sidebar-link-group {
  width: 100%;
  border: none;
  background: transparent;
  justify-content: space-between;
  cursor: pointer;
}

.sidebar-link-group-label {
  flex: 1;
  text-align: left;
}

.sidebar-link-group-chevron {
  font-size: 0.7rem;
  color: #6b7280;
  transition: transform 0.15s ease;
}

.sidebar-link-group-chevron.is-open {
  transform: rotate(180deg);
}

.sidebar-submenu {
  display: flex;
  margin-top: 0.1rem;
}

.sidebar-submenu-line {
  width: 1px;
  margin: 0.3rem 0.6rem 0.3rem 0.8rem;
  background-color: #d1d5db;
}

.sidebar-submenu-items {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.sidebar-link:hover {
  background: #edf2ff;
  color: #1d4ed8;
}

.sidebar-link-active {
  background: #e0edff;
  color: #1d4ed8;
}

.sidebar-link-active .sidebar-icon {
  background: rgba(15, 23, 42, 0.08);
}

.sidebar-icon {
  width: 26px;
  height: 26px;
  border-radius: 999px;
  background: #e0edff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
}

@media (max-width: 900px) {
  .admin-sidebar {
    width: 100%;
    padding: 1rem 1rem 0;
  }

  .sidebar-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.9rem 1rem;
  }

  .sidebar-section {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .sidebar-section-label {
    margin-bottom: 0;
  }

  .sidebar-nav {
    flex-direction: row;
  }

  .sidebar-link {
    padding: 0.35rem 0.5rem;
  }
}
</style>
