<template>
  <div class="flex h-screen bg-[#f5f5f5] font-sans antialiased text-gray-900">
    <!-- Sidebar -->
    <aside class="w-[260px] bg-white/95 backdrop-blur-xl border-r border-gray-200 py-8 px-5 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
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
    <main class="flex-1 flex flex-col relative min-w-0 overflow-hidden z-0">
      <!-- Top Header -->
      <header class="bg-white border-b border-gray-200 px-8 py-5 flex justify-between items-center z-20 sticky top-0">
        <div class="flex flex-col">
          <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Attendance Logs</h1>
          <p class="text-sm text-gray-500 mt-1">Review your attendance history</p>
        </div>
        <div class="flex items-center gap-6">
          <div class="flex items-center gap-3 pl-6 border-l border-gray-200">
            <button class="relative p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-200">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <span class="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div ref="avatarWrapEl" class="relative">
              <button class="w-10 h-10 rounded-full bg-blue-100 border-2 border-white shadow-sm flex items-center justify-center text-blue-700 font-bold overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all hover:scale-105" type="button" @click="toggleAvatarMenu" aria-haspopup="true" :aria-expanded="avatarMenuOpen">
                <img v-if="userPhotoUrl" :src="userPhotoUrl" class="w-full h-full object-cover" alt="Profile" />
                <span v-else class="text-sm tracking-wider">{{ userInitials || 'U' }}</span>
              </button>

              <!-- Dropdown Menu -->
              <div v-if="avatarMenuOpen" class="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 transform origin-top-right transition-all">
                <div class="p-4 border-b border-gray-100 bg-gray-50/50 cursor-pointer hover:bg-gray-100 transition-colors" @click="goToSettings">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold overflow-hidden shrink-0">
                      <img v-if="userPhotoUrl" :src="userPhotoUrl" class="w-full h-full object-cover" alt="Profile" />
                      <span v-else class="text-base tracking-wider">{{ userInitials || 'U' }}</span>
                    </div>
                    <div class="min-w-0">
                      <p class="text-sm font-bold text-gray-900 truncate">{{ userDisplayName || 'User' }}</p>
                      <p class="text-xs text-gray-500 truncate mt-0.5">{{ userEmail || '' }}</p>
                    </div>
                  </div>
                </div>
                <div class="p-2">
                  <button @click="goToSettings" class="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-100 hover:text-gray-900 transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400">
                      <circle cx="12" cy="12" r="3"></circle>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                    Settings
                  </button>
                  <button @click="logout" class="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors mt-1">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-500">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Log Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <div class="flex-1 overflow-y-auto p-4 sm:p-8">
        <div class="max-w-7xl mx-auto space-y-6">
          
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-2">
            <div>
              <h2 class="text-2xl font-bold text-gray-900">Attendance Records</h2>
              <p class="text-sm text-gray-500 mt-1">View and manage your attendance logs</p>
            </div>
              <div class="flex flex-col sm:flex-row gap-3">
                <!-- Month/Year Selection -->
                <div class="relative" ref="filterToggleEl">
                  <button @click="isFilterMenuOpen = !isFilterMenuOpen" class="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm h-full whitespace-nowrap">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    {{ months[selectedMonth] }} {{ selectedYear }}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" :class="{'rotate-180': isFilterMenuOpen}" class="transition-transform duration-200 ml-1">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>

                  <div v-if="isFilterMenuOpen" class="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 p-4 animate-[fadeIn_0.2s_ease-out]">
                    <div class="space-y-4">
                      <div>
                        <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block ml-1">Select Month</label>
                        <div class="grid grid-cols-3 gap-1">
                          <button v-for="(m, index) in months" :key="m" 
                                  @click="selectedMonth = index; isFilterMenuOpen = false"
                                  :class="selectedMonth === index ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'text-gray-600 hover:bg-gray-100'"
                                  class="py-1.5 text-[11px] font-bold rounded-lg transition-all">
                            {{ m.slice(0, 3) }}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block ml-1">Select Year</label>
                        <select v-model="selectedYear" @change="isFilterMenuOpen = false" class="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all">
                          <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Search Filter -->
                <div class="relative max-w-xs w-full">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-400">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </div>
                  <input type="text" v-model="searchQuery" placeholder="Search records..." class="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full transition-shadow h-full">
                </div>
              
              <div class="flex items-center gap-2">
                <!-- DTR Export -->
                <button @click="exportDTR" class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-sm font-semibold hover:bg-blue-100 transition-colors shadow-sm" title="Export as DTR (Form 48)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                  Export DTR
                </button>
  
                <button @click="refreshAttendances" class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M23 4v6h-6"></path>
                    <path d="M1 20v-6h6"></path>
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                  </svg>
                  Refresh
                </button>
              </div>
            </div>
          </div>

          <!-- Main Panel -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            
            <div v-if="loading" class="py-20 flex flex-col items-center justify-center">
              <div class="animate-spin rounded-full h-10 w-10 border-4 border-blue-100 border-t-blue-600 mb-4"></div>
              <p class="text-gray-500 font-medium">Loading attendance records...</p>
            </div>
            
            <div v-else-if="error" class="py-20 flex flex-col items-center justify-center text-center px-4">
              <div class="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              </div>
              <p class="text-gray-900 font-bold mb-2">Failed to load data</p>
              <p class="text-gray-500 mb-6 max-w-md">{{ error }}</p>
              <button @click="refreshAttendances" class="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">Try Again</button>
            </div>
            
            <div v-else-if="attendances.length === 0" class="py-20 flex flex-col items-center justify-center text-center px-4">
              <div class="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              </div>
              <p class="text-gray-900 font-bold mb-1">No records found</p>
              <p class="text-gray-500">You don't have any attendance records yet.</p>
            </div>
            
            <div v-else class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-gray-50/80 border-b border-gray-200">
                    <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Date</th>
                    <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Time In</th>
                    <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Time Out</th>
                    <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                    <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Location</th>
                    <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr v-for="attendance in paginatedAttendances" :key="attendance.id" class="hover:bg-blue-50/30 transition-colors group">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div v-if="attendance.status === 'Leave' && attendance.leaveStartDate" class="font-medium text-gray-900 text-xs">
                        {{ formatDate(attendance.leaveStartDate) }} - {{ formatDate(attendance.leaveEndDate) }}
                      </div>
                      <div v-else>
                        <div class="font-medium text-gray-900">{{ formatDate(attendance.date) }}</div>
                        <div class="text-xs text-gray-500 mt-0.5" v-if="attendance.type">{{ attendance.type }} Shift</div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span v-if="attendance.status === 'Leave'" class="text-sm text-gray-400 font-medium">N/A</span>
                      <div v-else class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-sm font-medium border border-emerald-100">
                        {{ formatTime(attendance.timeIn) }}
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span v-if="attendance.status === 'Leave'" class="text-sm text-gray-400 font-medium">N/A</span>
                      <template v-else>
                        <div v-if="attendance.timeOut" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-50 text-orange-700 text-sm font-medium border border-orange-100">
                          {{ formatTime(attendance.timeOut) }}
                        </div>
                        <span v-else class="text-sm text-gray-400 italic">Not clocked out</span>
                      </template>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shrink-0"
                            :class="{
                              'bg-emerald-100 text-emerald-800': getStatusClass(attendance) === 'present' && attendance.status !== 'On Field' && attendance.status !== 'Leave',
                              'bg-blue-100 text-blue-800': attendance.status === 'On Field',
                              'bg-purple-100 text-purple-800': attendance.status === 'Travel' || getStatusClass(attendance) === 'late',
                              'bg-red-100 text-red-800': getStatusClass(attendance) === 'absent',
                              'bg-emerald-100 text-emerald-800': attendance.status === 'Leave'
                            }">
                        <div class="w-1.5 h-1.5 rounded-full"
                             :class="{
                               'bg-emerald-500': getStatusClass(attendance) === 'present' && attendance.status !== 'On Field' && attendance.status !== 'Leave',
                               'bg-blue-500': attendance.status === 'On Field',
                               'bg-purple-500': attendance.status === 'Travel' || getStatusClass(attendance) === 'late',
                               'bg-red-500': getStatusClass(attendance) === 'absent',
                               'bg-emerald-500': attendance.status === 'Leave'
                             }"></div>
                        {{ attendance.status || 'At Office' }}
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      <div class="text-sm text-gray-600 line-clamp-2 max-w-xs" :title="formatLocation(attendance)">
                        {{ formatLocation(attendance) }}
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right">
                      <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" @click="viewAttendance(attendance)" title="View Details">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </button>
                        <button v-if="!attendance.timeOut" class="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors" @click="timeOutAttendance(attendance)" title="Time Out">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div v-if="!loading && !error && attendances.length > 0" class="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
              <span class="text-sm text-gray-500">
                Showing <span class="font-medium text-gray-900">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> to <span class="font-medium text-gray-900">{{ Math.min(currentPage * itemsPerPage, filteredAttendances.length) }}</span> of <span class="font-medium text-gray-900">{{ filteredAttendances.length }}</span> records
              </span>
              
              <div class="flex gap-2">
                <button @click="prevPage" :disabled="currentPage === 1" class="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  Previous
                </button>
                <div class="flex items-center gap-1">
                  <span class="px-3 py-2 text-sm font-medium text-gray-700">Page {{ currentPage }} of {{ totalPages || 1 }}</span>
                </div>
                <button @click="nextPage" :disabled="currentPage >= totalPages" class="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  Next
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  </div>
</template>


