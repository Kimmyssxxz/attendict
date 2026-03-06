<template>
  <div class="admin-shell">
    <AdminSidebar />

    <div class="admin-layout">
      <header class="admin-header">
        <h1>Office Hours Settings</h1>
      </header>

      <main class="admin-main">
        <section class="section">
          <div class="section-header">
            <h2 class="section-title">Todays Office Hours</h2>
            <p class="section-subtitle">
              Set the office hours that will apply for <strong>today only</strong>.
            </p>
          </div>

          <form class="office-hours-form" @submit.prevent>
            <div class="office-hours-row">
              <label class="day-label">Today</label>
              <div class="time-inputs">
                <div class="time-field">
                  <span>Start</span>
                  <input v-model="today.start" type="time" />
                </div>
                <div class="time-field">
                  <span>End</span>
                  <input v-model="today.end" type="time" />
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="secondary-button" @click="resetTimes">
                Reset
              </button>
              <button type="button" class="primary-button" @click="saveSettings">
                Save Settings
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  </div>
</template>

<script>
import AdminSidebar from './AdminSidebar.vue';

export default {
  name: 'AdminSettingsView',
  components: {
    AdminSidebar,
  },
  data() {
    return {
      today: {
        start: '08:00',
        end: '17:00',
      },
    };
  },
  methods: {
    resetTimes() {
      this.today.start = '08:00';
      this.today.end = '17:00';
    },
    saveSettings() {
      console.log('Today\'s office hours:', this.today);
      alert("Today's office hours saved (UI only, no backend yet).");
    },
  },
};
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

.office-hours-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.office-hours-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.office-hours-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.day-label {
  width: 110px;
  font-weight: 500;
  color: #333;
}

.time-inputs {
  display: flex;
  gap: 0.75rem;
}

.time-field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.85rem;
  color: #555;
}

.time-field input {
  padding: 0.35rem 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 0.9rem;
}

.form-actions {
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

.secondary-button {
  background-color: #e0e0e0;
  color: #333;
}

@media (max-width: 900px) {
  .admin-shell {
    flex-direction: column;
  }

  .office-hours-row {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
