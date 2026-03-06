<template>
  <div class="intern-layout">
    <header class="intern-header">
      <h1>Intern Profile</h1>
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

        <div class="notif-wrapper" @click="toggleNotifications">
          <div class="notif-bell">
            <span class="bell-icon">🔔</span>
            <span v-if="unreadCount > 0" class="notif-badge">{{ unreadCount }}</span>
          </div>
          <div v-if="showNotifications" class="notif-panel" @click.stop>
            <h3>Notifications</h3>
            <ul v-if="notifications.length" class="notif-dropdown-list">
              <li v-for="(n, idx) in notifications" :key="idx">{{ n }}</li>
            </ul>
            <p v-else class="notif-empty">No notifications</p>
          </div>
        </div>
      </div>
    </header>

    <main class="profile-main">
      <form class="profile-form" @submit.prevent="handleSaveInfo">
        
        <!-- 1️⃣ Basic Information -->
        <section class="card profile-section">
          <div class="section-header">
            <h2>1️⃣ Basic Information</h2>
            <p class="note">Standard details of the intern.</p>
          </div>
          
          <div class="avatar-row">
            <div class="avatar-wrapper">
              <div class="avatar" v-if="intern.photoUrl">
                <img :src="intern.photoUrl" alt="Profile picture" />
              </div>
              <div class="avatar placeholder" v-else>
                <span>{{ avatarInitials }}</span>
              </div>
            </div>
            <div class="avatar-actions">
              <label class="avatar-upload-btn">
                <span>{{ uploadingPhoto ? 'Uploading...' : 'Upload Profile Picture' }}</span>
                <input type="file" accept="image/*" @change="onPhotoSelected" :disabled="uploadingPhoto || !intern.id" />
              </label>
              <p v-if="photoError" class="note error-note">{{ photoError }}</p>
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label>Full Name (Read Only)</label>
              <input type="text" :value="formattedName" disabled class="readonly-input" />
            </div>
            <div class="form-group">
              <label>Student ID / Intern ID</label>
              <input type="text" :value="intern.username" disabled class="readonly-input" title="Your username acts as your Intern ID" />
            </div>
            <div class="form-group">
              <label for="editEmail">Email Address</label>
              <input id="editEmail" type="email" v-model="intern.email" placeholder="example@gmail.com" />
            </div>
            <div class="form-group">
              <label for="editPhone">Contact Number</label>
              <input id="editPhone" type="text" v-model="intern.phoneNumber" placeholder="09XX XXX XXXX" />
            </div>
            <div class="form-group full-width">
              <label for="editAddress">Address</label>
              <input id="editAddress" type="text" v-model="intern.address" placeholder="Full Home Address" />
            </div>
            <div class="form-group">
              <label for="editGender">Gender</label>
              <select id="editGender" v-model="intern.gender">
                <option value="" disabled>Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
            <div class="form-group">
              <label for="editDob">Date of Birth</label>
              <input id="editDob" type="date" v-model="intern.dateOfBirth" />
            </div>
          </div>
        </section>

        <!-- 2️⃣ School Information -->
        <section class="card profile-section">
          <div class="section-header">
            <h2>2️⃣ School Information</h2>
            <p class="note">Educational background and internship duration.</p>
          </div>
          
          <div class="form-grid">
            <div class="form-group full-width">
              <label for="editSchool">School Name</label>
              <input id="editSchool" type="text" v-model="intern.schoolOrUniversity" placeholder="E.g., University of the Philippines" />
            </div>
            <div class="form-group">
              <label for="editCourse">Course / Program</label>
              <input id="editCourse" type="text" v-model="intern.course" placeholder="E.g., BS Information Technology" />
            </div>
            <div class="form-group">
              <label for="editYear">Year Level</label>
              <select id="editYear" v-model="intern.yearLevel">
                <option value="" disabled>Select Year Level</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="5th Year">5th Year</option>
              </select>
            </div>
            <div class="form-group">
              <label for="editRequiredHours">OJT Required Hours</label>
              <input id="editRequiredHours" type="number" min="0" v-model.number="intern.ojtRequiredHours" placeholder="e.g. 486" />
            </div>
            <div class="form-group">
              <label for="editStartDate">Start Date of Internship</label>
              <input id="editStartDate" type="date" v-model="intern.startDate" />
            </div>
            <div class="form-group">
              <label for="editEndDate">End Date of Internship</label>
              <input id="editEndDate" type="date" v-model="intern.endDate" />
            </div>
          </div>
        </section>


        <!-- Actions -->
        <div class="action-bar">
          <p v-if="infoMessage" class="note success-note">{{ infoMessage }}</p>
          <p v-if="infoError" class="note error-note">{{ infoError }}</p>
          <button type="submit" class="btn btn-save" :disabled="infoSaving || !intern.id">
            <span v-if="infoSaving">Saving Profile...</span>
            <span v-else>Save Profile</span>
          </button>
        </div>

      </form>
    </main>
  </div>
</template>

