<template>
  <div class="flex h-screen bg-[#f5f5f5] font-sans antialiased text-gray-900">
    <!-- Sidebar -->
    <aside class="w-[260px] bg-white/95 backdrop-blur-xl border-r border-gray-200 py-8 px-5 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 shrink-0 hidden md:flex">
      <div class="flex justify-between items-center mb-10 px-2">
        <div class="text-2xl font-extrabold tracking-tight bg-gradient-to-br from-blue-900 to-blue-800 bg-clip-text text-transparent">
          <span class="text-blue-900">ATTEND</span><span class="text-blue-800">ICT</span>
        </div>
      </div>

      <nav class="flex flex-col gap-2">
        <div class="flex items-center gap-3 py-3 px-4 rounded-xl cursor-pointer text-sm font-medium transition-all duration-200"
             :class="activeNav === 'dashboard' ? 'bg-gradient-to-br from-blue-900 to-blue-800 text-white shadow-md shadow-blue-900/20' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'"
             @click="navigateTo('StaffDashboard', 'dashboard')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span>Dashboard</span>
        </div>

        <div class="flex items-center gap-3 py-3 px-4 rounded-xl cursor-pointer text-sm font-medium transition-all duration-200"
             :class="activeNav === 'attendance' ? 'bg-gradient-to-br from-blue-900 to-blue-800 text-white shadow-md shadow-blue-900/20' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'"
             @click="navigateTo('StaffAttendance', 'attendance')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="1"></circle>
            <path d="M12 1v6m0 6v6"></path>
            <path d="M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24"></path>
            <path d="M1 12h6m6 0h6"></path>
            <path d="M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24"></path>
          </svg>
          <span>My Attendance</span>
        </div>

        <div class="flex items-center gap-3 py-3 px-4 rounded-xl cursor-pointer text-sm font-medium transition-all duration-200"
             :class="activeNav === 'attendance-logs' ? 'bg-gradient-to-br from-blue-900 to-blue-800 text-white shadow-md shadow-blue-900/20' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'"
             @click="navigateTo('StaffAttendanceLogs', 'attendance-logs')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>Attendance Logs</span>
        </div>

        <div class="flex items-center gap-3 py-3 px-4 rounded-xl cursor-pointer text-sm font-medium transition-all duration-200"
             :class="activeNav === 'monthly-summary' ? 'bg-gradient-to-br from-blue-900 to-blue-800 text-white shadow-md shadow-blue-900/20' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'"
             @click="navigateTo('StaffMonthlySummary', 'monthly-summary')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          <span>Monthly Summary</span>
        </div>

        <div class="flex items-center gap-3 py-3 px-4 rounded-xl cursor-pointer text-sm font-medium transition-all duration-200"
             :class="activeNav === 'fingerprint' ? 'bg-gradient-to-br from-blue-900 to-blue-800 text-white shadow-md shadow-blue-900/20' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'"
             @click="navigateTo('StaffFingerprintEnrollment', 'fingerprint')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 11a2 2 0 0 0-2 2v2"></path>
            <path d="M12 9a4 4 0 0 0-4 4v2"></path>
            <path d="M12 7a6 6 0 0 0-6 6v2"></path>
            <path d="M12 5a8 8 0 0 0-8 8v2"></path>
            <path d="M12 11a2 2 0 0 1 2 2v2"></path>
            <path d="M12 9a4 4 0 0 1 4 4v2"></path>
          </svg>
          <span>Fingerprint Enrollment</span>
        </div>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col relative min-w-0 overflow-hidden z-0 bg-white">
      
      <!-- Page Content -->
      <div class="flex-1 overflow-y-auto px-4 py-8 sm:px-8">
        <div class="max-w-4xl mx-auto space-y-6 pb-20">
          
          <!-- Avatar Header Section -->
          <div class="flex flex-col items-center justify-center pt-2 pb-4">
            <div class="relative mb-3">
              <div class="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center text-3xl font-bold shadow-md overflow-hidden ring-2 ring-white ring-offset-2 ring-offset-blue-50">
                <img v-if="userPhotoUrl" :src="userPhotoUrl" class="w-full h-full object-cover" alt="Profile" />
                <span v-else>{{ userInitials || 'U' }}</span>
              </div>
            </div>
            <h2 class="text-xl font-bold text-gray-900">{{ userDisplayName || 'User Name' }}</h2>
            <p class="text-xs text-gray-500 capitalize">{{ userRole || 'user' }}</p>
          </div>

          <!-- Tabs -->
          <div class="flex justify-center gap-8 border-b border-gray-100">
            <button @click="activeTab = 'profile'" :class="['pb-3 px-4 text-xs font-semibold transition-colors', activeTab === 'profile' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30 rounded-t-lg' : 'text-gray-500 hover:text-gray-900']">Profile Info</button>
            <button @click="activeTab = 'security'" :class="['pb-3 px-4 text-xs font-semibold transition-colors', activeTab === 'security' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30 rounded-t-lg' : 'text-gray-500 hover:text-gray-900']">Security</button>
          </div>
          
          <!-- Settings Form -->
          <div v-if="loading" class="flex justify-center py-10">
             <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <div v-else class="space-y-6">
            <div v-if="activeTab === 'profile'" class="space-y-6">
              <!-- Personal Information -->
              <section class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 class="text-[11px] font-bold text-gray-700 flex items-center gap-2 mb-5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-blue-500"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  Personal Information
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <label class="block text-[11px] text-gray-500 mb-1">First Name</label>
                    <input type="text" v-model="form.firstName" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all">
                  </div>
                  <div>
                    <label class="block text-[11px] text-gray-500 mb-1">Last Name</label>
                    <input type="text" v-model="form.lastName" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all">
                  </div>
                  <div>
                    <label class="block text-[11px] text-gray-500 mb-1">Username</label>
                    <input type="text" v-model="form.username" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all">
                  </div>
                  <div>
                    <label class="block text-[11px] text-gray-500 mb-1">Date of Birth</label>
                    <input type="date" v-model="form.dateOfBirth" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all text-gray-500">
                  </div>
                  <div>
                    <label class="block text-[11px] text-gray-500 mb-1">Age</label>
                    <input type="number" v-model="form.age" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all">
                  </div>
                  <div>
                    <label class="block text-[11px] text-gray-500 mb-1">Gender</label>
                    <select v-model="form.gender" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all bg-white">
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </section>

              <!-- Contact Information -->
              <section class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 class="text-[11px] font-bold text-gray-700 flex items-center gap-2 mb-5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-green-500"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  Contact Information
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <label class="block text-[11px] text-gray-500 mb-1">Email</label>
                    <input type="email" v-model="form.email" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-700 outline-none" disabled>
                  </div>
                  <div class="flex items-end gap-2">
                    <div class="flex-1">
                      <label class="block text-[11px] text-gray-500 mb-1">Phone</label>
                      <input type="tel" v-model="form.phone" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all">
                    </div>
                    <button class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-[11px] font-medium rounded-lg transition-colors shadow-sm h-[38px]">Change</button>
                  </div>
                  <div class="col-span-1 md:col-span-2">
                    <label class="block text-[11px] text-gray-500 mb-1">Alternative Email</label>
                    <input type="email" v-model="form.alternativeEmail" placeholder="Enter alternative email" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all">
                  </div>
                </div>
              </section>

              <!-- Address -->
              <section class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 class="text-[11px] font-bold text-gray-700 flex items-center gap-2 mb-5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-red-500"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  Address
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div class="col-span-1 md:col-span-2">
                    <label class="block text-[11px] text-gray-500 mb-1">Street Address</label>
                    <input type="text" v-model="form.address.streetAddress" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all">
                  </div>
                  <div>
                    <label class="block text-[11px] text-gray-500 mb-1">City</label>
                    <input type="text" v-model="form.address.city" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all">
                  </div>
                  <div>
                    <label class="block text-[11px] text-gray-500 mb-1">Province</label>
                    <input type="text" v-model="form.address.province" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all">
                  </div>
                  <div>
                    <label class="block text-[11px] text-gray-500 mb-1">Postal Code</label>
                    <input type="text" v-model="form.address.postalCode" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all">
                  </div>
                  <div>
                    <label class="block text-[11px] text-gray-500 mb-1">Country</label>
                    <input type="text" v-model="form.address.country" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all">
                  </div>
                </div>
              </section>
            </div>

            <!-- Security Tab Content -->
            <div v-if="activeTab === 'security'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Change Profile Card -->
              <section class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
                <div class="w-full flex items-center gap-3 mb-6">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-500"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  <div>
                    <h3 class="text-sm font-bold text-gray-900">Change Profile</h3>
                    <p class="text-[11px] text-gray-500">Change your profile picture from here</p>
                  </div>
                </div>

                <div class="flex flex-col items-center justify-center py-6 flex-1">
                  <div class="w-32 h-32 rounded-full bg-[#0ea5e9] text-white flex items-center justify-center text-5xl font-bold shadow-sm overflow-hidden mb-6">
                    <img v-if="userPhotoUrl && !uploadingPhoto" :src="userPhotoUrl" class="w-full h-full object-cover" alt="Profile" />
                    <span v-else-if="!uploadingPhoto">{{ userInitials || 'U' }}</span>
                    <svg v-else class="animate-spin h-8 w-8 text-white" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  </div>
                  <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handlePhotoUpload" />

                  <div class="flex gap-3 mb-4">
                    <button @click="triggerFileInput" :disabled="uploadingPhoto" class="px-5 py-2 bg-[#3b82f6] hover:bg-blue-600 text-white text-xs font-semibold rounded-full shadow-sm flex items-center gap-2 transition-colors disabled:opacity-70">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                      Upload
                    </button>
                    <button @click="resetPhoto" :disabled="uploadingPhoto || !userPhotoUrl" class="px-5 py-2 bg-white hover:bg-gray-50 text-orange-400 border border-orange-200 text-xs font-semibold rounded-full flex items-center gap-2 transition-colors disabled:opacity-50">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline><path d="M20.49 9A9.9 9.9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9.9 9.9 0 0 1 3.51 15"></path></svg>
                      Reset
                    </button>
                  </div>
                  <p class="text-[10px] text-gray-500">Allowed JPG, GIF or PNG. Max size of 800K</p>
                </div>
              </section>

              <!-- Change Password Card -->
              <section class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                <div class="w-full flex items-center gap-3 mb-6">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-500"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>
                  <div>
                    <h3 class="text-sm font-bold text-gray-900">Change Password</h3>
                    <p class="text-[11px] text-gray-500">Your password must meet the requirements below</p>
                  </div>
                </div>

                <div class="space-y-4 flex-1">
                  <div>
                    <label class="block text-[11px] text-gray-600 font-semibold mb-1.5">Current Password</label>
                    <div class="relative">
                      <input :type="showCurrentPassword ? 'text' : 'password'" v-model="passwordForm.current" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
                      <button @click="showCurrentPassword = !showCurrentPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        <svg v-if="showCurrentPassword" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-[11px] text-gray-600 font-semibold mb-1.5">New Password</label>
                    <div class="relative">
                      <input :type="showNewPassword ? 'text' : 'password'" v-model="passwordForm.new" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
                      <button @click="showNewPassword = !showNewPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        <svg v-if="showNewPassword" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label class="block text-[11px] text-gray-600 font-semibold mb-1.5">Confirm Password</label>
                    <div class="relative mb-6">
                      <input :type="showConfirmPassword ? 'text' : 'password'" v-model="passwordForm.confirm" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
                      <button @click="showConfirmPassword = !showConfirmPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        <svg v-if="showConfirmPassword" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                      </button>
                    </div>
                  </div>
                  
                  <button @click="updatePassword" :disabled="updatingPassword" class="w-full py-2.5 bg-[#3b82f6] hover:bg-blue-600 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors mt-auto disabled:opacity-70 flex justify-center items-center h-[42px]">
                    <svg v-if="updatingPassword" class="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <span v-else>Update Password</span>
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>

        <!-- Fixed Bottom Action Bar -->
        <div class="fixed bottom-0 right-0 left-0 md:left-[260px] bg-white border-t border-gray-200 p-4 flex justify-end gap-3 z-30 opacity-95">
          <button @click="navigateTo('StaffDashboard', 'dashboard')" class="px-5 py-2 text-xs font-medium text-red-400 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">Close</button>
          <button @click="saveChanges" :disabled="saving" class="px-5 py-2 text-xs font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center gap-2 min-w-[120px]">
             <svg v-if="saving" class="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
             <span v-else>Save Changes</span>
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { db, storage } from '../../firebase.js'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'

