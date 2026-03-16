<template>
  <div class="min-h-screen flex flex-col md:flex-row bg-gray-100">
    <AdminSidebar />

    <div class="flex-1 flex flex-col">
      <header class="px-8 py-6 bg-blue-600 text-white">
        <h1 class="m-0 text-2xl font-bold">Student Intern Management</h1>
      </header>

      <main class="flex-1 px-8 py-6">
        <section class="bg-white rounded-lg p-6 shadow-sm">
        <div class="mb-4">
          <h2 class="m-0 text-xl text-gray-800">Student Interns</h2>
          <p class="mt-1 mb-0 text-sm text-gray-600">
            List of all student interns registered in the system (from Firestore `users` collection).
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
          <button type="button" class="px-3.5 py-2 rounded text-sm cursor-pointer bg-red-600 text-white border-none transition-colors hover:bg-red-700 disabled:opacity-70 disabled:cursor-default" @click="exportToPDF">
            Export PDF
          </button>
          <button type="button" class="px-3.5 py-2 rounded text-sm cursor-pointer bg-blue-800 text-white border-none transition-colors hover:bg-blue-900 disabled:opacity-70 disabled:cursor-default" @click="exportToWord">
            Export Word
          </button>
          <button type="button" class="px-3.5 py-2 rounded text-sm cursor-pointer bg-blue-600 text-white border-none transition-colors hover:bg-blue-700 disabled:opacity-70 disabled:cursor-default" @click="openAddModal">
            Add Intern
          </button>
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
                <th class="border border-gray-300 px-3 py-2 text-left">Assigned Office</th>
                <th class="border border-gray-300 px-3 py-2 text-left">School / University</th>
                <th class="border border-gray-300 px-3 py-2 text-left">OJT Required Hours</th>
                <th class="border border-gray-300 px-3 py-2 text-left">Address</th>
                <th class="border border-gray-300 px-3 py-2 text-left">Gender</th>
                <th class="border border-gray-300 px-3 py-2 text-left">Date of Birth</th>
                <th class="border border-gray-300 px-3 py-2 text-left">Course / Program</th>
                <th class="border border-gray-300 px-3 py-2 text-left">Year Level</th>
                <th class="border border-gray-300 px-3 py-2 text-left">Start Date</th>
                <th class="border border-gray-300 px-3 py-2 text-left">End Date</th>
                <th class="border border-gray-300 px-3 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(intern, index) in paginatedInterns" :key="intern.id">
                <td class="border border-gray-300 px-3 py-2">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                <td class="border border-gray-300 px-3 py-2">{{ formatName(intern) }}</td>
                <td class="border border-gray-300 px-3 py-2">{{ intern.username || '-' }}</td>
                <td class="border border-gray-300 px-3 py-2">{{ intern.email || '-' }}</td>
                <td class="border border-gray-300 px-3 py-2">{{ intern.role || '-' }}</td>
                <td class="border border-gray-300 px-3 py-2">{{ intern.position || '-' }}</td>
                <td class="border border-gray-300 px-3 py-2">{{ intern.assignedOffice || '-' }}</td>
                <td class="border border-gray-300 px-3 py-2">{{ intern.schoolOrUniversity || '-' }}</td>
                <td class="border border-gray-300 px-3 py-2">{{ intern.ojtRequiredHours ?? '-' }}</td>
                <td class="border border-gray-300 px-3 py-2">{{ intern.address || '-' }}</td>
                <td class="border border-gray-300 px-3 py-2">{{ intern.gender || '-' }}</td>
                <td class="border border-gray-300 px-3 py-2">{{ intern.dateOfBirth || '-' }}</td>
                <td class="border border-gray-300 px-3 py-2">{{ intern.course || '-' }}</td>
                <td class="border border-gray-300 px-3 py-2">{{ intern.yearLevel || '-' }}</td>
                <td class="border border-gray-300 px-3 py-2">{{ intern.startDate || '-' }}</td>
                <td class="border border-gray-300 px-3 py-2">{{ intern.endDate || '-' }}</td>
                <td class="border border-gray-300 px-3 py-2">
                  <div class="flex gap-1">
                    <button
                      type="button"
                      class="px-2.5 py-1 text-xs rounded border border-gray-300 bg-gray-50 cursor-pointer whitespace-nowrap transition-colors hover:bg-gray-200"
                      @click="openViewEditModal(intern, 'view')"
                      title="View"
                    >
                      👁
                    </button>
                    <button
                      type="button"
                      class="px-2.5 py-1 text-xs rounded border border-gray-300 bg-gray-50 cursor-pointer whitespace-nowrap transition-colors hover:bg-gray-200"
                      @click="openViewEditModal(intern, 'edit')"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      type="button"
                      class="px-2.5 py-1 text-xs rounded border border-red-400 text-red-700 bg-red-50 cursor-pointer whitespace-nowrap transition-colors hover:bg-red-100"
                      @click="confirmDeleteIntern(intern)"
                      title="Delete"
                    >
                      🗑
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Pagination Controls -->
          <div class="mt-4 flex items-center justify-between" v-if="filteredInterns.length">
            <div class="text-sm text-gray-600">
              Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredInterns.length) }} of {{ filteredInterns.length }} entries
            </div>
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <span>Rows per page:</span>
                <select v-model.number="itemsPerPage" class="px-2 py-1 rounded border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400">
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="25">25</option>
                  <option value="30">30</option>
                </select>
              </div>
              <div class="flex items-center gap-2">
                <button 
                  class="px-3 py-1.5 rounded border border-gray-300 bg-white text-sm disabled:opacity-50 cursor-pointer transition-colors hover:bg-gray-50"
                  :disabled="currentPage === 1"
                  @click="currentPage--"
                >Previous</button>
                <span class="text-sm font-medium text-gray-700 px-2">Page {{ currentPage }} of {{ totalPages }}</span>
                <button 
                  class="px-3 py-1.5 rounded border border-gray-300 bg-white text-sm disabled:opacity-50 cursor-pointer transition-colors hover:bg-gray-50"
                  :disabled="currentPage === totalPages"
                  @click="currentPage++"
                >Next</button>
              </div>
            </div>
          </div>

          <div v-else class="text-[0.95rem] text-gray-600">No student interns found.</div>
        </div>

        <!-- Add Intern Modal -->
        <div v-if="showAddModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000]">
          <div class="bg-white rounded-lg p-6 w-full max-w-[640px] shadow-[0_10px_25px_rgba(0,0,0,0.2)]">
            <h3 class="m-0 mb-4 text-[1.1rem] text-gray-800 font-bold">Add Student Intern</h3>

            <form @submit.prevent="handleAddIntern" class="flex flex-col gap-4">
              <div class="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-x-4 gap-y-3 max-h-[60vh] overflow-y-auto px-1">
                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">Username</label>
                  <input v-model="newIntern.username" type="text" required class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500" />
                </div>

                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">First Name</label>
                  <input v-model="newIntern.firstName" type="text" required class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500" />
                </div>

                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">Middle Name</label>
                  <input v-model="newIntern.middleName" type="text" class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500" />
                </div>

                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">Last Name</label>
                  <input v-model="newIntern.lastName" type="text" required class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500" />
                </div>

                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">Email</label>
                  <input v-model="newIntern.email" type="email" required class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500" />
                </div>

                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">Assigned Office</label>
                  <input v-model="newIntern.assignedOffice" type="text" class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500" />
                </div>

                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">School / University</label>
                  <input v-model="newIntern.schoolOrUniversity" type="text" class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500" />
                </div>

                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">OJT Required Hours</label>
                  <input v-model.number="newIntern.ojtRequiredHours" type="number" min="0" class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500" />
                </div>

                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">Address</label>
                  <input v-model="newIntern.address" type="text" class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500" />
                </div>

                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">Gender</label>
                  <select v-model="newIntern.gender" class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm bg-white focus:outline-none focus:border-blue-500">
                    <option value="" disabled>Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">Date of Birth</label>
                  <input v-model="newIntern.dateOfBirth" type="date" class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500" />
                </div>

                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">Course / Program</label>
                  <input v-model="newIntern.course" type="text" class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500" />
                </div>

                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">Year Level</label>
                  <select v-model="newIntern.yearLevel" class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm bg-white focus:outline-none focus:border-blue-500">
                    <option value="" disabled>Select Year Level</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="5th Year">5th Year</option>
                  </select>
                </div>

                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">Start Date</label>
                  <input v-model="newIntern.startDate" type="date" class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500" />
                </div>

                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">End Date</label>
                  <input v-model="newIntern.endDate" type="date" class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500" />
                </div>

              </div>

              <div class="flex justify-end gap-2 mt-2">
                <button type="button" class="px-3.5 py-2 rounded text-sm cursor-pointer bg-gray-300 text-gray-800 border-none transition-colors hover:bg-gray-400" @click="closeAddModal" :disabled="savingIntern">
                  Cancel
                </button>
                <button type="submit" class="px-3.5 py-2 rounded text-sm cursor-pointer bg-blue-600 text-white border-none transition-colors hover:bg-blue-700 disabled:opacity-70 disabled:cursor-default" :disabled="savingIntern">
                  {{ savingIntern ? 'Saving...' : 'Save Intern' }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- View/Edit Intern Modal -->
        <div v-if="showViewEditModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000]">
          <div class="bg-white rounded-lg p-6 w-full max-w-[640px] shadow-[0_10px_25px_rgba(0,0,0,0.2)]">
            <h3 class="m-0 mb-4 text-[1.1rem] text-gray-800 font-bold">
              {{ viewEditMode === 'view' ? 'View Student Intern' : 'Edit Student Intern' }}
            </h3>

            <form @submit.prevent="handleUpdateIntern" class="flex flex-col gap-4">
              <div class="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-x-4 gap-y-3 max-h-[60vh] overflow-y-auto px-1">
                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">Username</label>
                  <input v-model="selectedIntern.username" type="text" :disabled="viewEditMode === 'view'" class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed" />
                </div>

                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">First Name</label>
                  <input v-model="selectedIntern.firstName" type="text" :disabled="viewEditMode === 'view'" class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed" />
                </div>

                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">Middle Name</label>
                  <input v-model="selectedIntern.middleName" type="text" :disabled="viewEditMode === 'view'" class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed" />
                </div>

                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">Last Name</label>
                  <input v-model="selectedIntern.lastName" type="text" :disabled="viewEditMode === 'view'" class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed" />
                </div>

                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">Email</label>
                  <input v-model="selectedIntern.email" type="email" :disabled="viewEditMode === 'view'" class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed" />
                </div>

                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">Assigned Office</label>
                  <input v-model="selectedIntern.assignedOffice" type="text" :disabled="viewEditMode === 'view'" class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed" />
                </div>

                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">School / University</label>
                  <input v-model="selectedIntern.schoolOrUniversity" type="text" :disabled="viewEditMode === 'view'" class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed" />
                </div>

                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">OJT Required Hours</label>
                  <input v-model.number="selectedIntern.ojtRequiredHours" type="number" min="0" :disabled="viewEditMode === 'view'" class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed" />
                </div>

                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">Address</label>
                  <input v-model="selectedIntern.address" type="text" :disabled="viewEditMode === 'view'" class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed" />
                </div>

                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">Gender</label>
                  <select v-model="selectedIntern.gender" :disabled="viewEditMode === 'view'" class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed">
                    <option value="" disabled>Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">Date of Birth</label>
                  <input v-model="selectedIntern.dateOfBirth" type="date" :disabled="viewEditMode === 'view'" class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed" />
                </div>

                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">Course / Program</label>
                  <input v-model="selectedIntern.course" type="text" :disabled="viewEditMode === 'view'" class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed" />
                </div>

                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">Year Level</label>
                  <select v-model="selectedIntern.yearLevel" :disabled="viewEditMode === 'view'" class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed">
                    <option value="" disabled>Select Year Level</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="5th Year">5th Year</option>
                  </select>
                </div>

                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">Start Date</label>
                  <input v-model="selectedIntern.startDate" type="date" :disabled="viewEditMode === 'view'" class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed" />
                </div>

                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">End Date</label>
                  <input v-model="selectedIntern.endDate" type="date" :disabled="viewEditMode === 'view'" class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed" />
                </div>
                
              </div>

              <div class="flex justify-end gap-2 mt-2">
                <button type="button" class="px-3.5 py-2 rounded text-sm cursor-pointer bg-gray-300 text-gray-800 border-none transition-colors hover:bg-gray-400" @click="closeViewEditModal" :disabled="savingIntern">
                  Close
                </button>
                <button
                  v-if="viewEditMode === 'edit'"
                  type="submit"
                  class="px-3.5 py-2 rounded text-sm cursor-pointer bg-blue-600 text-white border-none transition-colors hover:bg-blue-700 disabled:opacity-70 disabled:cursor-default"
                  :disabled="savingIntern"
                >
                  {{ savingIntern ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>
            </form>
          </div>
        </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script>
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { db } from '../../firebase'
import AdminSidebar from './AdminSidebar.vue'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default {
  name: 'AdminStudentInternsView',
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
      currentPage: 1,
      itemsPerPage: 10,
      showAddModal: false,
      savingIntern: false,
      newIntern: {
        username: '',
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        assignedOffice: '',
        schoolOrUniversity: '',
        ojtRequiredHours: null,
        address: '',
        gender: '',
        dateOfBirth: '',
        course: '',
        yearLevel: '',
        startDate: '',
        endDate: '',
      },
      showViewEditModal: false,
      viewEditMode: 'view',
      selectedIntern: null,
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
    totalPages() {
      return Math.ceil(this.filteredInterns.length / this.itemsPerPage) || 1
    },
    paginatedInterns() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredInterns.slice(start, end)
    }
  },
  watch: {
    search() {
      this.currentPage = 1
    },
    roleFilter() {
      this.currentPage = 1
    },
    itemsPerPage() {
      this.currentPage = 1
    }
  },
  methods: {
    loadImage(url) {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = (e) => reject(e)
        img.src = url
      })
    },
    async exportToPDF() {
      const doc = new jsPDF({ unit: 'pt', format: 'legal', orientation: 'landscape' });
      const pageWidth = doc.internal.pageSize.getWidth();
      
      try {
        const logo1 = await this.loadImage('/dictlogo2.png');
        const logo2 = await this.loadImage('/Bagongpilipinas.png');
        doc.addImage(logo1, 'PNG', 40, 15, 75, 75);
        doc.addImage(logo2, 'PNG', pageWidth - 115, 15, 75, 75);
      } catch(e) { console.error('Error loading logos', e); }

      doc.setFont('Times', 'normal');
      doc.setFontSize(12);
      const text1 = 'REPUBLIC OF THE PHILIPPINES';
      doc.text(text1, (pageWidth - doc.getTextWidth(text1)) / 2, 50);

      doc.setFont('Times', 'bold');
      doc.setFontSize(14);
      const text2 = 'DEPARTMENT OF INFORMATION AND COMMUNICATIONS TECHNOLOGY';
      doc.text(text2, (pageWidth - doc.getTextWidth(text2)) / 2, 65);

      doc.setFont('Times', 'normal');
      doc.setFontSize(12);
      const text3 = 'Student Interns Report';
      doc.text(text3, (pageWidth - doc.getTextWidth(text3)) / 2, 85);

      const tableColumn = [
        "Name", "Email", "Assigned Office", "School", 
        "Req. Hrs", "Address", "Gender", "DOB", 
        "Course", "Yr Lvl", "Started", "Ended"
      ];
      const tableRows = [];

      this.filteredInterns.forEach((intern) => {
        const rowData = [
          this.formatName(intern),
          intern.email || '-',
          intern.assignedOffice || '-',
          intern.schoolOrUniversity || '-',
          intern.ojtRequiredHours ?? '-',
          intern.address || '-',
          intern.gender || '-',
          intern.dateOfBirth || '-',
          intern.course || "-",
          intern.yearLevel || "-",
          intern.startDate || "-",
          intern.endDate || "-"
        ];
        tableRows.push(rowData);
      });

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 110,
        styles: { fontSize: 7, cellPadding: 3 },
        headStyles: { fillColor: [24, 98, 240] }
      });

      doc.save('Student_Interns.pdf');
    },
    async exportToWord() {
      const getBase64Image = async (url) => {
        try {
          const img = await this.loadImage(url);
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          return canvas.toDataURL('image/png');
        } catch(e) {
          return '';
        }
      };

      const logoDict = await getBase64Image('/dictlogo2.png');
      const logoBp = await getBase64Image('/Bagongpilipinas.png');

      const dictImgHtml = logoDict ? `<img src="${logoDict}" width="75" height="75" />` : '';
      const bpImgHtml = logoBp ? `<img src="${logoBp}" width="75" height="75" />` : '';

      let html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Student Interns</title>
        <style>
          @page WordSection1 {
            size: 841.9pt 595.3pt; /* A4 Landscape */
            mso-page-orientation: landscape;
            margin: 1.0in 1.0in 1.0in 1.0in;
          }
          div.WordSection1 { page: WordSection1; }
        </style>
      </head>
      <body>
      <div class="WordSection1">`;
      
      html += `<table width="100%" style="margin-bottom: 20px;">
        <tr>
          <td width="20%" align="left">${dictImgHtml}</td>
          <td width="60%" align="center">
            <p style="font-family: 'Times New Roman', Times, serif; font-size: 14pt; margin: 0;">REPUBLIC OF THE PHILIPPINES</p>
            <p style="font-family: 'Times New Roman', Times, serif; font-size: 12pt; font-weight: bold; margin: 0;">DEPARTMENT OF INFORMATION AND COMMUNICATIONS TECHNOLOGY</p>
            <p style="font-family: 'Times New Roman', Times, serif; font-size: 12pt; margin: 0; margin-top: 10px;">Student Interns Report</p>
          </td>
          <td width="20%" align="right">${bpImgHtml}</td>
        </tr>
      </table>`;

      html += `<table border="1" cellspacing="0" cellpadding="5" style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 10pt;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th>Name</th>
            <th>Email</th>
            <th>Assigned Office</th>
            <th>School/University</th>
            <th>Required Hrs</th>
            <th>Address</th>
            <th>Gender</th>
            <th>DOB</th>
            <th>Course</th>
            <th>Yr Lvl</th>
            <th>Start Date</th>
            <th>End Date</th>
          </tr>
        </thead>
        <tbody>`;

      this.filteredInterns.forEach((intern) => {
        html += `<tr>
          <td>${this.formatName(intern)}</td>
          <td>${intern.email || '-'}</td>
          <td>${intern.assignedOffice || '-'}</td>
          <td>${intern.schoolOrUniversity || '-'}</td>
          <td>${intern.ojtRequiredHours ?? '-'}</td>
          <td>${intern.address || '-'}</td>
          <td>${intern.gender || '-'}</td>
          <td>${intern.dateOfBirth || '-'}</td>
          <td>${intern.course || '-'}</td>
          <td>${intern.yearLevel || '-'}</td>
          <td>${intern.startDate || '-'}</td>
          <td>${intern.endDate || '-'}</td>
        </tr>`;
      });

      html += `</tbody></table></div></body></html>`;

      const blob = new Blob(['\ufeff', html], {
        type: 'application/msword'
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Student_Interns.doc';
      link.click();
      URL.revokeObjectURL(url);
    },
    async fetchInterns() {
      this.loading = true
      this.error = ''

      try {
        const usersRef = collection(db, 'users')
        const q = query(
          usersRef,
          where('role', '==', 'student')
        )

        const snap = await getDocs(q)
        this.interns = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      } catch (err) {
        console.error('Error fetching interns:', err)
        this.error = 'Failed to load student interns from Firestore.'
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
    openAddModal() {
      this.showAddModal = true
    },
    closeAddModal() {
      if (this.savingIntern) return
      this.showAddModal = false
    },
    async handleAddIntern() {
      this.savingIntern = true

      try {
        const payload = {
          username: this.newIntern.username,
          firstName: this.newIntern.firstName,
          middleName: this.newIntern.middleName || '',
          lastName: this.newIntern.lastName,
          email: this.newIntern.email,
          assignedOffice: this.newIntern.assignedOffice || '',
          schoolOrUniversity: this.newIntern.schoolOrUniversity || '',
          ojtRequiredHours: this.newIntern.ojtRequiredHours ?? null,
          address: this.newIntern.address || '',
          gender: this.newIntern.gender || '',
          dateOfBirth: this.newIntern.dateOfBirth || '',
          course: this.newIntern.course || '',
          yearLevel: this.newIntern.yearLevel || '',
          startDate: this.newIntern.startDate || '',
          endDate: this.newIntern.endDate || '',
          role: 'student',
          position: 'intern',
        }

        await addDoc(collection(db, 'users'), payload)

        // Reset form
        this.newIntern = {
          username: '',
          firstName: '',
          middleName: '',
          lastName: '',
          email: '',
          assignedOffice: '',
          schoolOrUniversity: '',
          ojtRequiredHours: null,
          address: '',
          gender: '',
          dateOfBirth: '',
          course: '',
          yearLevel: '',
          startDate: '',
          endDate: '',
        }

        this.showAddModal = false
        await this.fetchInterns()
      } catch (err) {
        console.error('Error adding intern:', err)
        alert('Failed to add intern.')
      } finally {
        this.savingIntern = false
      }
    },
    openViewEditModal(intern, mode) {
      this.viewEditMode = mode
      this.selectedIntern = { ...intern }
      this.showViewEditModal = true
    },
    closeViewEditModal() {
      if (this.savingIntern) return
      this.showViewEditModal = false
      this.selectedIntern = null
    },
    async handleUpdateIntern() {
      if (this.viewEditMode !== 'edit' || !this.selectedIntern?.id) {
        this.closeViewEditModal()
        return
      }

      this.savingIntern = true

      try {
        const internId = this.selectedIntern.id
        const internRef = doc(db, 'users', internId)

        const payload = {
          username: this.selectedIntern.username || '',
          firstName: this.selectedIntern.firstName || '',
          middleName: this.selectedIntern.middleName || '',
          lastName: this.selectedIntern.lastName || '',
          email: this.selectedIntern.email || '',
          assignedOffice: this.selectedIntern.assignedOffice || '',
          schoolOrUniversity: this.selectedIntern.schoolOrUniversity || '',
          ojtRequiredHours: this.selectedIntern.ojtRequiredHours ?? null,
          address: this.selectedIntern.address || '',
          gender: this.selectedIntern.gender || '',
          dateOfBirth: this.selectedIntern.dateOfBirth || '',
          course: this.selectedIntern.course || '',
          yearLevel: this.selectedIntern.yearLevel || '',
          startDate: this.selectedIntern.startDate || '',
          endDate: this.selectedIntern.endDate || '',
        }

        await updateDoc(internRef, payload)

        this.showViewEditModal = false
        this.selectedIntern = null

        // Refresh list so AM Tag / PM Tag columns show latest values from Firestore
        await this.fetchInterns()
      } catch (err) {
        console.error('Error updating intern:', err)
        alert('Failed to update intern.')
      } finally {
        this.savingIntern = false
      }
    },
    async confirmDeleteIntern(intern) {
      const ok = window.confirm(`Delete intern ${this.formatName(intern)}? This cannot be undone.`)
      if (!ok) return

      try {
        const ref = doc(db, 'users', intern.id)
        await deleteDoc(ref)
        await this.fetchInterns()
      } catch (err) {
        console.error('Error deleting intern:', err)
        alert('Failed to delete intern.')
      }
    },
  },
  created() {
    this.fetchInterns()
  },
}
</script>

