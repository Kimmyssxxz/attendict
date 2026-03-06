<template>
  <div class="intern-layout">
    <header class="intern-header">
      <h1>Student Intern Dashboard</h1>
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

    <main class="dashboard-main">
      <section class="left-column">
        <div class="card welcome-section">
          <div class="welcome-header">
            <div class="welcome-emoji">👋</div>
            <div>
              <h2>Welcome back, {{ studentName }}!</h2>
              <p class="welcome-sub">Here's a quick overview of your OJT progress.</p>
            </div>
          </div>

          <div class="student-info-grid">
            <div>
              <span class="label">Student Name</span>
              <span class="value">{{ studentName }}</span>
            </div>
            <div>
              <span class="label">Course / School</span>
              <span class="value">{{ courseAndSchool }}</span>
            </div>
            <div>
              <span class="label">Assigned Office / Supervisor</span>
              <span class="value">{{ assignedOffice }}</span>
            </div>
            <div>
              <span class="label">OJT Required Hours</span>
              <span class="value">{{ requiredHours }} hrs</span>
            </div>
            <div>
              <span class="label">OJT Remaining Hours</span>
              <span class="value">{{ remainingHoursDisplay }}</span>
            </div>
          </div>

          <div class="progress-section">
            <div class="progress-header">
              <span class="label">Completed Hours vs Required Hours</span>
              <span class="progress-text">
                Remaining: {{ remainingHoursDisplay }} ({{ progressPercent }}%)
              </span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
            </div>
          </div>
        </div>

        <div class="card chart-card">
          <div class="card-title-row">
            <h3>Weekly Rendered Hours</h3>
            <span class="chip">This week</span>
          </div>
          <apexchart
            type="area"
            height="300"
            :options="chartOptions"
            :series="chartSeries"
          ></apexchart>
        </div>

        <div class="card analytics-card">
          <h3>Attendance Analytics</h3>
          <div class="analytics-grid">
            <div class="analytics-item">
              <span class="label">Average Time In</span>
              <span class="analytics-value">{{ averageTimeIn }}</span>
            </div>
            <div class="analytics-item">
              <span class="label">Average Working Hours / Day</span>
              <span class="analytics-value">{{ averageWorkingHoursPerDay }} hrs</span>
            </div>
            <div class="analytics-item">
              <span class="label">Attendance Rate</span>
              <span class="analytics-value">{{ attendanceRate }}%</span>
            </div>
            <div class="analytics-item">
              <span class="label">Most Active Day</span>
              <span class="analytics-value">{{ mostActiveDay }}</span>
            </div>
            <div class="analytics-item">
              <span class="label">Longest Working Streak</span>
              <span class="analytics-value">{{ longestWorkingStreak }} days</span>
            </div>
            <div class="analytics-item">
              <span class="label">Most Common Time In</span>
              <span class="analytics-value">{{ mostCommonTimeIn }}</span>
            </div>
            <div class="analytics-item">
              <span class="label">Days with Low Hours</span>
              <span class="analytics-value">{{ lowHourDaysCount }}</span>
            </div>
            <div class="analytics-item">
              <span class="label">Consistency Score</span>
              <span class="analytics-value">{{ consistencyScore }}%</span>
            </div>
          </div>
        </div>
      </section>

      <section class="right-column">
        <div class="card chart-card">
          <div class="card-title-row">
            <h3>Monthly Attendance</h3>
            <span class="chip">{{ monthlyAttendance.monthLabel }}</span>
          </div>
          <apexchart
            type="bar"
            height="300"
            :options="monthlyChartOptions"
            :series="monthlyChartSeries"
          ></apexchart>
        </div>

        <div class="card calendar-card">
          <div class="card-title-row">
            <h3>Calendar View</h3>
            <div class="calendar-nav">
              <button class="calendar-nav-btn" @click="prevMonth">&lt;</button>
              <span class="chip">{{ calendarMonthLabel }}</span>
              <button class="calendar-nav-btn" @click="nextMonth">&gt;</button>
            </div>
          </div>
          <div class="calendar-legend">
            <span class="legend-item"><span class="legend-dot legend-present"></span>Present</span>
            <span class="legend-item"><span class="legend-dot legend-holiday"></span>Holiday</span>
            <span class="legend-item"><span class="legend-dot legend-weekend"></span>Weekend (Sunday)</span>
          </div>
          <div class="calendar-grid">
            <div class="calendar-weekday" v-for="d in ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']" :key="d">
              {{ d }}
            </div>
            <button
              v-for="(day, idx) in calendarWeeksFlat"
              :key="day.dateKey + '_' + idx"
              type="button"
              class="calendar-day"
              :class="[
                day.isCurrentMonth ? 'calendar-day--current-month' : 'calendar-day--other-month',
                day.status === 'present' ? 'calendar-day--present' : '',
                day.status === 'holiday' ? 'calendar-day--holiday' : '',
                day.isWeekend && day.status === 'none' ? 'calendar-day--weekend' : '',
                day.isToday ? 'calendar-day--today' : ''
              ]"
              @click="handleCalendarDayClick(day)"
            >
              <span class="calendar-day-number">{{ day.dayOfMonth }}</span>
            </button>
          </div>

          <div v-if="calendarSelectedDetails" class="calendar-details">
            <h4>{{ calendarSelectedDetails.displayDate }}</h4>
            <p class="calendar-details-status">Status: {{ calendarSelectedDetails.statusLabel }}</p>
            <p v-if="calendarSelectedDetails.hasRecord">
              Time In AM: {{ calendarSelectedDetails.timeInAM || '—' }}<br />
              Time Out AM: {{ calendarSelectedDetails.timeOutAM || '—' }}<br />
              Time In PM: {{ calendarSelectedDetails.timeInPM || '—' }}<br />
              Time Out PM: {{ calendarSelectedDetails.timeOutPM || '—' }}<br />
              Total Hours: {{ calendarSelectedDetails.totalHours }}
            </p>
            <p v-else>
              No attendance record for this day.
            </p>
          </div>
        </div>

      </section>
    </main>
  </div>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts';