<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useStaffAttendanceStore } from '../../stores/staffAttendanceStore.js'
import { GOOGLE_MAPS_API_KEY, GOOGLE_MAPS_EMBED_URL, db } from '../../firebase.js'
import { doc, getDoc } from 'firebase/firestore'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

const router = useRouter()
const staffAttendanceStore = useStaffAttendanceStore()

// Reactive data
const activeTab = ref('current')
const activeNav = ref('attendance-logs')

const avatarWrapEl = ref(null)
const avatarMenuOpen = ref(false)

const isFilterMenuOpen = ref(false)
const filterToggleEl = ref(null)

const selectedMonth = ref(new Date().getMonth())
const selectedYear = ref(new Date().getFullYear())
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]
const years = computed(() => {
  const current = new Date().getFullYear()
  const start = current - 5
  const end = current + 1
  const result = []
  for (let i = end; i >= start; i--) result.push(i)
  return result
})

const userProfile = ref(null)

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

const userPhotoUrl = computed(() => {
  return userProfile.value?.photoUrl || userProfile.value?.photoURL || userProfile.value?.avatarUrl || userProfile.value?.profilePicture || userProfile.value?.profileImage || ''
})

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
  const id = getCurrentUserId()
  if (!id) {
    userProfile.value = null
    return
  }

  try {
    const snap = await getDoc(doc(db, 'users', String(id)))
    userProfile.value = snap.exists() ? { id: snap.id, ...snap.data() } : null
  } catch (e) {
    console.error('Failed to load user profile from Firestore users collection:', e)
    userProfile.value = null
  }
}

