<template>
  <div class="intern-layout">
    <header class="intern-header">
      <h1>My Attendance Records</h1>
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

    <!-- Download Format Modal -->
    <div v-if="showDownloadModal" class="modal-overlay" @click="showDownloadModal = false">
      <div class="modal-content" @click.stop>
        <h3>Select Download Format</h3>
        <p>How would you like to download your Daily Time Record (DTR)?</p>
        <div class="modal-actions">
          <button class="btn btn-pdf" @click="handleDownload('pdf')">
            <span class="icon">📄</span> PDF Format
          </button>
          <button class="btn btn-word" @click="handleDownload('word')">
            <span class="icon">📝</span> Word Format
          </button>
        </div>
        <button class="btn-close" @click="showDownloadModal = false">Cancel</button>
      </div>
    </div>

    <main class="attendance-main">
      <section class="card filter-card">
        <h2>Filters</h2>
        <div class="filter-grid">
          <div>
            <label for="month">Month</label>
            <select id="month" v-model="selectedMonth">
              <option value="">All</option>
              <option value="2025-01">January 2025</option>
              <option value="2025-02">February 2025</option>
            </select>
          </div>
          <div>
            <label for="from">From</label>
            <input id="from" type="date" v-model="fromDate" />
          </div>
          <div>
            <label for="to">To</label>
            <input id="to" type="date" v-model="toDate" />
          </div>
          <div class="download-wrapper">
            <button class="btn btn-download-active" @click="showDownloadModal = true">Download DTR</button>
          </div>
        </div>
      </section>

      <section class="card table-card">
        <h2>Attendance</h2>
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Time In</th>
                <th>Time Out</th>
                <th>Total Hours</th>
                <th>Tag</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in paginatedRecords" :key="record.id + '-' + (record.sessionLabel || 'all')">
                <td>{{ formatDate(record.date) }}</td>
                <td>{{ formatTime12h(record.timeIn) }}</td>
                <td>{{ formatTime12h(record.timeOut) }}</td>
                <td>{{ record.totalHoursLabel || '0h 0m' }}</td>
                <td>
                  <span :class="['badge', record.status === 'Overtime' ? 'badge-late' : 'badge-present']">
                    {{ record.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="pagination-wrapper" v-if="tableRecords.length > 0">
          <div class="items-per-page">
            <label for="itemsPerPage">Showing</label>
            <select id="itemsPerPage" v-model="itemsPerPage" @change="currentPage = 1">
              <option :value="10">10</option>
              <option :value="15">15</option>
              <option :value="20">20</option>
              <option :value="25">25</option>
              <option :value="30">30</option>
            </select>
            <span>records per page</span>
          </div>

          <div class="pagination-controls">
            <button class="btn-page" :disabled="currentPage === 1" @click="currentPage--">Previous</button>
            <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
            <button class="btn-page" :disabled="currentPage === totalPages" @click="currentPage++">Next</button>
          </div>
        </div>

      </section>
    </main>
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
      unreadCount: 0,
      internId: null,
      showNotifications: false,
      showDownloadModal: false,
      currentPage: 1,
      itemsPerPage: 10
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
    handleDownload(format) {
      this.showDownloadModal = false;
      if (format === 'pdf') {
        this.exportPdf();
      } else {
        this.exportWord();
      }
    },
    exportWord() {
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
      
      const byDay = {};
      this.filteredRecords.forEach((r) => {
        if (!r.date) return;
        const d = parseLocalDate(r.date) || new Date(r.date);
        if (!d || Number.isNaN(d.getTime())) return;
        if (d.getFullYear() !== year || d.getMonth() !== monthIndex) return;

        const dayNum = d.getDate();
        if (dayNum < 1 || dayNum > 31) return;

        byDay[dayNum] = {
          amArrival: r.timeInAM ? this.formatTime12h(r.timeInAM) : '',
          amDeparture: r.timeOutAM ? this.formatTime12h(r.timeOutAM) : '',
          pmArrival: r.timeInPM ? this.formatTime12h(r.timeInPM) : '',
          pmDeparture: r.timeOutPM ? this.formatTime12h(r.timeOutPM) : ''
        };
      });

      const generateTableHtml = () => {
        let html = `
          <div style="font-family:'Times New Roman', serif;width:3.25in;page-break-inside:avoid;line-height:0.6;mso-line-height-rule:exactly;">
            <div style="text-align:center;font-size:7pt;margin-bottom:0pt;mso-line-height-rule:exactly;line-height:7pt;">Civil Service Form No. 48</div>
            <div style="text-align:center;font-weight:bold;font-size:9.5pt;margin-bottom:0.1pt;mso-line-height-rule:exactly;line-height:10pt;">DAILY TIME RECORD</div>
            <div style="text-align:center;margin:0.1pt 0 0.1pt 0;border-bottom:0.5pt solid #000;padding-bottom:0pt;font-size:9.5pt;font-weight:bold;mso-line-height-rule:exactly;line-height:10pt;">${this.internName || '(Name)'}</div>
            <div style="margin-top:0pt;font-size:8pt;mso-line-height-rule:exactly;line-height:8.5pt;">For the month of <span style="text-decoration:underline;font-weight:bold;">${monthName} ${year}</span></div>
            <div style="margin-top:0pt;display:flex;justify-content:space-between;align-items:flex-start;font-size:6.2pt;line-height:0.6;">
              <div style="width:60%;">Official hours of arrival<br/>and departure</div>
              <div style="text-align:left;width:40%;">Regular days ________<br/>Saturdays ________</div>
            </div>
            
            <table border="1" cellspacing="0" cellpadding="0" style="border-collapse:collapse;font-family:Arial, sans-serif;font-size:6.2pt;width:100%;margin:1pt auto;table-layout:fixed;">
              <thead>
                <tr style="height:7.5pt;mso-height-rule:exactly;">
                  <th rowspan="2" style="width:10%;">Day</th>
                  <th colspan="2">A.M.</th>
                  <th colspan="2">P.M.</th>
                  <th colspan="2">Undertime</th>
                </tr>
                <tr style="height:7.5pt;mso-height-rule:exactly;">
                  <th style="width:15%;">Arrival</th>
                  <th style="width:15%;">Departure</th>
                  <th style="width:15%;">Arrival</th>
                </tr>
              </thead>
              <tbody>
`;

        for (let day = 1; day <= 31; day++) {
          const data = byDay[day] || { amArrival: '', amDeparture: '', pmArrival: '', pmDeparture: '' };
          html += `
                <tr style="height:5.8pt;mso-height-rule:exactly;line-height:0.6;">
                  <td style="text-align:center;">${day}</td>
                  <td style="text-align:center;font-size:5.5pt;">${data.amArrival}</td>
                  <td style="text-align:center;font-size:5.5pt;">${data.amDeparture}</td>
                  <td style="text-align:center;font-size:5.5pt;">${data.pmArrival}</td>
                  <td style="text-align:center;font-size:5.5pt;">${data.pmDeparture}</td>
                  <td style="text-align:center;"></td>
                  <td style="text-align:center;"></td>
                </tr>
`;
        }

        html += `
                <tr style="height:7.5pt;mso-height-rule:exactly;">
                  <td style="font-weight:bold;text-align:center;">Total</td>
                  <td></td><td></td><td></td><td></td>
                  <td></td><td></td>
                </tr>
              </tbody>
            </table>

            <div style="font-family:serif;font-size:6.2pt;margin-top:0pt;text-align:justify;line-height:0.6;">
              I certify on my honor that the above is a true and correct report of the hours of work performed, record of which was
              made daily at the time of arrival and departure from office.
            </div>
            <div style="height:1.5pt;mso-line-height-rule:exactly;line-height:1.5pt;"></div>
            <div style="text-align:center;font-family:sans-serif;font-size:8.5pt;margin-top:0.1pt;mso-line-height-rule:exactly;line-height:9pt;">
              <div style="font-weight:bold;">${this.internName || '&nbsp;'}</div>
              <div style="border-top:0.5pt solid #000;margin:0 10pt 0.1pt 10pt;height:0.5pt;"></div>
              <div style="font-size:6pt;">OJT Intern</div>
            </div>
            <div style="height:1.5pt;mso-line-height-rule:exactly;line-height:1.5pt;"></div>
            <div style="text-align:center;font-family:sans-serif;font-size:8.5pt;margin-top:0.1pt;mso-line-height-rule:exactly;line-height:9pt;">
              <div style="font-weight:bold;">ENGR. MARVIN D. BEJASA</div>
              <div style="border-top:0.5pt solid #000;margin:0 10pt 0.1pt 10pt;height:0.5pt;"></div>
              <div style="font-size:6pt;">OIC - Provincial Officer</div>
              <div style="font-size:5.5pt;"><i>In-Charge</i></div>
            </div>
          </div>
`;
        return html;
      };

      const tableHtmlOne = generateTableHtml();
      
      let content = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset='utf-8'><title>DTR ${this.internName}</title>
        <!--[if gte mso 9]>
        <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
          <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          @page { 
            size: portrait; 
            margin: 0.25in; 
          }
          body { margin: 0; padding: 0; }
          .main-table { width: 100%; border-collapse: collapse; border: none; table-layout: fixed; }
          .column { width: 50%; vertical-align: top; border: none; padding: 0 3pt; }
        </style>
        </head>
        <body>
          <table class="main-table">
            <tr>
              <td class="column">${tableHtmlOne}</td>
              <td class="column">${tableHtmlOne}</td>
            </tr>
          </table>
        </body></html>
      `;

      const blob = new Blob(['\ufeff', content], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `DTR_${this.internName.replace(/\s+/g, '_')}_${monthName}_${year}.doc`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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

      for (let day = 1; day <= 31; day++) {
        const data = byDay[day];
        const amArr = data ? data.amArrival : '';
        const amDep = data ? data.amDeparture : '';
        const pmArr = data ? data.pmArrival : '';
        const pmDep = data ? data.pmDeparture : '';
        const hoursVal = '';
        const minsVal = '';

        tableHtmlOne += '<tr>';
        tableHtmlOne += `<td style="text-align:center;">${day}</td>`;
        tableHtmlOne += `<td style="text-align:center;">${amArr}</td>`;
        tableHtmlOne += `<td style="text-align:center;">${amDep}</td>`;
        tableHtmlOne += `<td style="text-align:center;">${pmArr}</td>`;
        tableHtmlOne += `<td style="text-align:center;">${pmDep}</td>`;
        tableHtmlOne += `<td style="text-align:center;">${hoursVal}</td>`;
        tableHtmlOne += `<td style="text-align:center;">${minsVal}</td>`;
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

.attendance-main {
  max-width: 1100px;
  margin: 2rem auto;
  padding: 0 1rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.card {
  background: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
  padding: 1.5rem;
}

.filter-card h2,
.table-card h2 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  color: #0f172a;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
  align-items: flex-end;
}

label {
  display: block;
  margin-bottom: 0.3rem;
  font-size: 0.85rem;
  color: #4b5563;
}

select,
input[type="date"] {
  width: 100%;
  padding: 0.45rem 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
  font-size: 0.9rem;
}

.download-wrapper {
  display: flex;
  justify-content: flex-end;
}

.btn-download-active {
  padding: 0.6rem 1.2rem;
  border-radius: 999px;
  border: none;
  background: #f97316;
  color: #fff;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-download-active:hover {
  background: #ea580c;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  width: 90%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-content h3 {
  margin-top: 0;
  color: #1e293b;
}

.modal-content p {
  color: #64748b;
  margin-bottom: 1.5rem;
}

.modal-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.btn-pdf, .btn-word {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-pdf:hover {
  background: #fee2e2;
  border-color: #ef4444;
  color: #b91c1c;
}

.btn-word:hover {
  background: #dbeafe;
  border-color: #3b82f6;
  color: #1d4ed8;
}

.btn-close {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  font-size: 0.9rem;
  text-decoration: underline;
}

.btn-close:hover {
  color: #64748b;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

th,
td {
  padding: 0.6rem 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

th {
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #6b7280;
}

tr:hover td {
  background: #f9fafb;
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

.badge-late {
  background: #fee2e2;
  color: #b91c1c;
}

@media (max-width: 900px) {
  .filter-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .filter-grid {
    grid-template-columns: 1fr;
  }
  .pagination-wrapper {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}

/* Pagination Styles */
.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.items-per-page {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #4b5563;
}

.items-per-page select {
  width: auto;
  padding: 0.3rem 0.5rem;
  border-radius: 0.375rem;
  border: 1px solid #d1d5db;
  color: #111827;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-page {
  padding: 0.4rem 0.8rem;
  border-radius: 0.375rem;
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #374151;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-page:hover:not(:disabled) {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.btn-page:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 0.85rem;
  color: #4b5563;
  font-weight: 500;
}
</style>