export default {
  name: 'InternDashboardView',
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      studentName: '',
      courseAndSchool: '',
      assignedOffice: '',
      requiredHours: 0,
      completedHours: 0,
      remainingHours: null,
      chartOptions: {
        chart: {
          type: 'area',
          height: 300,
          stacked: true,
          toolbar: { show: false }
        },
        colors: ['#008FFB', '#00E396', '#CED4DC'],
        dataLabels: { enabled: false },
        stroke: { curve: 'monotoneCubic' },
        fill: {
          type: 'gradient',
          gradient: {
            opacityFrom: 0.6,
            opacityTo: 0.8,
          }
        },
        legend: { position: 'top', horizontalAlign: 'left' },
        xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
      },
      chartSeries: [
        { name: 'Normal Hours', data: [0, 0, 0, 0, 0] },
        { name: 'Overtime', data: [0, 0, 0, 0, 0] },
      ],
      monthlyAttendance: {
        monthLabel: '',
      },
      monthlyChartOptions: {
        chart: {
          type: 'bar',
          height: 300,
          toolbar: { show: false }
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            columnWidth: '40%',
          }
        },
        colors: ['#0284c7'],
        dataLabels: { enabled: false },
        xaxis: { categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'] },
        yaxis: {
          title: { text: 'Days Present' },
          min: 0,
          max: 7,
          tickAmount: 7,
          labels: { formatter: (val) => Math.round(val) }
        },
        tooltip: {
          y: { formatter: (val) => val + ' days' }
        }
      },
      monthlyChartSeries: [
        { name: 'Days Present', data: [0, 0, 0, 0] }
      ],
      averageTimeIn: '--:--',
      averageWorkingHoursPerDay: 0,
      attendanceRate: 0,
      mostActiveDay: 'N/A',
      longestWorkingStreak: 0,
      mostCommonTimeIn: '--:--',
      lowHourDaysCount: 0,
      consistencyScore: 0,
      notifications: [],
      unreadCount: 0,
      internId: null,
      showNotifications: false,
      calendarWeeks: [],
      calendarMonthLabel: '',
      calendarSelectedDate: null,
      calendarSelectedDetails: null,
      attendanceByDate: {},
      currentCalendarDate: new Date(),
    }
  },
  created() {
    try {
      const stored = localStorage.getItem('internUser');
      if (!stored) return;
      const basicUser = JSON.parse(stored);
      const internId = basicUser && basicUser.id;
      if (!internId) return;
      this.internId = internId;

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

      this.loadDashboardData(basicUser);
    } catch (e) {}
  },
  computed: {
    progressPercent() {
      if (!this.requiredHours || this.requiredHours <= 0) return 0;
      const raw = (this.completedHours / this.requiredHours) * 100;
      const clamped = Math.max(0, Math.min(raw, 100));
      return Math.round(clamped);
    },
    remainingHoursDisplay() {
      const v = this.remainingHours;
      if (v == null || !Number.isFinite(v)) return '-';
      const totalMinutes = Math.round(v * 60);
      const h = Math.floor(totalMinutes / 60);
      const m = totalMinutes % 60;
      return `${h}h ${m}m`;
    },
    calendarWeeksFlat() {
      return this.calendarWeeks.reduce((all, week) => all.concat(week.days), []);
    },
  },
  methods: {
    toggleNotifications() {
      this.showNotifications = !this.showNotifications
    },
    async loadDashboardData(basicUser) {
      try {
        const internId = this.internId;
        if (!internId) return;

        let user = basicUser || {};
        try {
          const userRes = await fetch(`http://localhost:3001/users/${encodeURIComponent(internId)}`);
          if (userRes.ok) {
            const userJson = await userRes.json().catch(() => null);
            if (userJson && userJson.user) {
              user = userJson.user;
            }
          }
        } catch (e) {}

        this.studentName = this.buildStudentName(user, basicUser);
        this.courseAndSchool = this.buildCourseAndSchool(user, basicUser);
        this.assignedOffice = (user.assignedOffice || basicUser.assignedOffice || 'Not assigned yet');

        const rawRequired = user.requiredHours || user.ojtRequiredHours || basicUser.requiredHours || basicUser.ojtRequiredHours;
        const parsedRequired = Number(rawRequired);
        this.requiredHours = Number.isFinite(parsedRequired) && parsedRequired > 0 ? parsedRequired : 486;

        const rawRemaining = user.ojtRemainingHours;
        const parsedRemaining = Number(rawRemaining);
        this.remainingHours = Number.isFinite(parsedRemaining) && parsedRemaining >= 0 ? parsedRemaining : null;

        try {
          const attRes = await fetch(`http://localhost:3001/attendance/intern/history?internId=${encodeURIComponent(internId)}`);
          if (attRes.ok) {
            const json = await attRes.json().catch(() => null);
            const records = Array.isArray(json && json.data) ? json.data : [];
            this.updateAttendanceAnalytics(records);
          }
        } catch (e) {}
      } catch (e) {}
    },
    buildStudentName(user, fallback) {
      const src = user || fallback || {};
      const first = src.firstName || src.firstname || '';
      const last = src.lastName || src.lastname || '';
      const middle = src.middleName || src.middlename || src.middleInitial || '';

      if (last || first || middle) {
        const main = `${last}${last && (first || middle) ? ', ' : ''}${first}`.trim();
        const withMiddle = middle ? `${main} ${middle}`.trim() : main;
        return withMiddle;
      }
      return src.fullName || src.name || 'Student Intern';
    },
    buildCourseAndSchool(user, fallback) {
      const src = user || fallback || {};
      const course = src.course || src.position || 'OJT Intern';
      const school = src.schoolOrUniversity || src.school || '';
      if (school) {
        return `${course} - ${school}`;
      }
      return course;
    },
    updateAttendanceAnalytics(records) {
      if (!Array.isArray(records) || !records.length) {
        this.completedHours = 0;
        this.chartSeries = [
          { name: 'Normal Hours', data: [0, 0, 0, 0, 0] },
          { name: 'Overtime', data: [0, 0, 0, 0, 0] },
        ];
        this.monthlyAttendance = {
          monthLabel: '',
        };
        this.monthlyChartSeries = [
          { name: 'Days Present', data: [0, 0, 0, 0] }
        ];
        this.averageTimeIn = '--:--';
        this.averageWorkingHoursPerDay = 0;
        this.attendanceRate = 0;
        this.mostActiveDay = 'N/A';
        this.longestWorkingStreak = 0;
        this.mostCommonTimeIn = '--:--';
        this.lowHourDaysCount = 0;
        this.consistencyScore = 0;
        this.attendanceByDate = {};
        this.calendarWeeks = [];
        this.calendarMonthLabel = '';
        this.calendarSelectedDate = null;
        this.calendarSelectedDetails = null;
        return;
      }

      let totalMinutesAll = 0;
      const byDate = {};
      const allTimeInsMinutes = [];

      records.forEach((r) => {
        const dateStr = r.date;
        if (!dateStr) return;

        const totalMinutesAM = typeof r.totalMinutesAM === 'number' ? r.totalMinutesAM : null;
        const totalMinutesPM = typeof r.totalMinutesPM === 'number' ? r.totalMinutesPM : null;
        const totalMinutesFallback = typeof r.totalMinutes === 'number' ? r.totalMinutes : null;

        const tag = (r.tagAM || r.tagPM || r.tagging || 'Normal Hours').trim();
        const eightHoursMinutes = 8 * 60;

        let rawTotal = 0;
        if (totalMinutesAM != null || totalMinutesPM != null) {
          rawTotal = (totalMinutesAM || 0) + (totalMinutesPM || 0);
        } else if (totalMinutesFallback != null) {
          rawTotal = totalMinutesFallback;
        } else if (typeof r.totalHours === 'number' || typeof r.totalHours === 'string') {
          const h = parseFloat(r.totalHours);
          if (Number.isFinite(h) && h > 0) {
            rawTotal = Math.round(h * 60);
          }
        }

        let dayMinutes = 0;
        if (tag === 'Overtime') {
          if (typeof r.overtimeMinutes === 'number') {
            dayMinutes = Math.max(0, r.overtimeMinutes);
          } else {
            dayMinutes = Math.max(0, rawTotal - eightHoursMinutes);
          }
        } else {
          if (typeof r.normalCountMinutes === 'number') {
            dayMinutes = Math.max(0, r.normalCountMinutes);
          } else {
            dayMinutes = Math.min(Math.max(0, rawTotal), eightHoursMinutes);
          }
        }

        if (r.validationStatus === 'Approved') {
          totalMinutesAll += dayMinutes;
        }

        if (!byDate[dateStr]) {
          byDate[dateStr] = {
            minutes: 0,
            normalMinutes: 0,
            overtimeMinutes: 0,
            hasRecord: false,
          };
        }
        byDate[dateStr].minutes += dayMinutes;
        if (tag === 'Overtime') {
          byDate[dateStr].overtimeMinutes += dayMinutes;
        } else {
          byDate[dateStr].normalMinutes += dayMinutes;
        }
        byDate[dateStr].hasRecord = true;

        const timeIn = r.timeInAM || r.timeInPM;
        const timeInMinutes = this.parseTimeToMinutes(timeIn);
        if (timeInMinutes != null) {
          allTimeInsMinutes.push(timeInMinutes);
        }
      });

      const completedHoursRaw = totalMinutesAll / 60;
      this.completedHours = Math.round(completedHoursRaw * 10) / 10;

      this.updateWeeklyRenderedHours(byDate);
      this.updateMonthlyAttendance(byDate);
      this.updateAverageTimeIn(allTimeInsMinutes);
      this.updateAverageWorkingHours(byDate);
      this.updateAttendanceRate(byDate);
      this.updateExtraAnalytics(byDate, allTimeInsMinutes);

      const rawMap = {};
      records.forEach((r) => {
        if (r && r.date) {
          rawMap[r.date] = r;
        }
      });
      this.attendanceByDate = rawMap;
      this.buildCalendar(byDate, rawMap);
    },
    parseTimeToMinutes(timeStr) {
      if (!timeStr || typeof timeStr !== 'string') return null;
      const parts = timeStr.split(':');
      if (parts.length < 2) return null;
      const h = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) || 0;
      if (Number.isNaN(h) || Number.isNaN(m)) return null;
      return h * 60 + m;
    },
    minutesTo12hString(totalMinutes) {
      if (totalMinutes == null || !Number.isFinite(totalMinutes)) return '--:--';
      const minutes = Math.round(totalMinutes);
      let h = Math.floor(minutes / 60);
      const m = minutes % 60;
      const suffix = h >= 12 ? 'PM' : 'AM';
      h = h % 12;
      if (h === 0) h = 12;
      const mm = m.toString().padStart(2, '0');
      return `${h}:${mm} ${suffix}`;
    },
    updateWeeklyRenderedHours(byDate) {
      const today = new Date();
      const dayOfWeek = today.getDay();
      const diffToMonday = (dayOfWeek === 0 ? -6 : 1 - dayOfWeek);
      const monday = new Date(today);
      monday.setDate(today.getDate() + diffToMonday);

      const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
      const normalData = [];
      const overtimeData = [];

      labels.forEach((label, index) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + index);
        const y = d.getFullYear();
        const m = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');
        const key = `${y}-${m}-${day}`;
        const info = byDate[key] || { normalMinutes: 0, overtimeMinutes: 0 };
        
        normalData.push(Math.round((info.normalMinutes / 60) * 10) / 10);
        overtimeData.push(Math.round((info.overtimeMinutes / 60) * 10) / 10);
      });

      this.chartSeries = [
        { name: 'Normal Hours', data: normalData },
        { name: 'Overtime', data: overtimeData }
      ];
    },
    updateMonthlyAttendance(byDate) {
      const today = new Date();
      const year = today.getFullYear();
      const monthIndex = today.getMonth();
      const monthLabel = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

      const weeks = [
        { label: 'W1', daysPresent: 0 },
        { label: 'W2', daysPresent: 0 },
        { label: 'W3', daysPresent: 0 },
        { label: 'W4', daysPresent: 0 },
      ];

      Object.keys(byDate).forEach((dateStr) => {
        const parts = dateStr.split('-');
        if (parts.length !== 3) return;
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        const d = parseInt(parts[2], 10);
        if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d)) return;
        if (y !== year || m !== monthIndex) return;

        const date = new Date(y, m, d);
        const dayOfMonth = date.getDate();
        let weekIndex = 0;
        if (dayOfMonth <= 7) weekIndex = 0;
        else if (dayOfMonth <= 14) weekIndex = 1;
        else if (dayOfMonth <= 21) weekIndex = 2;
        else weekIndex = 3;

        if (byDate[dateStr].minutes > 0) {
          weeks[weekIndex].daysPresent += 1;
        }
      });

      const maxDays = weeks.reduce((max, w) => Math.max(max, w.daysPresent), 0);
      
      this.monthlyChartSeries = [
        { name: 'Days Present', data: weeks.map(w => w.daysPresent) }
      ];

      this.monthlyAttendance = {
        monthLabel,
      };
    },
    prevMonth() {
      const d = new Date(this.currentCalendarDate);
      d.setMonth(d.getMonth() - 1);
      this.currentCalendarDate = d;
      this.buildCalendar(this.attendanceByDate, this.attendanceByDate);
    },
    nextMonth() {
      const d = new Date(this.currentCalendarDate);
      d.setMonth(d.getMonth() + 1);
      this.currentCalendarDate = d;
      this.buildCalendar(this.attendanceByDate, this.attendanceByDate);
    },
    buildCalendar(byDate, rawMap) {
      const today = new Date();
      const calendarTarget = this.currentCalendarDate || today;
      const year = calendarTarget.getFullYear();
      const monthIndex = calendarTarget.getMonth();
      const firstOfMonth = new Date(year, monthIndex, 1);
      const startDayOfWeek = firstOfMonth.getDay();
      const calendarStart = new Date(year, monthIndex, 1 - startDayOfWeek);

      const weeks = [];
      const nowDateKey = today.toISOString().slice(0, 10);

      for (let week = 0; week < 6; week += 1) {
        const days = [];
        for (let i = 0; i < 7; i += 1) {
          const d = new Date(calendarStart);
          d.setDate(calendarStart.getDate() + week * 7 + i);
          const y = d.getFullYear();
          const m = (d.getMonth() + 1).toString().padStart(2, '0');
          const dayNum = d.getDate().toString().padStart(2, '0');
          const key = `${y}-${m}-${dayNum}`;
          const info = byDate[key] || { minutes: 0 };
          const rec = rawMap[key];

          let status = 'none';
          const isFuture = d.getTime() > today.getTime();
          const isSunday = d.getDay() === 0;
          if (rec) {
            const tag = (rec.tagAM || rec.tagPM || '').toLowerCase();
            if (tag && tag.includes('holiday')) {
              status = 'holiday';
            } else if (info.minutes > 0) {
              status = 'present';
            }
          } else if (!isFuture) {
            if (info.minutes > 0) {
              status = 'present';
            }
          }

          days.push({
            dateKey: key,
            dayOfMonth: parseInt(dayNum, 10),
            isCurrentMonth: d.getMonth() === monthIndex,
            isToday: key === nowDateKey,
            isWeekend: isSunday,
            status,
          });
        }
        weeks.push({ days });
      }

      this.calendarWeeks = weeks;
      this.calendarMonthLabel = calendarTarget.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

      // Only attempt to auto-select today if today is actually in the rendered month grid
      const todayEntry = weeks.flatMap((w) => w.days).find((day) => day.dateKey === nowDateKey);
      if (todayEntry && calendarTarget.getMonth() === today.getMonth() && calendarTarget.getFullYear() === today.getFullYear()) {
        this.handleCalendarDayClick(todayEntry);
      } else {
        this.calendarSelectedDate = null;
        this.calendarSelectedDetails = null;
      }
    },
    handleCalendarDayClick(day) {
      if (!day) return;
      this.calendarSelectedDate = day.dateKey;
      const rec = this.attendanceByDate[day.dateKey] || null;

      let statusLabel = 'No record';
      if (day.status === 'present') statusLabel = 'Present';
      else if (day.status === 'holiday') statusLabel = 'Holiday';

      let totalHours = 0;
      if (rec) {
        const tag = (rec.tagAM || rec.tagPM || rec.tagging || 'Normal Hours').trim();
        const eightHoursMinutes = 8 * 60;

        const totalMinutesAM = typeof rec.totalMinutesAM === 'number' ? rec.totalMinutesAM : null;
        const totalMinutesPM = typeof rec.totalMinutesPM === 'number' ? rec.totalMinutesPM : null;
        const totalMinutesFallback = typeof rec.totalMinutes === 'number' ? rec.totalMinutes : null;

        let rawTotal = 0;
        if (totalMinutesAM != null || totalMinutesPM != null) {
          rawTotal = (totalMinutesAM || 0) + (totalMinutesPM || 0);
        } else if (totalMinutesFallback != null) {
          rawTotal = totalMinutesFallback;
        } else if (typeof rec.totalHours === 'number' || typeof rec.totalHours === 'string') {
          const h = parseFloat(rec.totalHours);
          if (Number.isFinite(h) && h > 0) {
            rawTotal = Math.round(h * 60);
          }
        }

        let dayMinutes = 0;
        if (tag === 'Overtime') {
          if (typeof rec.overtimeMinutes === 'number') {
            dayMinutes = Math.max(0, rec.overtimeMinutes);
          } else {
            dayMinutes = Math.max(0, rawTotal - eightHoursMinutes);
          }
        } else {
          if (typeof rec.normalCountMinutes === 'number') {
            dayMinutes = Math.max(0, rec.normalCountMinutes);
          } else {
            dayMinutes = Math.min(Math.max(0, rawTotal), eightHoursMinutes);
          }
        }

        totalHours = Math.round((dayMinutes / 60) * 10) / 10;
      }

      this.calendarSelectedDetails = {
        displayDate: this.formatCalendarDisplayDate(day.dateKey),
        statusLabel,
        hasRecord: !!rec,
        timeInAM: rec && rec.timeInAM,
        timeOutAM: rec && rec.timeOutAM,
        timeInPM: rec && rec.timeInPM,
        timeOutPM: rec && rec.timeOutPM,
        totalHours,
      };
    },
    formatCalendarDisplayDate(dateKey) {
      if (!dateKey) return '';
      const parts = dateKey.split('-');
      if (parts.length !== 3) return dateKey;
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const d = parseInt(parts[2], 10);
      if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d)) return dateKey;
      const dt = new Date(y, m, d);
      if (Number.isNaN(dt.getTime())) return dateKey;
      return dt.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    },
    updateAverageTimeIn(allTimeInsMinutes) {
      if (!Array.isArray(allTimeInsMinutes) || !allTimeInsMinutes.length) {
        this.averageTimeIn = '--:--';
        return;
      }
      const total = allTimeInsMinutes.reduce((sum, v) => sum + v, 0);
      const avg = total / allTimeInsMinutes.length;
      this.averageTimeIn = this.minutesTo12hString(avg);
    },
    updateAverageWorkingHours(byDate) {
      const entries = Object.values(byDate).filter((v) => v && v.minutes > 0);
      if (!entries.length) {
        this.averageWorkingHoursPerDay = 0;
        return;
      }
      const totalMinutes = entries.reduce((sum, v) => sum + Math.max(0, v.minutes), 0);
      const avgMinutes = totalMinutes / entries.length;
      const avgHours = avgMinutes / 60;
      this.averageWorkingHoursPerDay = Math.round(avgHours * 10) / 10;
    },
    updateAttendanceRate(byDate) {
      const dates = Object.keys(byDate);
      if (!dates.length) {
        this.attendanceRate = 0;
        return;
      }

      const sortedDates = dates.slice().sort();
      const first = sortedDates[0];
      const last = sortedDates[sortedDates.length - 1];
      const firstDate = new Date(first);
      const lastDate = new Date(last);
      if (Number.isNaN(firstDate.getTime()) || Number.isNaN(lastDate.getTime())) {
        this.attendanceRate = 0;
        return;
      }

      const diffMs = lastDate.getTime() - firstDate.getTime();
      const diffDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1);
      const windowDays = Math.max(diffDays, 1);

      const daysPresent = dates.filter((d) => byDate[d] && byDate[d].minutes > 0).length;
      const rate = (daysPresent / windowDays) * 100;
      const clamped = Math.max(0, Math.min(rate, 100));
      this.attendanceRate = Math.round(clamped);
    },
    updateExtraAnalytics(byDate, allTimeInsMinutes) {
      const weekdayTotals = [0, 0, 0, 0, 0, 0, 0];
      const dateKeys = Object.keys(byDate);
      const attendedDates = [];

      dateKeys.forEach((dateStr) => {
        const info = byDate[dateStr];
        if (!info || info.minutes <= 0) return;
        const date = new Date(dateStr);
        if (Number.isNaN(date.getTime())) return;
        const weekday = date.getDay();
        weekdayTotals[weekday] += info.minutes;
        attendedDates.push(dateStr);
      });

      if (attendedDates.length === 0) {
        this.mostActiveDay = 'N/A';
        this.longestWorkingStreak = 0;
        this.mostCommonTimeIn = '--:--';
        this.lowHourDaysCount = 0;
        this.consistencyScore = 0;
        return;
      }

      const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      let maxIdx = 0;
      let maxVal = weekdayTotals[0];
      for (let i = 1; i < weekdayTotals.length; i += 1) {
        if (weekdayTotals[i] > maxVal) {
          maxVal = weekdayTotals[i];
          maxIdx = i;
        }
      }
      this.mostActiveDay = maxVal > 0 ? weekdayNames[maxIdx] : 'N/A';

      const sortedDateObjs = attendedDates
        .map((d) => new Date(d))
        .filter((d) => !Number.isNaN(d.getTime()))
        .sort((a, b) => a - b);

      let longest = 1;
      let current = 1;
      for (let i = 1; i < sortedDateObjs.length; i += 1) {
        const prev = sortedDateObjs[i - 1];
        const cur = sortedDateObjs[i];
        const diffMs = cur.getTime() - prev.getTime();
        const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          current += 1;
          if (current > longest) longest = current;
        } else {
          current = 1;
        }
      }
      this.longestWorkingStreak = longest;

      if (!Array.isArray(allTimeInsMinutes) || !allTimeInsMinutes.length) {
        this.mostCommonTimeIn = '--:--';
      } else {
        const bucketCounts = {};
        allTimeInsMinutes.forEach((mins) => {
          if (!Number.isFinite(mins)) return;
          const bucket = Math.round(mins / 5) * 5;
          bucketCounts[bucket] = (bucketCounts[bucket] || 0) + 1;
        });
        let bestBucket = null;
        let bestCount = 0;
        Object.keys(bucketCounts).forEach((key) => {
          const count = bucketCounts[key];
          const bucket = Number(key);
          if (count > bestCount || (count === bestCount && bucket < bestBucket)) {
            bestCount = count;
            bestBucket = bucket;
          }
        });
        this.mostCommonTimeIn = bestBucket != null ? this.minutesTo12hString(bestBucket) : '--:--';
      }

      const LOW_HOURS_THRESHOLD_MINUTES = 4 * 60;
      let lowDays = 0;
      let daysWithHours = 0;
      dateKeys.forEach((dateStr) => {
        const info = byDate[dateStr];
        if (!info || info.minutes <= 0) return;
        daysWithHours += 1;
        if (info.minutes < LOW_HOURS_THRESHOLD_MINUTES) {
          lowDays += 1;
        }
      });
      this.lowHourDaysCount = lowDays;

      if (daysWithHours === 0) {
        this.consistencyScore = 0;
      } else {
        const consistentDays = daysWithHours - lowDays;
        const score = (consistentDays / daysWithHours) * 100;
        this.consistencyScore = Math.round(Math.max(0, Math.min(score, 100)));
      }
    },
  }
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