const toggleAvatarMenu = () => {
  avatarMenuOpen.value = !avatarMenuOpen.value
}

const closeAvatarMenu = () => {
  avatarMenuOpen.value = false
}

const onDocClick = (e) => {
  // Close avatar menu if open
  if (avatarMenuOpen.value) {
    const root = avatarWrapEl.value
    if (root && !root.contains(e.target)) {
      closeAvatarMenu()
    }
  }
  
  // Close filter menu if open
  if (isFilterMenuOpen.value) {
    const filterRoot = filterToggleEl.value
    if (filterRoot && !filterRoot.contains(e.target)) {
      isFilterMenuOpen.value = false
    }
  }
}

const goToSettings = () => {
  closeAvatarMenu()
  router.push({ name: 'StaffSettings' })
}

const logout = () => {
  closeAvatarMenu()
  localStorage.removeItem('user')
  localStorage.removeItem('staffUser')
  router.push({ name: 'Login' })
}

// Computed properties - transform staff attendance data for display
const attendances = computed(() => {
  const staffAttendances = staffAttendanceStore.staffAttendances
  
  // Transform staff attendance data to match the table format
  const transformedAttendances = []
  
  staffAttendances.forEach(staffAttendance => {
    // Handle the case where the whole day has a status (like 'Leave' or 'Absent')
    if ((staffAttendance.staffStatus === 'Leave' || staffAttendance.staffStatus === 'Absent') && !staffAttendance.timeInAM && !staffAttendance.timeInPM) {
      transformedAttendances.push({
        id: staffAttendance.id + '_status',
        date: staffAttendance.date,
        timeIn: null,
        timeOut: null,
        status: staffAttendance.staffStatus,
        leaveStartDate: staffAttendance.leaveStartDate,
        leaveEndDate: staffAttendance.leaveEndDate,
        leaveDocumentUrl: staffAttendance.leaveDocumentUrl,
        type: 'Full Day',
        originalId: staffAttendance.id
      })
      return
    }

    // Add AM attendance if exists
    if (staffAttendance.timeInAM) {
      transformedAttendances.push({
        id: staffAttendance.id + '_am',
        date: staffAttendance.date,
        timeIn: staffAttendance.timeInAM,
        timeOut: staffAttendance.timeOutAM,
        status: staffAttendance.staffStatusAM || staffAttendance.statusAM || (staffAttendance.staffStatus === 'Leave' ? 'Leave' : null),
        location: staffAttendance.LocAM || staffAttendance.locationAM,
        address: staffAttendance.LocAM?.address,
        photoUrl: staffAttendance.photoUrl,
        leaveStartDate: staffAttendance.leaveStartDate,
        leaveEndDate: staffAttendance.leaveEndDate,
        type: 'AM',
        originalId: staffAttendance.id
      })
    }
    
    // Add PM attendance if exists
    if (staffAttendance.timeInPM) {
      transformedAttendances.push({
        id: staffAttendance.id + '_pm',
        date: staffAttendance.date,
        timeIn: staffAttendance.timeInPM,
        timeOut: staffAttendance.timeOutPM,
        status: staffAttendance.staffStatusPM || staffAttendance.statusPM || (staffAttendance.staffStatus === 'Leave' ? 'Leave' : null),
        location: staffAttendance.LocPM || staffAttendance.locationPM,
        address: staffAttendance.LocPM?.address || staffAttendance.address,
        photoUrl: staffAttendance.photoUrl,
        leaveStartDate: staffAttendance.leaveStartDate,
        leaveEndDate: staffAttendance.leaveEndDate,
        type: 'PM',
        originalId: staffAttendance.id
      })
    }
  })
  
  // Sort by date (newest first)
  return transformedAttendances.sort((a, b) => new Date(b.date) - new Date(a.date))
})