<script>
import { doc, updateDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';

export default {
  name: 'InternProfileView',
  data() {
    return {
      intern: {
        id: null,
        username: '',
        firstName: '',
        middleName: '',
        lastName: '',
        schoolOrUniversity: '',
        assignedOffice: '',
        position: '',
        phoneNumber: '',
        email: '',
        role: '',
        photoUrl: '',
        ojtRequiredHours: null,
        // Added Profile Fields
        address: '',
        gender: '',
        dateOfBirth: '',
        course: '',
        yearLevel: '',
        startDate: '',
        endDate: '',
      },
      notifications: [],
      unreadCount: 0,
      showNotifications: false,
      loading: true,
      error: null,
      uploadingPhoto: false,
      photoError: null,
      infoSaving: false,
      infoMessage: null,
      infoError: null,
    };
  },
  computed: {
    formattedName() {
      const { firstName, middleName, lastName } = this.intern;
      if (!firstName && !lastName) return 'N/A';

      const middleInitial = middleName ? `${middleName.charAt(0)}. ` : '';
      return `${firstName} ${middleInitial}${lastName}`.trim();
    },
    avatarInitials() {
      const first = this.intern.firstName ? this.intern.firstName.charAt(0).toUpperCase() : '';
      const last = this.intern.lastName ? this.intern.lastName.charAt(0).toUpperCase() : '';
      const combined = `${first}${last}`;
      return combined || '?';
    },
  },
  created() {
    this.loadInternProfile();
    // Load notifications for header bell
    try {
      const stored = localStorage.getItem('internUser');
      if (stored) {
        const user = JSON.parse(stored);
        const internId = user && user.id;
        if (internId) {
          const key = `internNotifications_${internId}`;
          const unreadKey = `internNotificationsUnread_${internId}`;
          const raw = localStorage.getItem(key);
          if (raw) {
            const list = JSON.parse(raw);
            if (Array.isArray(list)) {
              this.notifications = list;
            }
          }
          const unreadRaw = localStorage.getItem(unreadKey);
          if (unreadRaw != null) {
            const num = parseInt(unreadRaw, 10);
            if (!Number.isNaN(num) && num >= 0) {
              this.unreadCount = num;
            }
          } else {
            this.unreadCount = this.notifications.length;
          }
        }
      }
    } catch (e) {}
  },
  methods: {
    toggleNotifications() {
      this.showNotifications = !this.showNotifications
    },
    addLocalNotification(message) {
      try {
        if (!this.intern.id || !message) return;
        const key = `internNotifications_${this.intern.id}`;
        const unreadKey = `internNotificationsUnread_${this.intern.id}`;
        const existingRaw = localStorage.getItem(key);
        let list = [];
        if (existingRaw) {
          const parsed = JSON.parse(existingRaw);
          if (Array.isArray(parsed)) {
            list = parsed;
          }
        }
        list.unshift(message);
        localStorage.setItem(key, JSON.stringify(list));
        const unreadRaw = localStorage.getItem(unreadKey);
        let unread = 0;
        if (unreadRaw != null) {
          const num = parseInt(unreadRaw, 10);
          if (!Number.isNaN(num) && num >= 0) {
            unread = num;
          }
        }
        unread += 1;
        localStorage.setItem(unreadKey, String(unread));
      } catch (e) {}
    },
    async loadInternProfile() {
      try {
        const stored = localStorage.getItem('internUser');
        if (!stored) {
          this.error = 'No logged-in intern found.';
          this.loading = false;
          return;
        }

        const basic = JSON.parse(stored);
        this.intern = {
          ...this.intern,
          ...basic,
          id: basic.id,
        };

        if (!basic.id) {
          this.loading = false;
          return;
        }

        const response = await fetch(`http://localhost:3001/users/${basic.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch full user profile');
        }

        const data = await response.json();
        if (data && data.user) {
          this.intern = {
            ...this.intern,
            ...data.user,
          };
        }
      } catch (err) {
        console.error('Error loading intern profile:', err);
        this.error = 'Failed to load intern information.';
      } finally {
        this.loading = false;
      }
    },
    async handleSaveInfo() {
      try {
        this.infoError = null;
        this.infoMessage = null;

        if (!this.intern.id) {
          this.infoError = 'Walang intern ID. Subukan mag-login ulit.';
          return;
        }

        this.infoSaving = true;
        const response = await fetch(`http://localhost:3001/users/${this.intern.id}/info`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            schoolOrUniversity: this.intern.schoolOrUniversity || '',
            phoneNumber: this.intern.phoneNumber || '',
            email: this.intern.email || '',
            ojtRequiredHours: Number(this.intern.ojtRequiredHours) || null,
            address: this.intern.address || '',
            gender: this.intern.gender || '',
            dateOfBirth: this.intern.dateOfBirth || '',
            course: this.intern.course || '',
            yearLevel: this.intern.yearLevel || '',
            startDate: this.intern.startDate || '',
            endDate: this.intern.endDate || '',
          }),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          const message = data && data.message ? data.message : 'Failed to update information.';
          throw new Error(message);
        }

        if (data && data.user) {
          this.intern = {
            ...this.intern,
            ...data.user,
          };

          const stored = localStorage.getItem('internUser');
          if (stored) {
            const basic = JSON.parse(stored);
            localStorage.setItem('internUser', JSON.stringify({ ...basic, ...data.user }));
          }
        }

        this.infoMessage = 'Profile updated successfully!';
        this.addLocalNotification('Your comprehensive profile information was updated.');
        
        setTimeout(() => {
          this.infoMessage = null;
        }, 4000);
        
      } catch (err) {
        console.error('Error updating intern info:', err);
        this.infoError = err && err.message ? err.message : 'Failed to update information.';
      } finally {
        this.infoSaving = false;
      }
    },
    async onPhotoSelected(event) {
      try {
        this.photoError = null;
        const file = event.target.files && event.target.files[0];
        if (!file) {
          return;
        }
        if (!this.intern.id) {
          this.photoError = 'Walang intern ID. Subukan mag-login ulit.';
          return;
        }

        this.uploadingPhoto = true;
        const fileRef = storageRef(storage, `profilePhotos/${this.intern.id}`);
        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);

        const userDocRef = doc(db, 'users', this.intern.id);
        await updateDoc(userDocRef, { photoUrl: url });

        this.intern.photoUrl = url;

        const stored = localStorage.getItem('internUser');
        if (stored) {
          const basic = JSON.parse(stored);
          localStorage.setItem('internUser', JSON.stringify({ ...basic, photoUrl: url }));
        }
      } catch (err) {
        console.error('Error uploading profile photo:', err);
        this.photoError = 'Failed to upload profile picture.';
      } finally {
        this.uploadingPhoto = false;
        if (event && event.target) {
          event.target.value = '';
        }
      }
    },
  },
};
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
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
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
  font-size: 0.9rem;
  border: 1px solid transparent;
}