.dashboard-main {
  max-width: 1100px;
  margin: 2rem auto;
  padding: 0 1rem 2rem;
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
  gap: 1.5rem;
}

.card {
  background: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
  padding: 1.5rem;
}

.today-status h2 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  color: #0f172a;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.label {
  display: block;
  font-size: 0.8rem;
  color: #6b7280;
  margin-bottom: 0.2rem;
}

.value {
  font-size: 1.1rem;
  font-weight: 600;
  color: #111827;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.15rem 0.6rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
}

.badge-present {
  background: #dcfce7;
  color: #166534;
}

.actions {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.btn {
  flex: 1;
  padding: 0.6rem 1rem;
  border-radius: 999px;
  border: none;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: not-allowed;
  opacity: 0.6;
}

.btn-in {
  background: #22c55e;
  color: #052e16;
}

.btn-out {
  background: #ef4444;
  color: #7f1d1d;
}

.hint {
  font-size: 0.75rem;
  color: #6b7280;
}

.summary-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.summary-card h3 {
  margin: 0 0 0.5rem;
  font-size: 0.95rem;
  color: #4b5563;
}

.summary-value {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
  color: #111827;
}

.summary-hours .label {
  font-size: 0.78rem;
}

.summary-hours .value {
  font-size: 1rem;
}

.hours-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.left-column,
.right-column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.welcome-section {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.welcome-header {
  display: flex;
  align-items: center;
  gap: 0.9rem;
}

.welcome-emoji {
  font-size: 2rem;
}

.welcome-section h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #0f172a;
}

.welcome-sub {
  margin: 0.2rem 0 0;
  font-size: 0.85rem;
  color: #6b7280;
}

.student-info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.progress-section {
  margin-top: 0.5rem;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
}

.progress-text {
  font-size: 0.8rem;
  color: #4b5563;
}

.progress-bar {
  width: 100%;
  margin-top: 0.5rem;
  height: 10px;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #22c55e, #16a34a);
  border-radius: 999px;
  transition: width 0.3s ease;
}

.chart-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.calendar-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.calendar-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  display: inline-block;
}