const loading = computed(() => staffAttendanceStore.loading)
const error = computed(() => staffAttendanceStore.error)

// --- Pagination & Filtering State ---
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)

const filteredAttendances = computed(() => {
  let filtered = attendances.value

  // Filter by Month and Year
  filtered = filtered.filter(att => {
    if (!att.date) return false
    const d = new Date(att.date)
    return d.getMonth() === selectedMonth.value && d.getFullYear() === selectedYear.value
  })

  if (!searchQuery.value) return filtered
  
  const query = searchQuery.value.toLowerCase()
  return filtered.filter(att => 
    (att.date && att.date.toLowerCase().includes(query)) ||
    (att.status && att.status.toLowerCase().includes(query)) ||
    (att.type && att.type.toLowerCase().includes(query)) ||
    (att.address && att.address.toLowerCase().includes(query))
  )
})

const totalPages = computed(() => Math.ceil(filteredAttendances.value.length / itemsPerPage.value))

const paginatedAttendances = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredAttendances.value.slice(start, end)
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const getMonthYearString = () => {
  return `${months[selectedMonth.value]} ${selectedYear.value}`
}

const parseMilitaryTime = (timeStr) => {
  if (!timeStr) return ''
  const t = new Date(timeStr)
  if (!isNaN(t)) {
    let hours = t.getHours()
    let mins = t.getMinutes()
    let period = hours >= 12 ? 'PM' : 'AM'
    
    // Convert 24h to 12h
    hours = hours % 12
    hours = hours ? hours : 12
    
    // Format mm
    mins = mins < 10 ? '0' + mins : mins
    return `${hours}:${mins}`
  }
  return timeStr // Pass-through if already string format
}