.intern-nav a.router-link-active {
  background: #f97316;
  color: #111827;
  border-color: #f97316;
}

.intern-nav a:hover {
  background: #111827;
}

.notif-wrapper {
  position: relative;
  cursor: pointer;
}

.notif-bell {
  position: relative;
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bell-icon {
  font-size: 16px;
}

.notif-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ef4444;
  color: #fef2f2;
  border-radius: 999px;
  font-size: 10px;
  padding: 0 5px;
}

.notif-panel {
  position: absolute;
  right: 0;
  margin-top: 0.5rem;
  background: #ffffff;
  color: #111827;
  min-width: 220px;
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.25);
  padding: 0.75rem 0.9rem;
  z-index: 20;
}

.notif-panel h3 {
  margin: 0 0 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
}

.notif-dropdown-list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.85rem;
}

.notif-dropdown-list li + li {
  margin-top: 0.25rem;
}

.notif-empty {
  margin: 0;
  font-size: 0.8rem;
  color: #6b7280;
}

/* Form styling specifically for updated grid layout */
.profile-main {
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1rem 3rem;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.card {
  background: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  padding: 2rem;
  border: 1px solid #e2e8f0;
}

.section-header {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f1f5f9;
}

.section-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #0f172a;
  font-weight: 700;
}

.section-header .note {
  margin: 0.25rem 0 0 0;
  color: #64748b;
  font-size: 0.85rem;
}

/* Avatar Row */
.avatar-row {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.75rem;
}

.avatar-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e2e8f0;
  color: #334155;
  font-size: 1.7rem;
  font-weight: 600;
  border: 3px solid #ffffff;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.avatar-upload-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background: #f1f5f9;
  color: #0f172a;
  border: 1px solid #cbd5e1;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: background 0.2s;
}

.avatar-upload-btn:hover {
  background: #e2e8f0;
}

.avatar-upload-btn input[type='file'] {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.avatar-upload-btn[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Forms Grid */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group.full-width {
  grid-column: span 2;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #334155;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.6rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #cbd5e1;
  font-size: 0.9rem;
  color: #0f172a;
  background: #ffffff;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-group input::placeholder {
  color: #94a3b8;
}

.readonly-input {
  background: #f8fafc !important;
  color: #64748b !important;
  cursor: not-allowed;
  border-color: #e2e8f0 !important;
}

/* Action Bar */
.action-bar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-save {
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  border: none;
  background: #f97316;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 6px -1px rgba(249, 115, 22, 0.2);
  transition: transform 0.1s, background 0.2s;
}

.btn-save:hover:not(:disabled) {
  background: #ea580c;
  transform: translateY(-1px);
}

.btn-save:disabled {
  background: #cbd5e1;
  color: #64748b;
  cursor: not-allowed;
  box-shadow: none;
}

.note {
  font-size: 0.85rem;
  color: #64748b;
  margin: 0;
}

.error-note {
  color: #ef4444;
  font-weight: 500;
}

.success-note {
  color: #059669;
  font-weight: 600;
  padding: 0.5rem 1rem;
  background: #ecfdf5;
  border-radius: 0.5rem;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-group.full-width {
    grid-column: span 1;
  }
  
  .action-bar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .btn-save {
    width: 100%;
  }
}
</style>