const router = useRouter()
const activeNav = ref('settings')
const activeTab = ref('profile') // New state for tabs

const userProfile = ref(null)
const loading = ref(true)
const saving = ref(false)

const fileInput = ref(null)
const uploadingPhoto = ref(false)
const updatingPassword = ref(false)

const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const passwordForm = ref({
  current: '',
  new: '',
  confirm: ''
})

const form = ref({
  firstName: '',
  lastName: '',
  username: '',
  dateOfBirth: '',
  age: '',
  gender: '',
  email: '',
  phone: '',
  alternativeEmail: '',
  address: {
    streetAddress: '',
    city: '',
    province: '',
    postalCode: '',
    country: ''
  }
})

const userDisplayName = computed(() => {
  if (!userProfile.value) return ''
  const { firstName, lastName, name, fullName, displayName, username } = userProfile.value
  if (firstName || lastName) {
    return `${firstName || ''} ${lastName || ''}`.trim()
  }
  return name || fullName || displayName || username || ''
})

const userEmail = computed(() => {
  if (!userProfile.value) return ''
  return userProfile.value.email || userProfile.value.emailAddress || userProfile.value.username || ''
})

const userRole = computed(() => {
  if (!userProfile.value) return 'user'
  return userProfile.value.role || 'user'
})