// Function to draw a single DTR Panel.
const drawDTRPanel = (doc, startX, width) => {
  // Title text sizes scaling
  const centerLine = startX + (width / 2)
  
  doc.setFont('times', 'italic')
  doc.setFontSize(8)
  doc.text('Civil Service Form No. 48', startX + 5, 12)
  
  doc.setFont('times', 'bold')
  doc.setFontSize(14)
  doc.text('DAILY TIME RECORD', centerLine, 18, { align: 'center' })
  
  doc.setFontSize(10)
  doc.text('-----', centerLine, 22, { align: 'center' })
  
  // User Name
  const userFullName = userDisplayName.value || 'User Name'
  doc.setFontSize(11)
  doc.text(userFullName.toUpperCase(), centerLine, 27, { align: 'center' })
  
  // Name underline
  doc.setLineWidth(0.3)
  doc.line(startX + 10, 28, startX + width - 10, 28)
  
  // Month underline config
  doc.setFont('times', 'normal')
  doc.setFontSize(9)
  doc.text('For the month of ', startX + 5, 33)
  
  doc.setFont('times', 'bold')
  const monthString = getMonthYearString()
  const textWidth = doc.getTextWidth(monthString)
  doc.text(monthString, startX + 31, 33)
  doc.setLineWidth(0.3)
  doc.line(startX + 31, 34, startX + 31 + textWidth, 34)
  
  doc.setFont('times', 'normal')
  doc.setFontSize(8)
  doc.text('Official hours of arrival\nand departure', startX + 5, 37)
  
  doc.text('Regular days __________\nSaturdays ___________', startX + (width - 40), 37)
  
  // Prepare Table logic (1 to 31)
  const daysInMonth = 31 // Assume 31 for full form view or derive exact days based on month
  const tableDataArr = []
  
  // Convert filtered logs into a Date -> Log map for easy lookup
  const attendanceMap = {}
  filteredAttendances.value.forEach(record => {
    // Only map if date exists, using 'YYYY-MM-DD' key
    if (record.date) {
      const d = new Date(record.date)
      // Check if Date is valid
      if (!isNaN(d)) {
        const dayNum = d.getDate()
        if (!attendanceMap[dayNum]) attendanceMap[dayNum] = {}
        // Assign AM/PM components via type
        attendanceMap[dayNum][record.type] = {
           timeIn: record.timeIn,
           timeOut: record.timeOut
        }
      }
    }
  })

  // Detect exact month/year
  const refYear = selectedYear.value
  const refMonth = selectedMonth.value

  for (let i = 1; i <= daysInMonth; i++) {
    const curDate = new Date(refYear, refMonth, i)
    const isSaturday = curDate.getDay() === 6
    const isSunday = curDate.getDay() === 0
    // Skip extra days if month < 31
    if (curDate.getMonth() !== refMonth) {
      tableDataArr.push([i.toString(), '', '', '', '', '', '']) // Exceeds month, blank
      continue
    }

    if (isSaturday) {
      tableDataArr.push([{ content: i.toString(), styles: { fontStyle: 'bold' } }, { content: 'SATURDAY', colSpan: 6, styles: { align: 'center', fontStyle: 'bolditalic', textColor: [100, 100, 100] } }])
    } else if (isSunday) {
      tableDataArr.push([{ content: i.toString(), styles: { fontStyle: 'bold' } }, { content: 'SUNDAY', colSpan: 6, styles: { align: 'center', fontStyle: 'bolditalic', textColor: [100, 100, 100] } }])
    } else {
      // Normal Weekday row
      const logs = attendanceMap[i] || {}
      
      const amIn = logs['AM']?.timeIn ? parseMilitaryTime(logs['AM'].timeIn) : ''
      const amOut = logs['AM']?.timeOut ? parseMilitaryTime(logs['AM'].timeOut) : ''
      const pmIn = logs['PM']?.timeIn ? parseMilitaryTime(logs['PM'].timeIn) : ''
      const pmOut = logs['PM']?.timeOut ? parseMilitaryTime(logs['PM'].timeOut) : ''
      
      tableDataArr.push([i.toString(), amIn, amOut, pmIn, pmOut, '', ''])
    }
  }
  
  // Add Total Row
  tableDataArr.push([{ content: 'Total', styles: { fontStyle: 'bold', halign: 'center' } }, '', '', '', '', '', ''])

  // AutoTable Config for custom nested headers
  autoTable(doc, {
    margin: { left: startX + 5 },
    tableWidth: width - 10,
    startY: 42,
    theme: 'plain',
    styles: { 
      fontSize: 7, 
      cellPadding: 1, 
      lineColor: [0, 0, 0], 
      lineWidth: 0.2, 
      halign: 'center', 
      valign: 'middle',
      font: 'times'
    },
    headStyles: { fontStyle: 'bold' },
    columns: [
      { header: 'Day', dataKey: 'day' },
      { header: 'Arrival', dataKey: 'am_arr' },
      { header: 'Departure', dataKey: 'am_dep' },
      { header: 'Arrival', dataKey: 'pm_arr' },
      { header: 'Departure', dataKey: 'pm_dep' },
      { header: 'Hours', dataKey: 'ut_hrs' },
      { header: 'Minutes', dataKey: 'ut_min' },
    ],
    // The trick to span subheaders
    head: [
       [
         { content: 'Day', rowSpan: 2, styles: { valign: 'middle' } },
         { content: 'A.M.', colSpan: 2 },
         { content: 'P.M.', colSpan: 2 },
         { content: 'Undertime', colSpan: 2 },
       ],
       ['Arrival', 'Departure', 'Arrival', 'Departure', 'Hours', 'Minutes']
    ],
    body: tableDataArr,
    didDrawCell: function(data) {
       // Allow overriding specific cell styles dynamically if necessary
    }
  })
  
  const finalY = doc.lastAutoTable.finalY || 240
  
  // Footer 1 - Certification paragraph
  doc.setFontSize(8)
  doc.setFont('times', 'normal')
  const certText = "I certify on my honor that the above is a true and correct report of the hours of work performed, record of which was made daily at the time of arrival and departure from office."
  // SplitTextToSize ensures the paragraph wraps within the panel
  const splitCert = doc.splitTextToSize(certText, width - 10)
  doc.text(splitCert, startX + 5, finalY + 5)
  
  // Signature Lines
  doc.setFontSize(8)
  doc.setFont('times', 'normal')
  const finalSigY = finalY + 30
  
  // Staff Signature
  doc.text(userFullName, centerLine, finalSigY, { align: 'center' })
  doc.setLineWidth(0.3)
  doc.line(startX + 15, finalSigY + 1, startX + width - 15, finalSigY + 1)
  doc.setFont('times', 'italic')
  doc.text('OJT Intern', centerLine, finalSigY + 4, { align: 'center' })
  
  // Officer Signature
  const officerY = finalSigY + 15
  doc.setFont('times', 'bold')
  doc.text('ENGR. MARVIN D. BEJASA', centerLine, officerY, { align: 'center' })
  doc.setLineWidth(0.3)
  doc.line(startX + 15, officerY + 1, startX + width - 15, officerY + 1)
  doc.setFont('times', 'normal')
  doc.text('OIC - Provincial Officer', centerLine, officerY + 4, { align: 'center' })
  doc.setFont('times', 'italic')
  doc.text('In-Charge', centerLine, officerY + 7, { align: 'center' })
}