.legend-present {
  background: #22c55e;
}

.legend-late {
  background: #eab308;
}

.legend-holiday {
  background: #3b82f6;
}

.legend-weekend {
  background: #eab308;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 0.25rem;
  margin-top: 0.25rem;
}

.calendar-weekday {
  text-align: center;
  font-size: 0.7rem;
  font-weight: 600;
  color: #6b7280;
}

.calendar-day {
  border: none;
  border-radius: 0.5rem;
  padding: 0.35rem 0.2rem;
  font-size: 0.75rem;
  text-align: center;
  cursor: pointer;
  background: #f3f4f6;
  color: #111827;
}

.calendar-day--other-month {
  opacity: 0.4;
}

.calendar-day--present {
  background: #dcfce7;
  color: #166534;
}

.calendar-day--late {
  background: #fef9c3;
  color: #854d0e;
}

.calendar-day--holiday {
  background: #dbeafe;
  color: #1d4ed8;
}

.calendar-day--weekend {
  background: #fef9c3;
  color: #854d0e;
  border: 1px solid #facc15;
}

.calendar-day--today {
  outline: 2px solid #4b5563;
  outline-offset: 1px;
}

.calendar-day-number {
  font-weight: 600;
}

.calendar-details {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e5e7eb;
  font-size: 0.8rem;
  color: #374151;
}

.calendar-details h4 {
  margin: 0 0 0.25rem;
  font-size: 0.9rem;
}

.calendar-details-status {
  margin: 0 0 0.25rem;
}

.card-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.calendar-nav {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.calendar-nav-btn {
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  color: #374151;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.8rem;
  transition: all 0.2s;
}

.calendar-nav-btn:hover {
  background: #e5e7eb;
}

.chip {
  font-size: 0.75rem;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  background: #eff6ff;
  color: #1d4ed8;
}

.analytics-card h3 {
  margin-top: 0;
  margin-bottom: 0.75rem;
  font-size: 1rem;
}

.analytics-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
}

.analytics-item {
  padding: 0.75rem 0.9rem;
  border-radius: 0.75rem;
  background: #f9fafb;
}

.analytics-value {
  display: block;
  margin-top: 0.2rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #111827;
}

@media (max-width: 900px) {
  .dashboard-main {
    grid-template-columns: 1fr;
  }
}
</style>