const userPhotoUrl = computed(() => {
  return userProfile.value?.photoUrl || userProfile.value?.photoURL || userProfile.value?.avatarUrl || userProfile.value?.profilePicture || userProfile.value?.profileImage || ''
})

const triggerFileInput = () => {
  if (!uploadingPhoto.value && fileInput.value) {
    fileInput.value.click()
  }
}

const handlePhotoUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  const id = getCurrentUserId()
  if (!id) return

  try {
    uploadingPhoto.value = true
    
    // Create a reference to the file in Firebase Storage profilePhotos folder
    const photoRef = storageRef(storage, `profilePhotos/${id}_${Date.now()}_${file.name}`)
    
    // Upload the file
    await uploadBytes(photoRef, file)
    
    // Get the download URL
    const downloadURL = await getDownloadURL(photoRef)
    
    // Update Firestore document with new URL
    const userDocRef = doc(db, 'users', String(id))
    await updateDoc(userDocRef, {
      photoUrl: downloadURL
    })
    
    // Update local state to reflect the change immediately
    if (userProfile.value) {
      userProfile.value.photoUrl = downloadURL
    }
    
    // alert('Profile picture updated successfully!')
  } catch (error) {
    console.error('Error uploading profile picture:', error)
    alert('Failed to upload profile picture. Please try again.')
  } finally {
    uploadingPhoto.value = false
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}