const exportDTR = () => {
  // Use jsPDF directly, default is portrait, A4. (210 x 297 mm)
  const doc = new jsPDF('portrait', 'mm', 'a4')
  
  const pageWidth = doc.internal.pageSize.getWidth() // 210
  const panelWidth = pageWidth / 2 // 105 per panel
  
  // Draw left panel
  drawDTRPanel(doc, 0, panelWidth)
  
  // Draw right panel with offset
  drawDTRPanel(doc, panelWidth, panelWidth)

  // Set the PDF to automatically open the print dialog when opened
  doc.autoPrint()
  
  // Create a blob URL to open in a new tab for printing, or just save it
  const blob = doc.output('bloburl')
  window.open(blob, '_blank')
}
// --- End Pagination & Filtering ---

// Navigation function
const navigateTo = (routeName, navItem) => {
  activeNav.value = navItem
  router.push({ name: routeName })
}

// Fetch attendances
const fetchAttendances = async () => {
  try {
    const staffId = getCurrentUserId()
    if (!staffId) return
    await staffAttendanceStore.getStaffAttendancesByStaffId(staffId)
  } catch (err) {
    console.error('Failed to fetch attendances:', err)
  }
}

// Refresh attendances
const refreshAttendances = () => {
  fetchAttendances()
}

