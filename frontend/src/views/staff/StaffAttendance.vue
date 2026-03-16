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
          <h1 class="text-2xl font-bold text-gray-900 tracking-tight">My Attendance</h1>
          <p class="text-sm text-gray-500 mt-1">Mark your attendance and track your work hours</p>
        </div>
        <div class="flex items-center gap-6">
          <div class="text-right hidden sm:block">
            <div class="text-2xl font-bold text-gray-900 tabular-nums">{{ currentTime }}</div>
            <div class="text-xs text-gray-500 font-medium mt-0.5">{{ currentDate }}</div>
          </div>
          <div class="flex items-center gap-3 pl-6 border-l border-gray-200">
            <div ref="avatarWrapEl" class="relative">
              <button class="w-10 h-10 rounded-full bg-blue-100 border-2 border-white shadow-sm flex items-center justify-center text-blue-700 font-bold overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all hover:scale-105" type="button" @click="toggleAvatarMenu" aria-haspopup="true" :aria-expanded="avatarMenuOpen">
                <img v-if="userPhotoUrl" :src="userPhotoUrl" class="w-full h-full object-cover" alt="Profile" />
                <span v-else class="text-sm tracking-wider">{{ userInitials || 'U' }}</span>
              </button>

              <!-- Dropdown Menu -->
              <div v-if="avatarMenuOpen" class="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 transform origin-top-right transition-all">
                <div class="p-4 border-b border-gray-100 bg-gray-50/50">
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
        <div class="max-w-[1400px] mx-auto space-y-8">
          
          <!-- Status and Actions Grid -->
          <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <!-- Status Selection Panel -->
            <div class="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col relative overflow-hidden">
              <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full opacity-50 -z-0"></div>
              
              <div class="flex justify-between items-start mb-8 relative z-10">
                <div>
                  <h3 class="text-xl font-bold text-gray-900">Current Status</h3>
                  <p class="text-sm text-gray-500 mt-1">Select your working location</p>
                </div>
                <div class="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg relative"
                     :class="{
                       'bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-emerald-500/30': selectedStatus === 'At Office',
                       'bg-gradient-to-br from-blue-400 to-blue-600 shadow-blue-500/30': selectedStatus === 'On Field',
                       'bg-gradient-to-br from-purple-400 to-purple-600 shadow-purple-500/30': selectedStatus === 'Travel',
                       'bg-gradient-to-br from-orange-400 to-orange-600 shadow-orange-500/30': selectedStatus === 'Leave',
                       'bg-gradient-to-br from-red-400 to-red-600 shadow-red-500/30': selectedStatus === 'Absent'
                     }">
                  <div class="absolute inset-0 rounded-2xl animate-ping opacity-20 bg-white"></div>
                  <span class="relative z-10 filter drop-shadow-md">{{ getStatusEmoji(selectedStatus) }}</span>
                </div>
              </div>
              
              <div class="bg-gray-50/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100/50 mt-auto relative z-10">
                <div class="flex items-center justify-between mb-5">
                  <span class="text-sm font-semibold text-gray-500 uppercase tracking-wider">You are currently</span>
                  <span class="px-4 py-1.5 bg-white rounded-full text-sm font-bold text-gray-900 shadow-sm border border-gray-100 flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full"
                          :class="{
                            'bg-emerald-500': selectedStatus === 'At Office',
                            'bg-blue-500': selectedStatus === 'On Field',
                            'bg-purple-500': selectedStatus === 'Travel',
                            'bg-orange-500': selectedStatus === 'Leave',
                            'bg-red-500': selectedStatus === 'Absent'
                          }"></span>
                    {{ selectedStatus }}
                  </span>
                </div>
                
                <div class="space-y-2">
                  <label for="status-select" class="block text-sm font-medium text-gray-700 ml-1">Change Status</label>
                  <div class="relative">
                    <select id="status-select" v-model="selectedStatus" @change="onStatusChange" 
                            class="block w-full rounded-xl border-gray-200 bg-white px-4 py-3.5 text-gray-900 font-medium shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer hover:border-blue-300">
                      <option value="At Office">🏢 At Office</option>
                      <option value="On Field">📍 On Field</option>
                      <option value="Travel">✈️ Travel</option>
                      <option value="Leave">🏖️ Leave</option>
                      <option value="Absent">❌ Absent</option>
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                      <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Attendance Actions Panel -->
            <div class="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col relative overflow-hidden">
              <div class="flex justify-between items-start mb-6">
                <div>
                  <h3 class="text-xl font-bold text-gray-900">Quick Actions</h3>
                  <p class="text-sm text-gray-500 mt-1">Record your attendance</p>
                </div>
                <!-- Clock Status Badge -->
                <div class="flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm shadow-sm border transition-all duration-300"
                     :class="isClockedIn ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-gray-50 text-gray-600 border-gray-200'">
                  <div class="w-2.5 h-2.5 rounded-full relative">
                    <div class="absolute inset-0 rounded-full" :class="isClockedIn ? 'bg-emerald-500 animate-ping opacity-75' : 'bg-gray-400'"></div>
                    <div class="relative w-full h-full rounded-full" :class="isClockedIn ? 'bg-emerald-500' : 'bg-gray-400'"></div>
                  </div>
                  {{ isClockedIn ? 'Clocked In' : 'Clocked Out' }}
                </div>
              </div>

              <!-- Biometric Section -->
              <div v-if="selectedStatus === 'At Office'" class="flex-1 flex flex-col bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <div class="flex flex-col items-center flex-1 justify-center relative py-6">
                  
                  <!-- Scanner Visual -->
                  <div class="relative w-32 h-32 mb-8 user-select-none touch-none">
                    <!-- Scanner Background -->
                    <div class="absolute inset-0 rounded-3xl bg-white shadow-xl border border-blue-50 flex items-center justify-center transform transition-transform duration-300"
                         :class="{ 'scale-95 shadow-inner': isScanning }">
                      
                      <!-- Fingerprint Icon -->
                      <div class="text-6xl filter drop-shadow-md transition-all duration-300"
                           :class="isScanning ? 'scale-110 opacity-50' : 'opacity-100 hover:scale-105 hover:animate-pulse'">
                        👆
                      </div>

                      <!-- Scanning Line Animation -->
                      <div v-if="isScanning" class="absolute left-0 right-0 h-1 bg-blue-500 shadow-[0_0_15px_3px_rgba(59,130,246,0.6)] animate-[scan_2s_ease-in-out_infinite]"></div>
                      
                      <!-- Scanning Glow -->
                      <div v-if="isScanning" class="absolute inset-0 rounded-3xl box-shadow-[inset_0_0_20px_rgba(59,130,246,0.3)] animate-pulse"></div>
                    </div>
                  </div>

                  <div class="text-center w-full max-w-sm mb-8">
                    <h4 class="text-lg font-bold text-gray-900 mb-2">Biometric Verification</h4>
                    <p class="text-sm text-gray-600 min-h-[40px] px-4">{{ getBiometricMessage() }}</p>
                    
                    <div v-if="todayLogs.length > 0" class="mt-4 inline-flex flex-col items-center bg-white px-5 py-2.5 rounded-xl text-sm font-medium text-gray-700 shadow-sm border border-gray-100">
                      <span class="text-blue-700 font-bold mb-0.5">{{ getCurrentAttendanceStatus() }}</span>
                      <span class="text-xs text-gray-500 font-mono">{{ getLastCheckInTime() }}</span>
                    </div>
                  </div>

                  <button @click="handleBiometricAction" 
                          :disabled="isScanning || staffAttendanceStore.loading" 
                          class="w-full sm:w-auto min-w-[200px] h-14 rounded-2xl flex items-center justify-center gap-3 px-8 text-base font-bold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
                          :class="isScanning ? 'bg-blue-400' : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/40'">
                    
                    <!-- Shine effect on hover -->
                    <div class="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                    
                    <div v-if="staffAttendanceStore.loading" class="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                    <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                      <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>
                    <span class="relative z-10 tracking-wide">{{ isScanning ? 'Scanning...' : (staffAttendanceStore.loading ? 'Loading...' : getBiometricButtonText()) }}</span>
                  </button>
                </div>
              </div>

              <!-- Field/Travel Section -->
              <div v-else-if="selectedStatus === 'On Field' || selectedStatus === 'Travel'" class="flex-1 flex flex-col gap-5 overflow-y-auto pr-2 custom-scrollbar">
                
                <!-- Location Panel -->
                <div class="bg-blue-50/50 rounded-2xl p-5 border border-blue-100">
                  <div class="flex items-center gap-2 mb-3">
                    <span class="text-xl">📍</span>
                    <h4 class="font-bold text-gray-900">Location Tracking</h4>
                  </div>
                  
                  <div class="rounded-xl overflow-hidden border border-blue-200 bg-white relative h-48 shadow-sm">
                    <div v-if="!userLocation" class="absolute inset-0 flex flex-col items-center justify-center bg-gray-50/90 z-10">
                      <div class="animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600 mb-3"></div>
                      <p class="text-sm font-medium text-gray-600">Detecting location...</p>
                    </div>
                    
                    <div ref="leafletMapEl" class="w-full h-full z-0 relative"></div>
                    
                    <div v-if="userLocation" class="absolute bottom-2 inset-x-2 bg-white/95 backdrop-blur-md rounded-lg p-3 shadow-lg border border-gray-100 z-20 text-xs text-gray-700 animate-[fadeIn_0.5s_ease-out]">
                      <div class="flex justify-between items-center mb-1 text-[10px] font-mono font-bold text-blue-600">
                        <span>LAT: {{ userLocation.lat }}</span>
                        <span>LNG: {{ userLocation.lng }}</span>
                      </div>
                      <p class="font-medium truncate" :title="userLocation.address">{{ userLocation.address || 'Location identified' }}</p>
                    </div>
                  </div>
                </div>

                <!-- Photo Panel -->
                <div class="bg-gray-50 rounded-2xl p-5 border border-gray-200">
                  <div class="flex items-center gap-2 mb-3">
                    <span class="text-xl">📷</span>
                    <h4 class="font-bold text-gray-900">Photo Verification</h4>
                  </div>
                  
                  <div class="relative rounded-xl overflow-hidden border-2 border-dashed border-gray-300 bg-white aspect-video flex flex-col items-center justify-center cursor-pointer transition-all hover:border-blue-400 group"
                       :class="{ 'border-solid border-transparent shadow-md': capturedPhoto || cameraActive }"
                       @click="!capturedPhoto && !cameraActive && startCamera()">
                    
                    <video ref="videoElement" class="absolute inset-0 w-full h-full object-cover z-10" v-show="!capturedPhoto && cameraActive" autoplay playsinline></video>
                    <canvas ref="canvasElement" class="hidden"></canvas>
                    
                    <!-- Placeholder -->
                    <div v-if="!capturedPhoto && !cameraActive" class="text-center p-6 transition-transform group-hover:scale-105">
                      <div class="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                          <circle cx="12" cy="13" r="4"></circle>
                        </svg>
                      </div>
                      <p class="font-bold text-gray-700 mb-1">Click to start camera</p>
                      <p class="text-xs text-gray-500">Required for field attendance</p>
                    </div>
                    
                    <!-- Camera Controls -->
                    <div v-if="!capturedPhoto && cameraActive" class="absolute bottom-4 inset-x-0 flex justify-center z-20">
                      <button @click.stop="capturePhoto" class="bg-white/90 backdrop-blur-sm text-gray-900 rounded-full px-5 py-2.5 font-bold shadow-lg flex items-center gap-2 hover:bg-white transition-colors transform hover:scale-105 active:scale-95">
                        <div class="w-4 h-4 rounded-full bg-red-500 animate-pulse"></div>
                        Capture Photo
                      </button>
                    </div>
                    
                    <!-- Preview -->
                    <div v-if="capturedPhoto" class="absolute inset-0 w-full h-full z-30 group/preview">
                      <img :src="capturedPhoto" alt="Attendance photo" class="w-full h-full object-cover" />
                      <div class="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center">
                        <button @click.stop="retakePhoto" class="bg-white text-gray-900 rounded-full px-5 py-2.5 font-bold shadow-xl flex items-center gap-2 hover:bg-gray-50 transform hover:scale-105 transition-all">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="23 4 23 10 17 10"></polyline>
                            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                          </svg>
                          Retake Photo
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Action Buttons -->
                  <div class="flex gap-3 mt-4">
                    <button @click="timeInWithPhoto" :disabled="!capturedPhoto || isClockedIn || staffAttendanceStore.loading" 
                            class="flex-1 h-12 rounded-xl flex items-center justify-center gap-2 font-bold text-white shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            :class="(!capturedPhoto || isClockedIn) ? 'bg-gray-300' : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 hover:shadow-emerald-500/30 hover:-translate-y-0.5'">
                      <div v-if="staffAttendanceStore.loading && !isClockedIn" class="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                      <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      Time In
                    </button>
                    
                    <button @click="timeOutWithPhoto" :disabled="!capturedPhoto || !isClockedIn || staffAttendanceStore.loading" 
                            class="flex-1 h-12 rounded-xl flex items-center justify-center gap-2 font-bold text-white shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            :class="(!capturedPhoto || !isClockedIn) ? 'bg-gray-300' : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 hover:shadow-orange-500/30 hover:-translate-y-0.5'">
                      <div v-if="staffAttendanceStore.loading && isClockedIn" class="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                      <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 12 8 16 16 8"></polyline>
                      </svg>
                      Time Out
                    </button>
                  </div>
                </div>
              </div>

              <!-- Leave/Absent Section -->
              <div v-else class="flex-1 flex flex-col bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <div class="flex flex-col items-center justify-center flex-1 text-center py-8">
                  <div class="text-7xl mb-6 filter drop-shadow-md opacity-90 animate-[bounce_3s_ease-in-out_infinite]">
                    {{ selectedStatus === 'Leave' ? '🏖️' : '❌' }}
                  </div>
                  <h4 class="text-2xl font-bold text-gray-900 mb-2">{{ selectedStatus }} Mode</h4>
                  <p class="text-gray-500 max-w-[250px] mx-auto mb-8">
                    {{ selectedStatus === 'Leave' ? 'Enjoy your time off! Your status has been noted.' : 'Contact your supervisor if this absence is incorrect.' }}
                  </p>
                  
                  <!-- Leave Duration Section -->
                  <div v-if="selectedStatus === 'Leave'" class="w-full max-w-sm mt-2 p-4 bg-purple-50/50 rounded-2xl border border-purple-100/50">
                    <div class="flex items-center gap-2 mb-3">
                      <span class="text-xl">📅</span>
                      <h4 class="font-bold text-gray-900 text-sm">Duration of Leave</h4>
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                      <div class="space-y-1">
                        <label class="text-[10px] font-bold text-gray-500 uppercase ml-1">Start Date</label>
                        <input type="date" v-model="leaveStartDate" @change="handleLeaveDurationChange" 
                               class="w-full bg-white border border-purple-100 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 outline-none transition-all" />
                      </div>
                      <div class="space-y-1">
                        <label class="text-[10px] font-bold text-gray-500 uppercase ml-1">End Date</label>
                        <input type="date" v-model="leaveEndDate" @change="handleLeaveDurationChange" 
                               class="w-full bg-white border border-purple-100 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 outline-none transition-all" />
                      </div>
                    </div>
                  </div>

                  <!-- Leave Document Upload Section -->
                  <div v-if="selectedStatus === 'Leave'" class="w-full max-w-sm mt-2 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                    <div class="flex items-center gap-2 mb-3">
                      <span class="text-xl">📄</span>
                      <h4 class="font-bold text-gray-900 text-sm">Supporting Document</h4>
                    </div>
                    
                    <div v-if="!leaveDocumentUrl" class="relative group">
                      <input type="file" @change="handleLeaveFileUpload" class="hidden" id="leave-doc-input" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" />
                      <label for="leave-doc-input" class="flex flex-col items-center justify-center py-6 px-4 border-2 border-dashed border-blue-200 rounded-xl bg-white cursor-pointer hover:border-blue-400 group-hover:bg-blue-50/30 transition-all">
                        <div class="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-2">
                           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                        </div>
                        <p class="text-xs font-bold text-gray-700">Upload Leave Document</p>
                        <p class="text-[10px] text-gray-500 mt-1">PDF, DOC, JPG or PNG (Max 5MB)</p>
                      </label>
                    </div>

                    <div v-else class="flex items-center justify-between p-3 bg-white rounded-xl border border-blue-100 shadow-sm animate-[fadeIn_0.3s_ease-out]">
                      <div class="flex items-center gap-3 min-w-0">
                        <div class="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center shrink-0">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                        <div class="min-w-0">
                          <p class="text-xs font-bold text-gray-900 truncate">Document Uploaded</p>
                          <a :href="leaveDocumentUrl" target="_blank" class="text-[10px] text-blue-600 font-medium hover:underline flex items-center gap-1">
                            View File
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                          </a>
                        </div>
                      </div>
                      <button @click="clearLeaveDocument" class="p-2 text-gray-400 hover:text-red-500 transition-colors">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </button>
                    </div>
                  </div>

                  <button v-if="selectedStatus === 'Absent'" class="px-6 py-2.5 bg-white text-gray-700 font-bold rounded-xl border border-gray-300 shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-colors flex items-center gap-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14,2 14,8 20,8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                    </svg>
                    Request Modification
                  </button>
                </div>
              </div>

            </div>
          </div>

          <!-- Visual Separator -->
          <div class="flex items-center justify-center py-4">
            <div class="h-px bg-gray-200 flex-1"></div>
            <div class="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Today's Activity</div>
            <div class="h-px bg-gray-200 flex-1"></div>
          </div>

          <!-- Today's Log Panel -->
          <div class="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100">
            <div class="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
              <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14,2 14,8 20,8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900">Attendance Log</h3>
                <p class="text-sm text-gray-500 mt-0.5">Your punches for today</p>
              </div>
            </div>

            <div v-if="todayLogs.length === 0" class="py-12 flex flex-col items-center justify-center text-center">
              <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <h4 class="text-lg font-bold text-gray-800 mb-1">No attendance records</h4>
              <p class="text-gray-500">You haven't marked any attendance today</p>
            </div>

            <div v-else class="relative before:absolute before:inset-y-0 before:left-[110px] sm:before:left-[140px] before:w-[2px] before:bg-gray-100 pl-2">
              <div v-for="log in getDisplayLogs()" :key="log.id || log.tempId" class="relative flex items-start mb-8 last:mb-0 group">
                
                <!-- Time Badge -->
                <div class="w-[90px] sm:w-[120px] shrink-0 pt-1 text-right pr-6 sm:pr-8">
                  <div class="inline-block px-3 py-1 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 shadow-sm group-hover:border-blue-300 transition-colors">
                    {{ getLogTime(log) }}
                  </div>
                </div>

                <!-- Timeline Dot -->
                <div class="absolute left-[111px] sm:left-[141px] -ml-[7px] mt-[10px] w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm z-10 transition-transform group-hover:scale-125"
                     :class="getLogType(log) === 'time-in' ? 'bg-emerald-500' : 'bg-orange-500'">
                </div>

                <!-- Log Content -->
                <div class="flex-1 ml-10 sm:ml-12 bg-gray-50 hover:bg-white rounded-2xl p-5 border border-gray-100 hover:border-blue-100 hover:shadow-md transition-all duration-300">
                  <div class="flex items-center gap-3 mb-4">
                    <span class="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider"
                          :class="getLogType(log) === 'time-in' ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'">
                      {{ getLogType(log) === 'time-in' ? 'Time In' : 'Time Out' }}
                    </span>
                    <span class="text-xs font-medium text-gray-500 flex items-center gap-1.5">
                      <div class="w-1.5 h-1.5 rounded-full" :class="{
                        'bg-emerald-500': log.status === 'At Office',
                        'bg-blue-500': log.status === 'On Field',
                        'bg-purple-500': log.status === 'Travel'
                      }"></div>
                      {{ log.status }}
                    </span>
                  </div>

                  <div class="space-y-4">
                    <!-- Location Text -->
                    <div v-if="getLogAddress(log)" class="flex items-start gap-3 text-sm">
                      <div class="text-blue-500 mt-0.5">📍</div>
                      <div>
                        <span class="font-bold text-gray-900 block mb-0.5">Location</span>
                        <span class="text-gray-600 leading-snug">{{ getLogAddress(log) }}</span>
                      </div>
                    </div>

                    <!-- Location Map & Photo Layout -->
                    <div class="flex flex-col sm:flex-row gap-4" v-if="(log.latitude && log.longitude) || getLogPhoto(log)">
                      
                      <!-- Map Embed -->
                      <div v-if="log.latitude && log.longitude" class="flex-1 rounded-xl overflow-hidden border border-gray-200 h-32 shadow-sm bg-gray-100">
                        <iframe 
                          :src="getOsmEmbedUrl(log.latitude, log.longitude)" 
                          class="w-full h-full border-0 pointer-events-none" 
                          loading="lazy"
                          referrerpolicy="no-referrer-when-downgrade">
                        </iframe>
                      </div>

                      <!-- Photo -->
                      <div v-if="getLogPhoto(log)" class="w-full sm:w-32 lg:w-40 shrink-0 rounded-xl overflow-hidden border border-gray-200 h-32 shadow-sm bg-gray-100 cursor-pointer group/img relative" @click="openModal('Photo Verification', '', 'image', getLogPhoto(log))">
                        <img :src="getLogPhoto(log)" alt="Attendance Photo" class="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500" />
                        <div class="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>

    <!-- Loading Spinner Modal Overlay -->
    <div v-if="staffAttendanceStore.loading" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[110] animate-[fadeIn_0.2s_ease-out]">
      <div class="bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center min-w-[120px] min-h-[120px] animate-[modalSlideUp_0.3s_ease-out]">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" width="60" height="60" style="shape-rendering: auto; display: block; background: transparent;">
          <g transform="translate(50,50)">
            <g transform="rotate(0) translate(34,0)">
              <circle cx="0" cy="0" r="8" fill="#a3a3a3">
                <animate attributeName="opacity" keyTimes="0;1" values="1;0" dur="1s" begin="-0.875s" repeatCount="indefinite"></animate>
              </circle>
            </g>
            <g transform="rotate(45) translate(34,0)">
              <circle cx="0" cy="0" r="8" fill="#a3a3a3">
                <animate attributeName="opacity" keyTimes="0;1" values="1;0" dur="1s" begin="-0.75s" repeatCount="indefinite"></animate>
              </circle>
            </g>
            <g transform="rotate(90) translate(34,0)">
              <circle cx="0" cy="0" r="8" fill="#a3a3a3">
                <animate attributeName="opacity" keyTimes="0;1" values="1;0" dur="1s" begin="-0.625s" repeatCount="indefinite"></animate>
              </circle>
            </g>
            <g transform="rotate(135) translate(34,0)">
              <circle cx="0" cy="0" r="8" fill="#a3a3a3">
                <animate attributeName="opacity" keyTimes="0;1" values="1;0" dur="1s" begin="-0.5s" repeatCount="indefinite"></animate>
              </circle>
            </g>
            <g transform="rotate(180) translate(34,0)">
              <circle cx="0" cy="0" r="8" fill="#a3a3a3">
                <animate attributeName="opacity" keyTimes="0;1" values="1;0" dur="1s" begin="-0.375s" repeatCount="indefinite"></animate>
              </circle>
            </g>
            <g transform="rotate(225) translate(34,0)">
              <circle cx="0" cy="0" r="8" fill="#a3a3a3">
                <animate attributeName="opacity" keyTimes="0;1" values="1;0" dur="1s" begin="-0.25s" repeatCount="indefinite"></animate>
              </circle>
            </g>
            <g transform="rotate(270) translate(34,0)">
              <circle cx="0" cy="0" r="8" fill="#a3a3a3">
                <animate attributeName="opacity" keyTimes="0;1" values="1;0" dur="1s" begin="-0.125s" repeatCount="indefinite"></animate>
              </circle>
            </g>
            <g transform="rotate(315) translate(34,0)">
              <circle cx="0" cy="0" r="8" fill="#a3a3a3">
                <animate attributeName="opacity" keyTimes="0;1" values="1;0" dur="1s" begin="0s" repeatCount="indefinite"></animate>
              </circle>
            </g>
          </g>
        </svg>
      </div>
    </div>

    <!-- Modal Overlay -->
    <div v-if="modalVisible" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[100] px-4 animate-[fadeIn_0.2s_ease-out]" @click.self="closeModal">
      <div class="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden animate-[modalSlideUp_0.3s_ease-out]" role="dialog" aria-modal="true">
        <!-- Modal Header -->
        <div class="px-6 py-6 border-b border-gray-100" 
             :class="{
               'bg-blue-50/50': modalType === 'info',
               'bg-emerald-50/50': modalType === 'success',
               'bg-amber-50/50': modalType === 'warning',
               'bg-red-50/50': modalType === 'error'
             }">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                 :class="{
                   'bg-blue-100 text-blue-600': modalType === 'info',
                   'bg-emerald-100 text-emerald-600': modalType === 'success',
                   'bg-amber-100 text-amber-600': modalType === 'warning',
                   'bg-red-100 text-red-600': modalType === 'error'
                 }">
              <!-- Icons based on type -->
              <svg v-if="modalType === 'success'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <svg v-else-if="modalType === 'warning'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              <svg v-else-if="modalType === 'error'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
              <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900">{{ modalTitle }}</h3>
          </div>
        </div>
        
        <!-- Modal Body -->
        <div class="px-6 py-6 border-b border-gray-100">
          <p class="text-gray-600 text-[15px] leading-relaxed">{{ modalMessage }}</p>
          <div v-if="modalType === 'image'" class="mt-4 rounded-xl overflow-hidden border border-gray-200">
            <img :src="modalMessage" alt="Full Preview" class="w-full h-auto max-h-[60vh] object-contain bg-gray-900" />
          </div>
        </div>
        
        <!-- Modal Footer -->
        <div class="px-6 py-4 bg-gray-50 flex justify-end">
          <button class="px-6 py-2.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 focus:ring-4 focus:ring-gray-200 transition-all shadow-sm" @click="closeModal">OK, got it</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
  import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { useStaffAttendanceStore } from '../../stores/staffAttendanceStore.js'
  import { db } from '../../firebase.js'
  import { doc, getDoc } from 'firebase/firestore'
  import L from 'leaflet'
  import 'leaflet/dist/leaflet.css'
  import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png?url'
  import iconUrl from 'leaflet/dist/images/marker-icon.png?url'
  import shadowUrl from 'leaflet/dist/images/marker-shadow.png?url'

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'
  const GEO_API_BASE_URL = import.meta.env.DEV ? '' : API_BASE_URL

  const router = useRouter()
  const staffAttendanceStore = useStaffAttendanceStore()
  const activeTab = ref('current')
  const activeNav = ref('attendance')

  const staffId = ref(null)

  const avatarWrapEl = ref(null)
  const avatarMenuOpen = ref(false)
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
      console.error('Failed to load user profile:', e)
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
    if (!avatarMenuOpen.value) return
    const root = avatarWrapEl.value
    if (!root) return
    if (root.contains(e.target)) return
    closeAvatarMenu()
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

  // Attendance state
  const selectedStatus = ref('At Office')
  const capturedPhoto = ref(null)
  const cameraActive = ref(false)
  const userLocation = ref(null)
  const currentTime = ref('')
  const currentDate = ref('')
  const currentAttendanceId = ref(null)
  const isScanning = ref(false)
  const videoElement = ref(null)
  const canvasElement = ref(null)

  const modalVisible = ref(false)
  const modalTitle = ref('')
  const modalMessage = ref('')
  const modalType = ref('info')

  const leafletMapEl = ref(null)
  const leafletMap = ref(null)
  const leafletMarker = ref(null)

  const openModal = (title, message, type = 'info') => {
    modalTitle.value = title
    modalMessage.value = message
    modalType.value = type
    modalVisible.value = true
  }

  const closeModal = () => {
    modalVisible.value = false
  }

  // Time tracking
  let timeInterval = null

  // Computed properties
  const currentStatusClass = computed(() => {
    const statusClasses = {
      'At Office': 'status-office',
      'On Field': 'status-field',
      'Travel': 'status-travel',
      'Leave': 'status-leave',
      'Absent': 'status-absent'
    }
    return statusClasses[selectedStatus.value] || 'status-office'
  })

  const isClockedIn = computed(() => {
    const currentAttendance = staffAttendanceStore.getCurrentStaffAttendance
    if (!currentAttendance) return false
    
    // Check if clocked in AM and not clocked out AM
    if (currentAttendance.timeInAM && !currentAttendance.timeOutAM) return true
    
    // Check if clocked in PM and not clocked out PM
    if (currentAttendance.timeInPM && !currentAttendance.timeOutPM) return true
    
    return false
  })

  const leaveDocumentUrl = computed(() => {
    return staffAttendanceStore.getCurrentStaffAttendance?.leaveDocumentUrl || null
  })

  const leaveStartDate = ref('')
  const leaveEndDate = ref('')

  // Watch for changes in store and update local refs
  watch(() => staffAttendanceStore.getCurrentStaffAttendance, (newVal) => {
    if (newVal) {
      if (newVal.leaveStartDate) leaveStartDate.value = newVal.leaveStartDate
      if (newVal.leaveEndDate) leaveEndDate.value = newVal.leaveEndDate
    }
  }, { immediate: true })

  const todayLogs = computed(() => {
    const currentAttendance = staffAttendanceStore.getCurrentStaffAttendance
    if (!currentAttendance) return []

    const logs = []

    if (currentAttendance.timeInAM) {
      logs.push({
        id: currentAttendance.id + '_am_in',
        type: 'time-in',
        timeIn: currentAttendance.timeInAM,
        timeOut: currentAttendance.timeOutAM,
        status: currentAttendance.staffStatusAM || currentAttendance.statusAM,
        location: currentAttendance.LocAM || currentAttendance.locationAM,
        address: currentAttendance.LocAM?.address || currentAttendance.address,
        latitude: currentAttendance.LocAM?.latitude ?? currentAttendance.latitude,
        longitude: currentAttendance.LocAM?.longitude ?? currentAttendance.longitude,
        addressOut: currentAttendance.timeOutAddressAM || null,
        latitudeOut: currentAttendance.timeOutLatitudeAM ?? null,
        longitudeOut: currentAttendance.timeOutLongitudeAM ?? null,
        photoUrl: currentAttendance.photoUrl,
        photoOutUrl: currentAttendance.photoOutUrlAM || null
      })
    }

    if (currentAttendance.timeInPM) {
      logs.push({
        id: currentAttendance.id + '_pm_in',
        type: 'time-in',
        timeIn: currentAttendance.timeInPM,
        timeOut: currentAttendance.timeOutPM,
        status: currentAttendance.staffStatusPM || currentAttendance.statusPM,
        location: currentAttendance.LocPM || currentAttendance.locationPM,
        address: currentAttendance.LocPM?.address || currentAttendance.address,
        latitude: currentAttendance.LocPM?.latitude ?? currentAttendance.latitude,
        longitude: currentAttendance.LocPM?.longitude ?? currentAttendance.longitude,
        addressOut: currentAttendance.timeOutAddressPM || null,
        latitudeOut: currentAttendance.timeOutLatitudePM ?? null,
        longitudeOut: currentAttendance.timeOutLongitudePM ?? null,
        photoUrl: currentAttendance.photoUrl,
        photoOutUrl: currentAttendance.photoOutUrlPM || null
      })
    }

    return logs.sort((a, b) => String(b.timeIn || '').localeCompare(String(a.timeIn || '')))
  })

  const getStatusEmoji = (status) => {
    const emojis = {
      'At Office': '🏢',
      'On Field': '📍',
      'Travel': '✈️',
      'Leave': '🏖️',
      'Absent': '❌'
    }
    return emojis[status] || '🏢'
  }

  // Initialize time display
  const updateTime = () => {
    const now = new Date()
    currentTime.value = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    })
    currentDate.value = now.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  // Navigation function
  const navigateTo = (routeName, navItem) => {
    activeNav.value = navItem
    router.push({ name: routeName })
  }

  // Status change handler
  const onStatusChange = async () => {
    showNotification(`Status changed to ${selectedStatus.value}`, 'info')
    if (selectedStatus.value === 'On Field' || selectedStatus.value === 'Travel') {
      getUserLocation()
    } else if (selectedStatus.value === 'Leave' || selectedStatus.value === 'Absent') {
      try {
        const ensuredStaffId = staffId.value || (await staffAttendanceStore.ensureCurrentStaffId())
        const res = await staffAttendanceStore.createOrGetDailyAttendance(ensuredStaffId)
        if (res.success && res.data?.id) {
          await staffAttendanceStore.updateStaffAttendance(res.data.id, { staffStatus: selectedStatus.value })
        }
      } catch (e) {
        console.error('Failed to update status in background:', e)
      }
    }
  }

  const handleLeaveFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Basic validation
    const allowedTypes = [
      'application/pdf', 
      'image/jpeg', 
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
    if (!allowedTypes.includes(file.type)) {
      openModal('Invalid File', 'Please upload a PDF, DOC, JPG, or PNG file.', 'error')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      openModal('File Too Large', 'File size should be less than 5MB.', 'error')
      return
    }

    try {
      showNotification('Uploading leave document...')
      const reader = new FileReader()
      reader.onload = async (e) => {
        const base64Data = e.target.result
        const ensuredStaffId = staffId.value || (await staffAttendanceStore.ensureCurrentStaffId())
        const res = await staffAttendanceStore.createOrGetDailyAttendance(ensuredStaffId)
        if (!res.success || !res.data?.id) {
           showNotification('Failed to find daily attendance record.', 'error')
           return
        }
        
        const attendanceId = res.data.id
        const filename = `leave_${attendanceId}_${Date.now()}.${file.name.split('.').pop()}`
        
        const downloadUrl = await staffAttendanceStore.uploadLeaveDocument(base64Data, filename)
        if (downloadUrl) {
          const updateRes = await staffAttendanceStore.updateLeaveStatus(
            attendanceId, 
            downloadUrl,
            leaveStartDate.value,
            leaveEndDate.value
          )
          if (updateRes.success) {
            openModal('Success', 'Leave document uploaded successfully!', 'success')
          } else {
            showNotification(updateRes.error || 'Failed to update leave status.', 'error')
          }
        } else {
          showNotification('Failed to upload document.', 'error')
        }
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('File upload error:', error)
      showNotification('An error occurred during file upload.', 'error')
    }
  }

  const handleLeaveDurationChange = async () => {
    const attendance = staffAttendanceStore.getCurrentStaffAttendance
    if (!attendance?.id) return

    try {
      const res = await staffAttendanceStore.updateLeaveStatus(
        attendance.id, 
        attendance.leaveDocumentUrl,
        leaveStartDate.value, 
        leaveEndDate.value
      )
      if (res.success) {
        showNotification('Leave duration updated.', 'success')
      }
    } catch (error) {
      console.error('Failed to update leave duration:', error)
      showNotification('Failed to save leave duration.', 'error')
    }
  }

  const clearLeaveDocument = async () => {
    const attendance = staffAttendanceStore.getCurrentStaffAttendance
    if (!attendance?.id) return

    try {
      const res = await staffAttendanceStore.updateLeaveStatus(
        attendance.id, 
        null, // clear document url
        leaveStartDate.value,
        leaveEndDate.value
      )
      if (res.success) {
        showNotification('Document removed.', 'info')
      }
    } catch (error) {
      showNotification('Failed to remove document.', 'error')
    }
  }

  // Biometric helper functions
  const getBiometricMessage = () => {
    if (isScanning.value) {
      return 'Scanning fingerprint... Please hold your finger on the scanner'
    }
    
    if (todayLogs.value.length === 0) {
      return 'Place your finger on the scanner to mark your attendance'
    }
    
    const lastLog = todayLogs.value[0]
    if (lastLog.type === 'time-in' && !lastLog.timeOut) {
      return 'You are currently clocked in. Scan to clock out for lunch/break'
    } else if (lastLog.type === 'time-out') {
      return 'Welcome back! Scan to clock in and resume work'
    }
    
    return 'Place your finger on the scanner to mark your attendance'
  }

  const getBiometricButtonText = () => {
    if (todayLogs.value.length === 0) {
      return 'Clock In'
    }
    
    const lastLog = todayLogs.value[0]
    if (lastLog.type === 'time-in' && !lastLog.timeOut) {
      return 'Clock Out'
    } else if (lastLog.type === 'time-out') {
      return 'Clock In'
    }
    
    return 'Clock In'
  }

  const getCurrentAttendanceStatus = () => {
    if (todayLogs.value.length === 0) {
      return 'Not clocked in today'
    }
    
    const lastLog = todayLogs.value[0]
    if (lastLog.type === 'time-in' && !lastLog.timeOut) {
      return 'Currently working'
    } else if (lastLog.type === 'time-out') {
      return 'On break'
    }
    
    return 'Not clocked in'
  }

  const normalizeLogTime = (value) => {
    if (!value) return new Date(0)
    if (value?.toDate) return value.toDate()

    if (typeof value === 'string') {
      const hhmmss = /^\d{2}:\d{2}:\d{2}$/
      if (hhmmss.test(value)) {
        const [h, m, s] = value.split(':').map(Number)
        const now = new Date()
        return new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, s || 0)
      }

      const d = new Date(value)
      if (!Number.isNaN(d.getTime())) return d
    }

    return new Date(0)
  }

  const formatLogTime = (value) => {
    const d = normalizeLogTime(value)
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getLastCheckInTime = () => {
    if (todayLogs.value.length === 0) return ''
    const lastLog = todayLogs.value[0]
    const t = lastLog.type === 'time-in' ? lastLog.timeIn : lastLog.timeOut
    if (!t) return ''
    return `Last: ${formatLogTime(t)}`
  }

  const getDisplayLogs = () => {
    const displayLogs = []

    todayLogs.value.forEach(log => {
      if (log.timeIn) {
        displayLogs.push({
          id: log.id + '_timein',
          tempId: log.id + '_timein',
          type: 'time-in',
          time: log.timeIn,
          status: log.status,
          location: log.location,
          address: log.address || null,
          latitude: log.latitude ?? null,
          longitude: log.longitude ?? null,
          photo: log.photoUrl,
          notes: log.notes,
          originalLog: log
        })
      }

      if (log.timeOut) {
        displayLogs.push({
          id: log.id + '_timeout',
          tempId: log.id + '_timeout',
          type: 'time-out',
          time: log.timeOut,
          status: log.status,
          location: log.locationOut,
          address: log.addressOut || log.address || null,
          latitude: log.latitudeOut ?? log.latitude ?? null,
          longitude: log.longitudeOut ?? log.longitude ?? null,
          photo: log.photoOutUrl,
          notes: log.notesOut,
          originalLog: log
        })
      }
    })

    return displayLogs.sort((a, b) => normalizeLogTime(b.time) - normalizeLogTime(a.time))
  }

  const getLogType = (log) => {
    return log.type || 'time-in'
  }

  const getLogTime = (log) => {
    if (!log.time) return ''
    return formatLogTime(log.time)
  }

  const getLogLocation = (log) => {
    return log.location || null
  }

  const getLogAddress = (log) => {
    return log.address || null
  }

  const getLogPhoto = (log) => {
    return log.photo || null
  }

  // Enhanced geolocation function with proper error handling and validation
  const getUserLocation = async () => {
    if (!navigator.geolocation) {
      throw new Error('Geolocation is not supported by your browser')
    }

    try {
      showNotification('Detecting your location...')
      
      // Get high-accuracy location with proper error handling
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          (error) => {
            let errorMessage = 'Failed to get location'
            
            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage = 'Location permission denied. Please enable location services in your browser settings.'
                break
              case error.POSITION_UNAVAILABLE:
                errorMessage = 'Location information is unavailable. Please check your GPS/connection.'
                break
              case error.TIMEOUT:
                errorMessage = 'Location request timed out. Please try again.'
                break
              default:
                errorMessage = `Location error: ${error.message}`
                break
            }
            
            reject(new Error(errorMessage))
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
          }
        )
      })

      const { latitude, longitude, accuracy } = position.coords
      
      // Validate coordinates
      if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
        throw new Error('Invalid coordinates received from GPS')
      }

      // Get address from coordinates using OpenStreetMap Nominatim reverse geocoding
      let address = null
      try {
        const { addressLine } = await reverseGeocode(latitude, longitude)
        address = addressLine || null
      } catch (error) {
        console.error('Geocoding error (non-blocking):', error)
        showNotification(error.message, 'warning')
        address = null
      }

      userLocation.value = {
        lat: latitude.toFixed(6),
        lng: longitude.toFixed(6),
        address: address ? address.trim() : null,
        accuracy: accuracy.toFixed(2),
        timestamp: new Date().toISOString()
      }

      showNotification(
        userLocation.value.address
          ? `Location detected: ${userLocation.value.address}`
          : `Location detected: ${userLocation.value.lat}, ${userLocation.value.lng}`,
        'success'
      )
      console.log('Location detected successfully:', userLocation.value)
      
      return userLocation.value
      
    } catch (error) {
      console.error('Geolocation error:', error)
      showNotification(error.message, 'error')
      throw error // Re-throw to prevent saving invalid location data
    }
  }

  // Camera functions - explicitly defined to resolve HMR issues
  const startCamera = async () => {
    try {
      console.log('Starting camera...')
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' },
        audio: false 
      })
      if (videoElement.value) {
        videoElement.value.srcObject = stream
        cameraActive.value = true
        showNotification('Camera started successfully!', 'success')
      }
    } catch (error) {
      showNotification('Failed to access camera. Please check permissions.', 'error')
      console.error('Camera error:', error)
    }
  }

  const stopCamera = () => {
    if (videoElement.value && videoElement.value.srcObject) {
      const stream = videoElement.value.srcObject
      const tracks = stream.getTracks()
      tracks.forEach(track => track.stop())
      videoElement.value.srcObject = null
      cameraActive.value = false
    }
  }

  const capturePhoto = () => {
    if (videoElement.value && canvasElement.value) {
      const context = canvasElement.value.getContext('2d')
      canvasElement.value.width = videoElement.value.videoWidth
      canvasElement.value.height = videoElement.value.videoHeight
      context.drawImage(videoElement.value, 0, 0)
      
      capturedPhoto.value = canvasElement.value.toDataURL('image/jpeg')
      stopCamera()
      showNotification('Photo captured successfully!', 'success')
    }
  }

  const retakePhoto = () => {
    capturedPhoto.value = null
    startCamera()
  }

  // Expose functions to template for HMR compatibility
  defineExpose({
    startCamera,
    stopCamera,
    capturePhoto,
    retakePhoto
  })

  const getOsmEmbedUrl = (latitude, longitude) => {
    const lat = Number(latitude)
    const lon = Number(longitude)
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return ''

    const delta = 0.005
    const left = lon - delta
    const right = lon + delta
    const top = lat + delta
    const bottom = lat - delta
    const bbox = `${left},${bottom},${right},${top}`
    return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${encodeURIComponent(`${lat},${lon}`)}`
  }

  const showNotification = (message, type = 'info') => {
    // Create notification element
    const notification = document.createElement('div')
    notification.className = `notification notification-${type}`
    notification.textContent = message
    
    // Add to DOM
    document.body.appendChild(notification)
    
    // Remove after 3 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 3000)
  }

  const handleBiometricAction = async () => {
    if (isScanning.value) return
    
    isScanning.value = true
    
    try {
      // Simulate biometric scanning process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Determine action based on current state
      if (todayLogs.value.length === 0) {
        // First time in - clock in
        await performTimeIn()
      } else {
        const lastLog = todayLogs.value[0]
        if (lastLog.type === 'time-in' && !lastLog.timeOut) {
          // Currently clocked in - clock out for lunch/break
          await performTimeOut()
        } else {
          // Was on break - clock back in
          await performTimeIn()
        }
      }
      
      showNotification('Biometric verification successful!', 'success')
    } catch (error) {
      showNotification('Biometric verification failed. Please try again.', 'error')
      console.error('Biometric error:', error)
    } finally {
      isScanning.value = false
    }
  }

  const performTimeIn = async () => {
    try {
      // Create or get today's attendance
      const ensuredStaffId = staffId.value || (await staffAttendanceStore.ensureCurrentStaffId())
      staffId.value = ensuredStaffId
      const result = await staffAttendanceStore.createOrGetDailyAttendance(ensuredStaffId)
      const attendance = result.data

      if (!result?.success || !attendance?.id) {
        showNotification(result?.error || 'Failed to prepare today\'s attendance record.', 'error')
        return
      }
      
      // Determine if it's AM or PM time
      const currentHour = new Date().getHours()
      const isAM = currentHour < 12

      // Restrict multiple clock-ins per session (AM/PM)
      const currentAttendance = staffAttendanceStore.getCurrentStaffAttendance
      if (currentAttendance) {
        if (isAM && currentAttendance.timeInAM) {
          openModal('Already Clocked In', 'You already clocked in for AM.', 'warning')
          return
        }

        if (!isAM && currentAttendance.timeInPM) {
          openModal('Already Clocked In', 'You already clocked in for PM.', 'warning')
          return
        }
      }
      
      // Build location data only with valid values
      const locationData = {
        staffStatus: selectedStatus.value
      }
      
      if (selectedStatus.value === 'At Office') {
        // Resolve exact location even when at office
        try {
          await getUserLocation()
        } catch (error) {
          return
        }

        if (!userLocation.value?.lat || !userLocation.value?.lng) {
          showNotification('Invalid location data. Please try again.', 'error')
          return
        }

        locationData.location = 'Office'
        if (userLocation.value.address) locationData.address = userLocation.value.address
        locationData.latitude = parseFloat(userLocation.value.lat)
        locationData.longitude = parseFloat(userLocation.value.lng)
        if (!Number.isFinite(locationData.latitude) || !Number.isFinite(locationData.longitude)) {
          showNotification('Invalid location coordinates. Please try again.', 'error')
          return
        }
      } else if (selectedStatus.value === 'On Field' || selectedStatus.value === 'Travel') {
        // For travel/field, always resolve location (GPS + reverse geocode) before saving
        try {
          await getUserLocation()
        } catch (error) {
          // getUserLocation already shows a notification; block save to avoid writing blank location
          return
        }

        if (!userLocation.value?.lat || !userLocation.value?.lng) {
          showNotification('Invalid location data from GPS. Please try again.', 'error')
          return
        }
        
        locationData.location = 'Field Location'
        if (userLocation.value.address) locationData.address = userLocation.value.address
        locationData.latitude = parseFloat(userLocation.value.lat)
        locationData.longitude = parseFloat(userLocation.value.lng)
        if (!Number.isFinite(locationData.latitude) || !Number.isFinite(locationData.longitude)) {
          showNotification('Invalid location coordinates parsed. Please try again.', 'error')
          return
        }
        
        // Only add photo URL for travel/field status if photo exists
        if (capturedPhoto.value) {
          locationData.photoUrl = capturedPhoto.value
        }
      }
      
      let updateResult
      if (isAM) {
        updateResult = await staffAttendanceStore.clockInAM(attendance.id, locationData)
      } else {
        updateResult = await staffAttendanceStore.clockInPM(attendance.id, locationData)
      }
      
      if (!updateResult?.success) {
        const msg = updateResult?.error || 'Failed to clock in. Please try again.'
        if (String(msg).toLowerCase().includes('already clocked in')) {
          openModal('Already Clocked In', msg, 'warning')
        } else {
          showNotification(msg, 'error')
        }
        return
      }

      if (updateResult.success) {
        currentAttendanceId.value = attendance.id
        // Clear photo only for travel/field status after successful save
        if (selectedStatus.value === 'Travel' || selectedStatus.value === 'On Field') {
          capturedPhoto.value = null
        }
        openModal('Success', 'Clocked in successfully!', 'success')
      } else {
        showNotification(updateResult?.error || 'Unknown error occurred during saving.', 'error')
      }
    } catch (error) {
      console.error('Time in error block triggered:', error)
      showNotification(error?.message || 'Failed to clock in. Please try again.', 'error')
    }
  }

  const performTimeOut = async () => {
    try {
      const currentAttendance = staffAttendanceStore.getCurrentStaffAttendance
      if (!currentAttendance) {
        showNotification('No active attendance found', 'error')
        return
      }
      
      // Determine if it's AM or PM time
      const currentHour = new Date().getHours()
      const isAM = currentHour < 12

      // Restrict multiple clock-outs per session (AM/PM)
      if (isAM) {
        if (!currentAttendance.timeInAM) {
          showNotification('You have not clocked in for AM yet.', 'warning')
          return
        }
        if (currentAttendance.timeOutAM) {
          showNotification('You already clocked out for AM.', 'warning')
          return
        }
      } else {
        if (!currentAttendance.timeInPM) {
          showNotification('You have not clocked in for PM yet.', 'warning')
          return
        }
        if (currentAttendance.timeOutPM) {
          showNotification('You already clocked out for PM.', 'warning')
          return
        }
      }
      
      // Resolve exact location for clock-out too
      try {
        await getUserLocation()
      } catch (error) {
        return
      }

      if (!userLocation.value?.lat || !userLocation.value?.lng) {
        showNotification('Invalid location data. Please try again.', 'error')
        return
      }

      const locationData = {
        staffStatus: selectedStatus.value,
        ...(userLocation.value.address ? { address: userLocation.value.address } : {}),
        latitude: parseFloat(userLocation.value.lat),
        longitude: parseFloat(userLocation.value.lng)
      }

      if (selectedStatus.value === 'Travel' || selectedStatus.value === 'On Field') {
        if (capturedPhoto.value) {
          locationData.photoUrl = capturedPhoto.value
        }
      }

      let updateResult
      if (isAM && currentAttendance.timeInAM && !currentAttendance.timeOutAM) {
        updateResult = await staffAttendanceStore.clockOutAM(currentAttendance.id, locationData)
      } else if (!isAM && currentAttendance.timeInPM && !currentAttendance.timeOutPM) {
        updateResult = await staffAttendanceStore.clockOutPM(currentAttendance.id, locationData)
      } else {
        showNotification('No active clock-in found to clock out', 'error')
        return
      }
      
      if (!updateResult?.success) {
        showNotification(updateResult?.error || 'Failed to clock out. Please try again.', 'error')
        return
      }

      if (updateResult.success) {
        if (selectedStatus.value === 'Travel' || selectedStatus.value === 'On Field') {
          capturedPhoto.value = null
        }
        openModal('Success', 'Clocked out successfully!', 'success')
      }
    } catch (error) {
      console.error('Time out error:', error)
      showNotification(error?.message || 'Failed to clock out. Please try again.', 'error')
    }
  }

  const timeInWithPhoto = async () => {
    if (capturedPhoto.value && !isClockedIn.value) {
      await performTimeIn()
    }
  }

  const timeOutWithPhoto = async () => {
    if (capturedPhoto.value && isClockedIn.value) {
      await performTimeOut()
    }
  }

  const initOrUpdateLeafletMap = () => {
    if (!leafletMapEl.value) return
    if (!userLocation.value?.lat || !userLocation.value?.lng) return

    const lat = parseFloat(userLocation.value.lat)
    const lng = parseFloat(userLocation.value.lng)
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return

    L.Icon.Default.mergeOptions({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
    })

    if (!leafletMap.value) {
      leafletMap.value = L.map(leafletMapEl.value, {
        zoomControl: true,
        attributionControl: true,
      }).setView([lat, lng], 16)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(leafletMap.value)

      leafletMarker.value = L.marker([lat, lng]).addTo(leafletMap.value)
      if (userLocation.value?.address) {
        leafletMarker.value.bindPopup(userLocation.value.address).openPopup()
      }
    } else {
      leafletMap.value.setView([lat, lng], 16)
      if (leafletMarker.value) {
        leafletMarker.value.setLatLng([lat, lng])
      } else {
        leafletMarker.value = L.marker([lat, lng]).addTo(leafletMap.value)
      }
      
      if (userLocation.value?.address) {
        leafletMarker.value.bindPopup(userLocation.value.address).openPopup()
      }
    }

    setTimeout(() => {
      try {
        leafletMap.value?.invalidateSize()
      } catch {
        // ignore
      }
    }, 0)
  }

  const reverseGeocode = async (latitude, longitude) => {
    const lat = Number(latitude)
    const lon = Number(longitude)
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return { json: null, addressLine: null }

    const url = `${GEO_API_BASE_URL}/geo/reverse?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } })
    if (!res.ok) {
      return { json: null, addressLine: null, status: res.status }
    }

    const json = await res.json().catch(() => null)
    if (!json) return { json: null, addressLine: null }

    const addressFromObject = (obj) => {
      if (!obj || typeof obj !== 'object') return null
      const parts = [
        obj.house_number,
        obj.road || obj.street,
        obj.neighbourhood,
        obj.suburb || obj.village || obj.locality,
        obj.city_district || obj.district,
        obj.city || obj.town || obj.municipality,
        obj.state || obj.region,
        obj.postcode,
        obj.country
      ].filter(Boolean)
      
      const uniqueParts = [...new Set(parts)]
      return uniqueParts.length ? uniqueParts.join(', ') : null
    }

    const addressLine = (
      (typeof json?.display_name === 'string' && json.display_name.trim() !== '' ? json.display_name : null) ||
      addressFromObject(json?.address) ||
      addressFromObject(json?.raw?.address) ||
      addressFromObject(json?.raw?.properties) ||
      (typeof json?.address === 'string' ? json.address : null) ||
      (typeof json?.addressLine === 'string' ? json.addressLine : null) ||
      null
    )

    return { json, addressLine: addressLine ? addressLine.trim() : null }
  }

  onMounted(() => {
    document.addEventListener('click', onDocClick)
    fetchUserProfile()
    updateTime()
    timeInterval = setInterval(updateTime, 1000)

    ;(async () => {
      staffId.value = await staffAttendanceStore.ensureCurrentStaffId()
      if (staffId.value) {
        const res = await staffAttendanceStore.createOrGetDailyAttendance(staffId.value)
        if (res.success && res.data?.staffStatus) {
          selectedStatus.value = res.data.staffStatus
        }
      }
    })()
  })

  watch(
    () => userLocation.value,
    () => {
      initOrUpdateLeafletMap()
    },
    { deep: true }
  )

  onUnmounted(() => {
    document.removeEventListener('click', onDocClick)
    if (timeInterval) {
      clearInterval(timeInterval)
    }

    try {
      leafletMap.value?.remove()
    } catch {
      // ignore
    }
    leafletMap.value = null
    leafletMarker.value = null

    // Stop camera if active
    stopCamera()
  })
</script>