const resetPhoto = async () => {
  const id = getCurrentUserId()
  if (!id) return
  
  try {
    uploadingPhoto.value = true
    
    // Update Firestore document to remove photo URL
    const userDocRef = doc(db, 'users', String(id))
    await updateDoc(userDocRef, {
      photoUrl: '' // or null based on your preference
    })
    
    // Update local state
    if (userProfile.value) {
      userProfile.value.photoUrl = ''
    }
  } catch (error) {
    console.error('Error resetting profile picture:', error)
    alert('Failed to reset profile picture. Please try again.')
  } finally {
    uploadingPhoto.value = false
  }
}

const updatePassword = async () => {
  if (!passwordForm.value.current || !passwordForm.value.new || !passwordForm.value.confirm) {
    alert('Please fill in all password fields.')
    return
  }
  
  if (passwordForm.value.new !== passwordForm.value.confirm) {
    alert('New password and confirm password do not match.')
    return
  }

  const id = getCurrentUserId()
  if (!id) {
    alert('Unable to identify user ID.')
    return
  }

  try {
    updatingPassword.value = true
    
    // Check current password from Firestore
    const userRef = doc(db, 'users', String(id))
    const userSnap = await getDoc(userRef)
    
    if (!userSnap.exists()) {
      alert('User document not found.')
      return
    }
    
    const userData = userSnap.data()
    
    // Note: In a production app, passwords should NEVER be stored as plain text.
    // They should be hashed (e.g., using bcrypt) on the server side.
    // Since this project seems to store them directly based on the context:
    if (userData.password !== passwordForm.value.current) {
      alert('Current password is incorrect.')
      return
    }
    
    // Update the password in Firestore
    await updateDoc(userRef, {
      password: passwordForm.value.new
    })
    
    alert('Password updated successfully!')
    
    passwordForm.value.current = ''
    passwordForm.value.new = ''
    passwordForm.value.confirm = ''
  } catch (error) {
    console.error('Error updating password:', error)
    alert('Failed to update password. Please check your connection and try again.')
  } finally {
    updatingPassword.value = false
  }
}

