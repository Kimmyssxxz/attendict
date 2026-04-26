<template>
  <div class="min-h-screen flex flex-col md:flex-row bg-gray-50/50">
    <AdminSidebar />

    <div class="flex-1 flex flex-col">
      <header class="px-8 py-6 bg-white">
        <h1 class="m-0 text-3xl font-semibold">Admin Settings</h1>
      </header>

      <main class="flex-1 px-6 py-6 font-sans">
        <section class="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mb-8">
          <div class="mb-6">
            <h2 class="m-0 text-2xl font-semibold text-gray-800">Change Password</h2>
            <p class="text-gray-500">
              Update your account password below.
            </p>
          </div>

          <form class="flex flex-col gap-4" @submit.prevent="savePassword">
            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-800" for="currentPassword">Current Password</label>
              <input 
                id="currentPassword"
                v-model="passwords.current" 
                type="password" 
                required
                class="py-2 px-3 rounded border border-gray-300 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-200" 
              />
            </div>
            
            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-800" for="newPassword">New Password</label>
              <input 
                id="newPassword"
                v-model="passwords.new" 
                type="password" 
                required
                class="py-2 px-3 rounded border border-gray-300 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-200" 
              />
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-800" for="confirmPassword">Confirm New Password</label>
              <input 
                id="confirmPassword"
                v-model="passwords.confirm" 
                type="password" 
                required
                class="py-2 px-3 rounded border border-gray-300 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-200" 
              />
            </div>

            <div v-if="passwordError" class="text-red-500 text-sm mt-1">
              {{ passwordError }}
            </div>
            <div v-if="passwordSuccess" class="text-green-600 text-sm mt-1">
              {{ passwordSuccess }}
            </div>

            <div class="flex justify-end gap-2 mt-4">
              <button 
                type="button" 
                class="px-4 py-2 rounded-xl text-sm cursor-pointer bg-gray-200 text-gray-800 border-none transition-colors hover:bg-gray-300" 
                @click="resetPasswordForm"
                :disabled="passwordLoading"
              >
                Reset
              </button>
              <button 
                type="submit" 
                class="px-4 py-2 rounded-xl text-sm cursor-pointer bg-[#133e75] text-white border-none transition-colors hover:bg-[#133e75]/80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2" 
                :disabled="passwordLoading"
              >
                <span v-if="passwordLoading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Update Password
              </button>
            </div>
          </form>
        </section>

        <section class="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          <div class="mb-6">
            <h2 class="m-0 text-2xl font-semibold text-gray-800">Change Username</h2>
            <p class="text-gray-500">
              Update your account username. You will need to use the new username for future logins.
            </p>
          </div>

          <form class="flex flex-col gap-4" @submit.prevent="saveUsername">
            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-800" for="newUsername">New Username</label>
              <input 
                id="newUsername"
                v-model="usernameData.new" 
                type="text" 
                required
                class="py-2 px-3 rounded border border-gray-300 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-200" 
                placeholder="Enter new username"
              />
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-800" for="confirmPasswordUser">Password</label>
              <input 
                id="confirmPasswordUser"
                v-model="usernameData.password" 
                type="password" 
                required
                class="py-2 px-3 rounded border border-gray-300 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-200" 
                placeholder="Confirm with your password"
              />
            </div>

            <div v-if="usernameError" class="text-red-500 text-sm mt-1">
              {{ usernameError }}
            </div>
            <div v-if="usernameSuccess" class="text-green-600 text-sm mt-1">
              {{ usernameSuccess }}
            </div>

            <div class="flex justify-end gap-2 mt-4">
              <button 
                type="button" 
                class="px-4 py-2 rounded-xl text-sm cursor-pointer bg-gray-200 text-gray-800 border-none transition-colors hover:bg-gray-300" 
                @click="resetUsernameForm"
                :disabled="usernameLoading"
              >
                Reset
              </button>
              <button 
                type="submit" 
                class="px-4 py-2 rounded-xl text-sm cursor-pointer bg-[#133e75] text-white border-none transition-colors hover:bg-[#133e75]/80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2" 
                :disabled="usernameLoading"
              >
                <span v-if="usernameLoading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Update Username
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
      passwords: {
        current: '',
        new: '',
        confirm: '',
      },
      usernameData: {
        new: '',
        password: '',
      },
      passwordError: '',
      passwordSuccess: '',
      usernameError: '',
      usernameSuccess: '',
      passwordLoading: false,
      usernameLoading: false,
      user: null
    };
  },
  mounted() {
    const userStr = localStorage.getItem('adminUser') || localStorage.getItem('user');
    if (userStr) {
      try {
        this.user = JSON.parse(userStr);
      } catch (e) {
        console.error('Failed to parse user data');
      }
    }
  },
  methods: {
    resetPasswordForm() {
      this.passwords.current = '';
      this.passwords.new = '';
      this.passwords.confirm = '';
      this.passwordError = '';
      this.passwordSuccess = '';
    },
    resetUsernameForm() {
      this.usernameData.new = '';
      this.usernameData.password = '';
      this.usernameError = '';
      this.usernameSuccess = '';
    },
    async savePassword() {
      this.passwordError = '';
      this.passwordSuccess = '';

      if (!this.user || !this.user.id) {
        this.passwordError = 'You are not logged in properly.';
        return;
      }

      if (this.passwords.new !== this.passwords.confirm) {
        this.passwordError = 'New password and confirm password do not match.';
        return;
      }

      if (this.passwords.new.length < 6) {
        this.passwordError = 'New password must be at least 6 characters long.';
        return;
      }

      this.passwordLoading = true;

      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/users/${this.user.id}/change-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            currentPassword: this.passwords.current,
            newPassword: this.passwords.new,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to update password.');
        }

        this.passwordSuccess = 'Password changed successfully.';
        this.passwords.current = '';
        this.passwords.new = '';
        this.passwords.confirm = '';
      } catch (error) {
        this.passwordError = error.message || 'An error occurred while communicating with the server.';
      } finally {
        this.passwordLoading = false;
      }
    },
    async saveUsername() {
      this.usernameError = '';
      this.usernameSuccess = '';

      if (!this.user || !this.user.id) {
        this.usernameError = 'You are not logged in properly.';
        return;
      }

      if (!this.usernameData.new.trim()) {
        this.usernameError = 'New username is required.';
        return;
      }

      if (!this.usernameData.password) {
        this.usernameError = 'Password is required to confirm change.';
        return;
      }

      this.usernameLoading = true;

      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/users/${this.user.id}/change-username`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            newUsername: this.usernameData.new,
            password: this.usernameData.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to update username.');
        }

        this.usernameSuccess = 'Username updated successfully. Please note that your profile sidebar might still show the old username until you re-login.';
        
        // Update local storage user data
        if (this.user) {
          const updatedUser = { ...this.user, username: this.usernameData.new.trim() };
          localStorage.setItem('adminUser', JSON.stringify(updatedUser));
          localStorage.setItem('user', JSON.stringify(updatedUser));
          this.user = updatedUser;
        }

        this.usernameData.new = '';
        this.usernameData.password = '';
      } catch (error) {
        this.usernameError = error.message || 'An error occurred while communicating with the server.';
      } finally {
        this.usernameLoading = false;
      }
    },
  },
};
</script>