// Format date
const formatDate = (date) => {
  if (!date) return 'N/A'
  
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date.trim())) {
    const [year, month, day] = date.split('-').map(Number)
    const dateObj = new Date(year, month - 1, day)
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  let dateObj = null
  if (date?.toDate) {
    dateObj = date.toDate()
  } else if (date instanceof Date) {
    dateObj = date
  } else if (typeof date === 'string') {
    dateObj = new Date(date)
  }
  
  if (!dateObj) return 'N/A'
  
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Format location
const formatLocation = (attendance) => {
  if (attendance.address) return attendance.address
  if (typeof attendance.location === 'string') return attendance.location
  if (attendance.location?.address) return attendance.location.address
  return 'N/A'
}

// Format time
const formatTime = (time) => {
  if (!time) return 'N/A'
  
  if (typeof time === 'string' && /^\d{1,2}:\d{2}(:\d{2})?$/.test(time.trim())) {
    const parts = time.trim().split(':')
    const hours = parseInt(parts[0], 10)
    const minutes = parseInt(parts[1], 10)
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12
    const displayMinutes = minutes.toString().padStart(2, '0')
    return `${displayHours}:${displayMinutes} ${ampm}`
  }

  let timeObj = null
  if (time?.toDate) {
    timeObj = time.toDate()
  } else if (time instanceof Date) {
    timeObj = time
  } else if (typeof time === 'string') {
    const parsed = new Date(time)
    if (!isNaN(parsed.getTime())) {
      timeObj = parsed
    }
  }
  
  if (!timeObj || isNaN(timeObj.getTime())) return 'N/A'
  
  return timeObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Get status class
const getStatusClass = (attendance) => {
  const status = attendance.status?.toLowerCase() || 'office'
  switch (status) {
    case 'at office':
    case 'office':
      return 'present'
    case 'on field':
    case 'field':
      return 'present'
    case 'leave':
      return 'absent'
    case 'absent':
      return 'absent'
    case 'travel':
      return 'late'
    default:
      return 'present'
  }
}

// View attendance details
const viewAttendance = (attendance) => {
  console.log('View attendance:', attendance)
  // TODO: Implement view modal or navigate to details page
}

// Time out attendance
const timeOutAttendance = async (attendance) => {
  try {
    const attendanceData = {
      location: null,
      notes: 'Manual time out from logs'
    }
    
    // Determine if it's AM or PM attendance and use appropriate method
    if (attendance.type === 'AM') {
      await staffAttendanceStore.clockOutAM(attendance.originalId, attendanceData)
    } else if (attendance.type === 'PM') {
      await staffAttendanceStore.clockOutPM(attendance.originalId, attendanceData)
    }
    
    // Refresh the list
    await fetchAttendances()
    
    // Show success notification
    showNotification('Time out recorded successfully!', 'success')
  } catch (err) {
    console.error('Failed to time out:', err)
    showNotification('Failed to record time out', 'error')
  }
}

// Show notification
const showNotification = (message, type = 'info') => {
  const notification = document.createElement('div')
  notification.className = `notification notification-${type}`
  notification.textContent = message
  
  document.body.appendChild(notification)
  
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification)
    }
  }, 3000)
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', onDocClick)
  fetchUserProfile()
  fetchAttendances()
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
})
</script>