const userInitials = computed(() => {
  const name = userDisplayName.value || userEmail.value
  if (!name) return ''
  const parts = String(name).trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase()
  return (parts[0].slice(0, 1) + parts[parts.length - 1].slice(0, 1)).toUpperCase()
})

const resolveStaffLocal = () => {
  const keys = ['user', 'staffUser']
  for (const k of keys) {
    const raw = localStorage.getItem(k)
    if (!raw) continue
    try {
      const parsed = JSON.parse(raw)
      const resolved = parsed?.user ? parsed.user : parsed
      if (resolved) return resolved
    } catch {
      // ignore
    }
  }
  return null
}

const getCurrentUserId = () => {
  const staffLocal = resolveStaffLocal()
  return staffLocal?.uid || staffLocal?.id || staffLocal?.staffId || staffLocal?._id || null
}

const fetchUserProfile = async () => {
  loading.value = true
  const id = getCurrentUserId()
  if (!id) {
    userProfile.value = null
    loading.value = false
    return
  }
  try {
    const snap = await getDoc(doc(db, 'users', String(id)))
    if (snap.exists()) {
      const data = snap.data()
      userProfile.value = { id: snap.id, ...data }
      
      form.value = {
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        username: data.username || '',
        dateOfBirth: data.dateOfBirth || '',
        age: data.age || '',
        gender: data.gender || '',
        email: data.email || data.emailAddress || '',
        phone: data.phone || data.contactNumber || '',
        alternativeEmail: data.alternativeEmail || '',
        address: {
          streetAddress: data.address?.streetAddress || data.streetAddress || '',
          city: data.address?.city || data.city || '',
          province: data.address?.province || data.province || '',
          postalCode: data.address?.postalCode || data.postalCode || '',
          country: data.address?.country || data.country || ''
        }
      }
    } else {
      userProfile.value = null
    }
  } catch (e) {
    console.error('Failed to load user profile from Firestore users collection:', e)
    userProfile.value = null
  } finally {
    loading.value = false
  }
}

const saveChanges = async () => {
  saving.value = true
  try {
    const id = getCurrentUserId()
    if (!id) throw new Error('No user ID found')
    
    const userRef = doc(db, 'users', String(id))
    
    const updateData = {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      username: form.value.username,
      dateOfBirth: form.value.dateOfBirth,
      age: form.value.age,
      gender: form.value.gender,
      phone: form.value.phone,
      alternativeEmail: form.value.alternativeEmail,
      address: {
        streetAddress: form.value.address.streetAddress,
        city: form.value.address.city,
        province: form.value.address.province,
        postalCode: form.value.address.postalCode,
        country: form.value.address.country
      }
    }
    
    await updateDoc(userRef, updateData)
    await fetchUserProfile()
    // Optional: show a small toast or visually confirm saving here.
  } catch (error) {
    console.error('Error saving profile changes:', error)
    alert('Failed to save changes. Please try again.')
  } finally {
    saving.value = false
  }
}

const navigateTo = (routeName, navItem) => {
  activeNav.value = navItem
  router.push({ name: routeName })
}

onMounted(() => {
  fetchUserProfile()
})
</script>
