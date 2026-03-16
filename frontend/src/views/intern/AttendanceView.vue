<template>
  <div class="min-h-screen bg-slate-50 font-sans text-gray-800">
    <header class="bg-slate-800 text-white px-8 py-4 flex flex-wrap items-center justify-between gap-4">
      <h1 class="m-0 text-[1.4rem] font-bold">My Attendance Records</h1>
      <div class="flex items-center gap-4">
        <nav class="flex flex-wrap gap-3">
          <router-link to="/intern/dashboard" class="text-gray-200 no-underline px-3.5 py-1.5 rounded-full text-sm border border-transparent transition-colors hover:bg-slate-900 [&.router-link-active]:bg-orange-500 [&.router-link-active]:text-slate-900 [&.router-link-active]:border-orange-500">Dashboard</router-link>
          <router-link to="/intern/time" class="text-gray-200 no-underline px-3.5 py-1.5 rounded-full text-sm border border-transparent transition-colors hover:bg-slate-900 [&.router-link-active]:bg-orange-500 [&.router-link-active]:text-slate-900 [&.router-link-active]:border-orange-500">Time In / Out</router-link>
          <router-link to="/intern/attendance" class="text-gray-200 no-underline px-3.5 py-1.5 rounded-full text-sm border border-transparent transition-colors hover:bg-slate-900 [&.router-link-active]:bg-orange-500 [&.router-link-active]:text-slate-900 [&.router-link-active]:border-orange-500">My Attendance</router-link>
          <router-link to="/intern/staff-status" class="text-gray-200 no-underline px-3.5 py-1.5 rounded-full text-sm border border-transparent transition-colors hover:bg-slate-900 [&.router-link-active]:bg-orange-500 [&.router-link-active]:text-slate-900 [&.router-link-active]:border-orange-500">Staff Status</router-link>
          <router-link to="/intern/notifications" class="text-gray-200 no-underline px-3.5 py-1.5 rounded-full text-sm border border-transparent transition-colors hover:bg-slate-900 [&.router-link-active]:bg-orange-500 [&.router-link-active]:text-slate-900 [&.router-link-active]:border-orange-500">Notifications</router-link>
          <router-link to="/intern/profile" class="text-gray-200 no-underline px-3.5 py-1.5 rounded-full text-sm border border-transparent transition-colors hover:bg-slate-900 [&.router-link-active]:bg-orange-500 [&.router-link-active]:text-slate-900 [&.router-link-active]:border-orange-500">Profile</router-link>
          <router-link to="/intern/settings" class="text-gray-200 no-underline px-3.5 py-1.5 rounded-full text-sm border border-transparent transition-colors hover:bg-slate-900 [&.router-link-active]:bg-orange-500 [&.router-link-active]:text-slate-900 [&.router-link-active]:border-orange-500">Settings</router-link>
        </nav>

        <div class="relative cursor-pointer" @click="toggleNotifications">
          <div class="relative w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center transition-colors hover:bg-slate-700">
            <span class="text-base">🔔</span>
            <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-[10px] px-1.5 py-0 min-w-[18px] text-center shadow-sm">{{ unreadCount }}</span>
          </div>
          <div v-if="showNotifications" class="absolute right-0 mt-2 bg-white text-slate-900 min-w-[220px] rounded-xl shadow-[0_10px_25px_rgba(15,23,42,0.25)] p-3 z-20" @click.stop>
            <h3 class="m-0 mb-2 text-sm font-semibold">Notifications</h3>
            <ul v-if="notifications.length" class="list-none p-0 m-0 text-[0.85rem]">
              <li v-for="(n, idx) in notifications" :key="idx" class="mt-1 first:mt-0 border-b border-slate-100 pb-2 last:border-0 last:pb-0">{{ n.message || n }}</li>
            </ul>
            <p v-else class="m-0 text-[0.8rem] text-gray-500">No notifications</p>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-[1100px] mx-auto my-8 px-4 flex flex-col gap-6">
      <section class="bg-white rounded-2xl shadow-[0_10px_25px_rgba(15,23,42,0.08)] p-6">
        <h2 class="mt-0 mb-4 text-[1.1rem] text-slate-900 border-b border-slate-100 pb-2">Filters</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
          <div>
            <label for="month" class="block mb-1.5 text-[0.85rem] text-slate-600 font-medium">Month</label>
            <select id="month" v-model="selectedMonth" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 bg-white">
              <option value="">All</option>
              <option v-for="m in availableMonths" :key="m.value" :value="m.value">
                {{ m.label }}
              </option>
            </select>
          </div>
          <div>
            <label for="from" class="block mb-1.5 text-[0.85rem] text-slate-600 font-medium">From</label>
            <input id="from" type="date" v-model="fromDate" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 bg-white" />
          </div>
          <div>
            <label for="to" class="block mb-1.5 text-[0.85rem] text-slate-600 font-medium">To</label>
            <input id="to" type="date" v-model="toDate" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 bg-white" />
          </div>
          <div class="flex justify-end md:justify-start">
            <button class="px-5 py-2.5 rounded-full border-none bg-orange-500 text-white text-sm font-semibold cursor-pointer transition-colors hover:bg-orange-600 w-full md:w-auto" @click="exportPdf">Download DTR</button>
          </div>
        </div>
      </section>

      <section class="bg-white rounded-2xl shadow-[0_10px_25px_rgba(15,23,42,0.08)] p-6">
        <h2 class="mt-0 mb-4 text-[1.1rem] text-slate-900 border-b border-slate-100 pb-2">Attendance</h2>
        <div class="overflow-x-auto">
          <table class="w-full border-collapse text-sm">
            <thead>
              <tr class="bg-slate-50">
                <th class="font-semibold text-[0.8rem] uppercase tracking-wider text-slate-500 px-4 py-3 text-left border-b border-slate-200">Date</th>
                <th class="font-semibold text-[0.8rem] uppercase tracking-wider text-slate-500 px-4 py-3 text-left border-b border-slate-200">Time In</th>
                <th class="font-semibold text-[0.8rem] uppercase tracking-wider text-slate-500 px-4 py-3 text-left border-b border-slate-200">Time Out</th>
                <th class="font-semibold text-[0.8rem] uppercase tracking-wider text-slate-500 px-4 py-3 text-left border-b border-slate-200">Total Hours</th>
                <th class="font-semibold text-[0.8rem] uppercase tracking-wider text-slate-500 px-4 py-3 text-left border-b border-slate-200">Tag</th>
                <th class="font-semibold text-[0.8rem] uppercase tracking-wider text-slate-500 px-4 py-3 text-left border-b border-slate-200">Validation</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in paginatedRecords" :key="record.id + '-' + (record.sessionLabel || 'all')" class="hover:bg-slate-50/50 transition-colors cursor-pointer" @click="openDetailsModal(record)">
                <td class="px-4 py-3 border-b border-slate-100 text-slate-700">{{ formatDate(record.date) }}</td>
                <td class="px-4 py-3 border-b border-slate-100 text-slate-700">{{ formatTime12h(record.timeIn) }}</td>
                <td class="px-4 py-3 border-b border-slate-100 text-slate-700">{{ formatTime12h(record.timeOut) }}</td>
                <td class="px-4 py-3 border-b border-slate-100 text-slate-900 font-medium">{{ record.totalHoursLabel || '0h 0m' }}</td>
                <td class="px-4 py-3 border-b border-slate-100">
                  <span :class="['inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold', record.status === 'Overtime' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-green-100 text-green-800 border border-green-200']">
                    {{ record.status }}
                  </span>
                </td>
                <td class="px-4 py-3 border-b border-slate-100">
                  <span :class="[
                    'inline-flex items-center w-fit px-2.5 py-1 rounded-full text-xs font-semibold border',
                    (record.validationStatus || 'Pending') === 'Pending' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                    (record.validationStatus || 'Pending') === 'Approved' ? 'bg-green-100 text-green-800 border-green-200' :
                    'bg-red-100 text-red-800 border-red-200'
                  ]">
                    {{ record.validationStatus || 'Pending' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6 pt-4 border-t border-slate-200 gap-4" v-if="tableRecords.length > 0">
          <div class="flex items-center gap-2 text-[0.85rem] text-slate-600">
            <label for="itemsPerPage">Showing</label>
            <select id="itemsPerPage" v-model="itemsPerPage" @change="currentPage = 1" class="w-auto px-2 py-1.5 rounded-md border border-slate-300 text-slate-900 focus:outline-none">
              <option :value="10">10</option>
              <option :value="15">15</option>
              <option :value="20">20</option>
              <option :value="25">25</option>
              <option :value="30">30</option>
            </select>
            <span>records per page</span>
          </div>

          <div class="flex items-center gap-4">
            <button class="px-3.5 py-1.5 rounded-md border border-slate-300 bg-white text-slate-700 text-[0.85rem] cursor-pointer transition-colors hover:bg-slate-100 hover:border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed" :disabled="currentPage === 1" @click="currentPage--">Previous</button>
            <span class="text-[0.85rem] text-slate-600 font-medium">Page {{ currentPage }} of {{ totalPages }}</span>
            <button class="px-3.5 py-1.5 rounded-md border border-slate-300 bg-white text-slate-700 text-[0.85rem] cursor-pointer transition-colors hover:bg-slate-100 hover:border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed" :disabled="currentPage === totalPages" @click="currentPage++">Next</button>
          </div>
        </div>

      </section>
    </main>

    <!-- Record Details Modal -->
    <div v-if="showDetailsModal && selectedRecord" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="closeDetailsModal"></div>
      <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
        <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 class="text-lg font-semibold text-slate-800 m-0">Attendance Details</h3>
          <button @click="closeDetailsModal" class="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer bg-transparent border-none">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-6 flex flex-col gap-4">
          <div class="flex justify-between items-center border-b border-slate-100 pb-3">
            <span class="text-slate-500 text-sm font-medium">Date</span>
            <span class="text-slate-900 font-medium">{{ formatDate(selectedRecord.date) }}</span>
          </div>
          <div class="flex justify-between items-center border-b border-slate-100 pb-3" v-if="selectedRecord.sessionLabel">
            <span class="text-slate-500 text-sm font-medium">Session</span>
            <span class="text-slate-900 font-medium">{{ selectedRecord.sessionLabel }}</span>
          </div>
          <div class="flex justify-between items-center border-b border-slate-100 pb-3">
            <span class="text-slate-500 text-sm font-medium">Time In</span>
            <span class="text-slate-900">{{ formatTime12h(selectedRecord.timeIn) }}</span>
          </div>
          <div class="flex justify-between items-center border-b border-slate-100 pb-3">
            <span class="text-slate-500 text-sm font-medium">Time Out</span>
            <span class="text-slate-900">{{ formatTime12h(selectedRecord.timeOut) }}</span>
          </div>
          <div class="flex justify-between items-center border-b border-slate-100 pb-3">
            <span class="text-slate-500 text-sm font-medium">Total Hours</span>
            <span class="text-slate-900 font-medium">{{ selectedRecord.totalHoursLabel || '0h 0m' }}</span>
          </div>
          <div class="flex justify-between items-center border-b border-slate-100 pb-3">
            <span class="text-slate-500 text-sm font-medium">Tag</span>
            <span :class="['inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold', selectedRecord.status === 'Overtime' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-green-100 text-green-800 border border-green-200']">
              {{ selectedRecord.status }}
            </span>
          </div>
          <div class="flex justify-between items-center border-b border-slate-100 pb-3">
            <span class="text-slate-500 text-sm font-medium">Validation</span>
            <span :class="[
              'inline-flex items-center w-fit px-2.5 py-1 rounded-full text-xs font-semibold border',
              (selectedRecord.validationStatus || 'Pending') === 'Pending' ? 'bg-amber-100 text-amber-800 border-amber-200' :
              (selectedRecord.validationStatus || 'Pending') === 'Approved' ? 'bg-green-100 text-green-800 border-green-200' :
              'bg-red-100 text-red-800 border-red-200'
            ]">
              {{ selectedRecord.validationStatus || 'Pending' }}
            </span>
          </div>
          <div v-if="(selectedRecord.validationStatus || 'Pending') === 'Rejected' && selectedRecord.rejectReason" class="flex flex-col gap-2 bg-red-50 p-4 rounded-xl border border-red-100 mt-2">
            <span class="text-red-800 text-sm font-semibold flex items-center gap-1.5">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Reason for Rejection
            </span>
            <span class="text-[0.9rem] text-red-700 leading-relaxed">
              {{ selectedRecord.rejectReason }}
            </span>
          </div>
        </div>
        <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button @click="closeDetailsModal" class="px-5 py-2.5 rounded-full border-none bg-slate-800 text-white text-sm font-semibold cursor-pointer transition-colors hover:bg-slate-700">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InternAttendanceView',
  data() {
    return {
      selectedMonth: '',
      fromDate: '',
      toDate: '',
      records: [],
      internName: '',
      internTagging: '',
      notifications: [],
      internId: null,
      showNotifications: false,
      currentPage: 1,
      itemsPerPage: 10,
      showDetailsModal: false,
      selectedRecord: null
    }
  },
  created() {
    const stored = localStorage.getItem('internUser');
    if (!stored) {
      alert('No logged-in intern found. Please log in again.');
      this.$router.push({ name: 'Login' }); // adjust route name if needed
      return;
    }

    const intern = JSON.parse(stored);
    this.internId = intern.id || null;

    fetch(`http://localhost:3001/users/${encodeURIComponent(intern.id)}`)
      .then((res) => res.ok ? res.json() : null)
      .then((userJson) => {
        const u = userJson && userJson.user ? userJson.user : intern;
        const first = u.firstName || u.firstname || '';
        const last = u.lastName || u.lastname || '';
        const middle = u.middleName || u.middlename || u.middleInitial || '';

        this.internTagging = u.tagging || '';

        if (last || first || middle) {
          const main = `${last}${last && (first || middle) ? ', ' : ''}${first}`.trim();
          const withMiddle = middle ? `${main} ${middle}`.trim() : main;
          this.internName = withMiddle;
        } else {
          this.internName = u.fullName || u.name || '';
        }
      })
      .catch(() => {
        const first = intern.firstName || intern.firstname || '';
        const last = intern.lastName || intern.lastname || '';
        const middle = intern.middleName || intern.middlename || intern.middleInitial || '';
        if (last || first || middle) {
          const main = `${last}${last && (first || middle) ? ', ' : ''}${first}`.trim();
          const withMiddle = middle ? `${main} ${middle}`.trim() : main;
          this.internName = withMiddle;
        } else {
          this.internName = intern.fullName || intern.name || '';
        }

        this.internTagging = intern.tagging || '';
      });

    fetch(`http://localhost:3001/attendance/intern/history?internId=${encodeURIComponent(intern.id)}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch attendance history');
        }
        return res.json();
      })
      .then((json) => {
        this.records = (json.data || []).map((r) => ({
          id: r.id,
          date: r.date,
          timeIn: r.timeIn ? r.timeIn.slice(0, 5) : '--:--',
          timeOut: r.timeOut ? r.timeOut.slice(0, 5) : '--:--',
          timeInAM: r.timeInAM ? r.timeInAM.slice(0, 5) : '',
          timeOutAM: r.timeOutAM ? r.timeOutAM.slice(0, 5) : '',
          timeInPM: r.timeInPM ? r.timeInPM.slice(0, 5) : '',
          timeOutPM: r.timeOutPM ? r.timeOutPM.slice(0, 5) : '',
          totalMinutesAM: r.totalMinutesAM ?? null,
          totalMinutesPM: r.totalMinutesPM ?? null,
          totalMinutes: r.totalMinutes ?? null,
          normalCountMinutes: r.normalCountMinutes ?? null,
          overtimeMinutes: r.overtimeMinutes ?? null,
          totalHours: r.totalHours || '0.0',
          statusAM: r.statusAM || null,
          statusPM: r.statusPM || null,
          tagging: r.tagging || null,
          tagAM: r.tagAM || null,
          tagPM: r.tagPM || null,
          validationStatusAM: r.validationStatusAM || 'Pending',
          rejectReasonAM: r.rejectReasonAM || null,
          validationStatusPM: r.validationStatusPM || 'Pending',
          rejectReasonPM: r.rejectReasonPM || null,
        }));

        // Load notifications for header bell
        if (this.internId) {
          try {
            const key = `internNotifications_${this.internId}`;
            const unreadKey = `internNotificationsUnread_${this.internId}`;
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
          } catch (e) {}
        }
      })
      .catch((err) => {
        console.error('Attendance history fetch error:', err);
        alert('Failed to load attendance records.');
      });
  },
  methods: {
    openDetailsModal(record) {
      this.selectedRecord = record;
      this.showDetailsModal = true;
    },
    closeDetailsModal() {
      this.showDetailsModal = false;
      this.selectedRecord = null;
    },
    toggleNotifications() {
      this.showNotifications = !this.showNotifications
    },
    formatDate(dateStr) {
      if (!dateStr) return '';
      const d = new Date(dateStr);
      if (Number.isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    },
    formatTime12h(timeStr) {
      if (!timeStr) return '';
      if (timeStr === '--:--') return '--:--';
      const [hStr, mStr] = timeStr.split(':');
      const hNum = parseInt(hStr, 10);
      if (Number.isNaN(hNum)) return timeStr;
      const period = hNum >= 12 ? 'PM' : 'AM';
      const hour12 = hNum % 12 === 0 ? 12 : hNum % 12;
      return `${hour12}:${mStr} ${period}`;
    },
    formatMinutesToLabel(totalMinutes) {
      const safeMinutes = Number.isFinite(totalMinutes) && totalMinutes > 0 ? totalMinutes : 0;
      const h = Math.floor(safeMinutes / 60);
      const m = safeMinutes % 60;
      return `${h}h ${m}m`;
    },
    exportPdf() {
      if (!this.filteredRecords.length) {
        alert('No attendance records to export.');
        return;
      }

      const parseLocalDate = (ymd) => {
        if (!ymd || typeof ymd !== 'string') return null;
        const m = ymd.match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (!m) return null;
        const y = parseInt(m[1], 10);
        const mo = parseInt(m[2], 10);
        const d = parseInt(m[3], 10);
        if ([y, mo, d].some(n => Number.isNaN(n))) return null;
        return new Date(y, mo - 1, d);
      };

      const resolveBaseDate = () => {
        if (this.selectedMonth) {
          const parsed = parseLocalDate(`${this.selectedMonth}-01`);
          if (parsed && !Number.isNaN(parsed.getTime())) return parsed;
        }
        if (this.fromDate) {
          const parsed = parseLocalDate(this.fromDate);
          if (parsed && !Number.isNaN(parsed.getTime())) return parsed;
        }
        const firstWithDate = this.filteredRecords.find(r => !!r.date);
        if (firstWithDate && firstWithDate.date) {
          const parsed = parseLocalDate(firstWithDate.date);
          if (parsed && !Number.isNaN(parsed.getTime())) return parsed;
        }
        return new Date();
      };

      const baseDate = resolveBaseDate();
      const year = baseDate.getFullYear();
      const monthIndex = baseDate.getMonth();
      const monthName = baseDate.toLocaleDateString('en-US', { month: 'long' });
      const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

      const byDay = {};

      this.filteredRecords.forEach((r) => {
        if (!r.date) return;
        const d = parseLocalDate(r.date) || new Date(r.date);
        if (!d || Number.isNaN(d.getTime())) return;
        if (d.getFullYear() !== year || d.getMonth() !== monthIndex) return;

        const dayNum = d.getDate();
        if (dayNum < 1 || dayNum > 31) return;

        const amArrival = r.timeInAM ? this.formatTime12h(r.timeInAM) : '';
        const amDeparture = r.timeOutAM ? this.formatTime12h(r.timeOutAM) : '';
        const pmArrival = r.timeInPM ? this.formatTime12h(r.timeInPM) : '';
        const pmDeparture = r.timeOutPM ? this.formatTime12h(r.timeOutPM) : '';

        byDay[dayNum] = {
          amArrival,
          amDeparture,
          pmArrival,
          pmDeparture,
          hours: (() => {
            const num = parseFloat(r.totalHours || '0');
            const safe = Number.isFinite(num) ? num : 0;
            const totalMinutes = Math.round(safe * 60);
            const h = Math.floor(totalMinutes / 60);
            const m = totalMinutes % 60;
            return { h, m };
          })(),
        };
      });

      let tableHtmlOne = '';
      tableHtmlOne += '<div style="font-family:serif;margin:20px 20px 10px 20px;font-size:11px;">';
      tableHtmlOne += '<div style="text-align:center;margin-bottom:4px;">Civil Service Form No. 48</div>';
      tableHtmlOne += '<div style="text-align:center;font-weight:bold;font-size:14px;margin-bottom:10px;">DAILY TIME RECORD</div>';
      tableHtmlOne += `<div style="text-align:center;margin:10px 0 2px 0;border-bottom:1px solid #000;padding-bottom:2px;">${this.internName || '(Name)'}</div>`;
      tableHtmlOne += `<div style="margin-top:6px;">For the month of <span style="text-decoration:underline;">${monthName} ${year}</span></div>`;
      tableHtmlOne += '<div style="margin-top:2px;display:flex;justify-content:space-between;align-items:flex-start;font-size:9px;">';
      tableHtmlOne += '<div>Official hours of arrival<br/>and departure</div>';
      tableHtmlOne += '<div style="text-align:left;">Regular days ________<br/>Saturdays ________</div>';
      tableHtmlOne += '</div>';
      tableHtmlOne += '</div>';

      tableHtmlOne += '<table border="1" cellspacing="0" cellpadding="3" style="border-collapse:collapse;font-family:sans-serif;font-size:9px;width:100%;margin:0 auto;">';
      tableHtmlOne += '<thead>';
      tableHtmlOne += '<tr>';
      tableHtmlOne += '<th rowspan="2" style="width:6%;">Day</th>';
      tableHtmlOne += '<th colspan="2">A.M.</th>';
      tableHtmlOne += '<th colspan="2">P.M.</th>';
      tableHtmlOne += '<th colspan="2">Undertime</th>';
      tableHtmlOne += '</tr>';
      tableHtmlOne += '<tr>';
      tableHtmlOne += '<th style="width:14%;">Arrival</th>';
      tableHtmlOne += '<th style="width:14%;">Departure</th>';
      tableHtmlOne += '<th style="width:14%;">Arrival</th>';
      tableHtmlOne += '<th style="width:14%;">Departure</th>';
      tableHtmlOne += '<th style="width:12%;">Hours</th>';
      tableHtmlOne += '<th style="width:12%;">Minutes</th>';
      tableHtmlOne += '</tr>';
      tableHtmlOne += '</thead>';
      tableHtmlOne += '<tbody>';

      for (let day = 1; day <= daysInMonth; day++) {
        const data = byDay[day];
        const amArr = data ? data.amArrival : '';
        const amDep = data ? data.amDeparture : '';
        const pmArr = data ? data.pmArrival : '';
        const pmDep = data ? data.pmDeparture : '';
        const hoursVal = '';
        const minsVal = '';

        const currentDt = new Date(year, monthIndex, day);
        const dayOfWeek = currentDt.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        tableHtmlOne += '<tr>';
        tableHtmlOne += `<td style="text-align:center;">${day}</td>`;
        
        if (isWeekend && !amArr && !amDep && !pmArr && !pmDep) {
          const dayName = dayOfWeek === 0 ? 'SUNDAY' : 'SATURDAY';
          tableHtmlOne += `<td colspan="4" style="text-align:center; font-weight:bold; letter-spacing: 2px;">${dayName}</td>`;
          tableHtmlOne += `<td style="text-align:center;"></td>`;
          tableHtmlOne += `<td style="text-align:center;"></td>`;
        } else {
          tableHtmlOne += `<td style="text-align:center;">${amArr}</td>`;
          tableHtmlOne += `<td style="text-align:center;">${amDep}</td>`;
          tableHtmlOne += `<td style="text-align:center;">${pmArr}</td>`;
          tableHtmlOne += `<td style="text-align:center;">${pmDep}</td>`;
          tableHtmlOne += `<td style="text-align:center;">${hoursVal}</td>`;
          tableHtmlOne += `<td style="text-align:center;">${minsVal}</td>`;
        }
        tableHtmlOne += '</tr>';
      }

      for (let day = daysInMonth + 1; day <= 31; day++) {
        tableHtmlOne += '<tr>';
        tableHtmlOne += `<td style="text-align:center;">${day}</td>`;
        tableHtmlOne += `<td style="text-align:center;"></td>`;
        tableHtmlOne += `<td style="text-align:center;"></td>`;
        tableHtmlOne += `<td style="text-align:center;"></td>`;
        tableHtmlOne += `<td style="text-align:center;"></td>`;
        tableHtmlOne += `<td style="text-align:center;"></td>`;
        tableHtmlOne += `<td style="text-align:center;"></td>`;
        tableHtmlOne += '</tr>';
      }

      tableHtmlOne += '<tr>';
      tableHtmlOne += '<td style="font-weight:bold;text-align:center;">Total</td>';
      tableHtmlOne += '<td></td><td></td><td></td><td></td>';
      tableHtmlOne += '<td style="font-weight:bold;text-align:center;"></td>';
      tableHtmlOne += '<td style="font-weight:bold;text-align:center;"></td>';
      tableHtmlOne += '</tr>';

      tableHtmlOne += '</tbody>';
      tableHtmlOne += '</table>';

      tableHtmlOne += `
        <div style="font-family:serif;font-size:9px;margin-top:10px;text-align:justify;">
          I certify on my honor that the above is a true and correct report of the hours of work performed, record of which was
          made daily at the time of arrival and departure from office.
        </div>
        <div style="height:40px;"></div>
        <div style="text-align:center;font-family:sans-serif;font-size:9px;margin-top:10px;">
          <div>${this.internName || '&nbsp;'}</div>
          <div style="border-top:1px solid #000;margin:0 20px 2px 20px;height:1px;"></div>
          <div>OJT Intern</div>
        </div>
        <div style="height:30px;"></div>
        <div style="text-align:center;font-family:sans-serif;font-size:9px;margin-top:10px;">
          <div style="font-weight:bold;">ENGR. MARVIN D. BEJASA</div>
          <div style="border-top:1px solid #000;margin:0 20px 2px 20px;height:1px;"></div>
          <div>OIC - Provincial Officer</div>
          <div><i>In-Charge</i></div>
        </div>
      `;

      const tableHtml = `
        <div style="display:flex;justify-content:space-between;padding:0 20px;">
          <div style="width:48%;">${tableHtmlOne}</div>
          <div style="width:48%;">${tableHtmlOne}</div>
        </div>
      `;

      const win = window.open('', '_blank');
      if (!win) return;
      win.document.write(`<!DOCTYPE html><html><head><title>Daily Time Record</title></head><body>${tableHtml}</body></html>`);
      win.document.close();
      win.focus();
      win.print();
    }
  },
  computed: {
    availableMonths() {
      const months = [];
      const startYear = 2026;
      let maxDate = new Date();
      
      if (this.records && this.records.length > 0) {
        const recordDates = this.records.map(r => new Date(r.date).getTime()).filter(t => !isNaN(t));
        if (recordDates.length > 0) {
           const maxRecordDate = new Date(Math.max(...recordDates));
           if (maxRecordDate > maxDate) {
               maxDate = maxRecordDate;
           }
        }
      }

      const currentYear = maxDate.getFullYear();
      const currentMonth = maxDate.getMonth();
      for (let y = startYear; y <= currentYear; y++) {
        const maxMonth = y === currentYear ? currentMonth : 11;
        for (let m = 0; m <= maxMonth; m++) {
          const mString = String(m + 1).padStart(2, '0');
          const value = `${y}-${mString}`;
          const date = new Date(y, m, 1);
          const label = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
          months.push({ value, label });
        }
      }
      return months.reverse();
    },
    filteredRecords() {
      return this.records.filter(r => {
        if (this.selectedMonth && !r.date.startsWith(this.selectedMonth)) {
          return false;
        }
        if (this.fromDate && r.date < this.fromDate) {
          return false;
        }
        if (this.toDate && r.date > this.toDate) {
          return false;
        }
        return true;
      });
    },
    tableRecords() {
      const rows = [];
      this.filteredRecords.forEach((r) => {
        const hasAM = r.timeInAM || r.timeOutAM;
        const hasPM = r.timeInPM || r.timeOutPM;
        const tagAM = (r.tagAM || r.tagging || 'Normal Hours').trim();
        const tagPM = (r.tagPM || r.tagging || 'Normal Hours').trim();

        const totalMinutesAM = r.totalMinutesAM != null ? r.totalMinutesAM : 0;
        const totalMinutesPM = r.totalMinutesPM != null ? r.totalMinutesPM : 0;
        const totalMinutesDay = r.totalMinutes != null
          ? r.totalMinutes
          : (totalMinutesAM + totalMinutesPM);

        const fourHoursMinutes = 4 * 60;
        const eightHoursMinutes = 8 * 60;
        if (hasAM) {
          let minutesForRow = totalMinutesAM;
          const isOvertimeSession = tagAM === 'Overtime';
          if (isOvertimeSession) {
            // For overtime-tagged session, always show full actual minutes
            minutesForRow = totalMinutesAM;
          } else {
            // Normal Hours session: cap at 4h maximum
            minutesForRow = Math.min(totalMinutesAM, fourHoursMinutes);
          }
          const hoursForRowLabel = this.formatMinutesToLabel(minutesForRow);
          const statusTag = r.tagAM || r.tagging || 'Normal Hours';
          rows.push({
            ...r,
            timeIn: r.timeInAM || '--:--',
            timeOut: r.timeOutAM || '--:--',
            totalHoursLabel: hoursForRowLabel,
            status: statusTag,
            sessionLabel: 'AM',
            validationStatus: r.validationStatusAM || 'Pending',
            rejectReason: r.rejectReasonAM || null,
          });
        }

        if (hasPM) {
          let minutesForRow = totalMinutesPM;
          const isOvertimeSession = tagPM === 'Overtime';
          if (isOvertimeSession) {
            // For overtime-tagged session, always show full actual minutes
            minutesForRow = totalMinutesPM;
          } else {
            // Normal Hours session: cap at 4h maximum
            minutesForRow = Math.min(totalMinutesPM, fourHoursMinutes);
          }
          const hoursForRowLabel = this.formatMinutesToLabel(minutesForRow);
          const statusTag = r.tagPM || r.tagging || 'Normal Hours';
          rows.push({
            ...r,
            timeIn: r.timeInPM || '--:--',
            timeOut: r.timeOutPM || '--:--',
            totalHoursLabel: hoursForRowLabel,
            status: statusTag,
            sessionLabel: 'PM',
            validationStatus: r.validationStatusPM || 'Pending',
            rejectReason: r.rejectReasonPM || null,
          });
        }

        if (!hasAM && !hasPM) {
          const statusTag = r.tagging || 'Normal Hours';
          let minutesForRow;
          const isOvertimeDay = statusTag.trim() === 'Overtime';
          if (isOvertimeDay) {
            minutesForRow = Math.max(0, totalMinutesDay);
          } else {
            minutesForRow = Math.min(Math.max(0, totalMinutesDay), eightHoursMinutes);
          }
          const hoursForRowLabel = this.formatMinutesToLabel(minutesForRow);
          rows.push({
            ...r,
            totalHoursLabel: hoursForRowLabel,
            status: statusTag,
            validationStatus: r.validationStatusAM || 'Pending',
            rejectReason: r.rejectReasonAM || null,
          });
        }
      });

      return rows;
    },
    totalPages() {
      if (!this.tableRecords || this.tableRecords.length === 0) return 1;
      return Math.ceil(this.tableRecords.length / this.itemsPerPage);
    },
    paginatedRecords() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.tableRecords.slice(start, end);
    }
  },
  watch: {
    selectedMonth() { this.currentPage = 1; },
    fromDate() { this.currentPage = 1; },
    toDate() { this.currentPage = 1; }
  }
}
</script>

