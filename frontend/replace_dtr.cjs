const fs = require('fs');

const path = 'c:/Users/Kim Anonuevo/DICT_PROJECT/frontend/src/views/intern/AttendanceView.vue';
let content = fs.readFileSync(path, 'utf8');

// Mod 1: Remove modal
content = content.replace(
    /    <!-- Download Format Modal -->[\s\S]*?    <\/div>/,
    ''
);

// Mod 2: Update button
content = content.replace(
    '<button class="px-5 py-2.5 rounded-full border-none bg-orange-500 text-white text-sm font-semibold cursor-pointer transition-colors hover:bg-orange-600 w-full md:w-auto" @click="showDownloadModal = true">Download DTR</button>',
    '<button class="px-5 py-2.5 rounded-full border-none bg-orange-500 text-white text-sm font-semibold cursor-pointer transition-colors hover:bg-orange-600 w-full md:w-auto" @click="exportPdf">Download DTR</button>'
);

// Mod 3: Remove showDownloadModal from data
content = content.replace(
    /      showDownloadModal: false,\r?\n/,
    ''
);

// Mod 4: Remove handleDownload and exportWord
const handleDownloadStart = content.indexOf('    handleDownload(format) {');
const exportPdfStart = content.indexOf('    exportPdf() {');

if (handleDownloadStart !== -1 && exportPdfStart !== -1) {
    content = content.slice(0, handleDownloadStart) + content.slice(exportPdfStart);
} else {
    console.log('Could not find handleDownload or exportPdf');
}

// Mod 5: Update exportPdf loop
const oldLoop = `      for (let day = 1; day <= 31; day++) {
        const data = byDay[day];
        const amArr = data ? data.amArrival : '';
        const amDep = data ? data.amDeparture : '';
        const pmArr = data ? data.pmArrival : '';
        const pmDep = data ? data.pmDeparture : '';
        const hoursVal = '';
        const minsVal = '';

        tableHtmlOne += '<tr>';
        tableHtmlOne += \`<td style="text-align:center;">\${day}</td>\`;
        tableHtmlOne += \`<td style="text-align:center;">\${amArr}</td>\`;
        tableHtmlOne += \`<td style="text-align:center;">\${amDep}</td>\`;
        tableHtmlOne += \`<td style="text-align:center;">\${pmArr}</td>\`;
        tableHtmlOne += \`<td style="text-align:center;">\${pmDep}</td>\`;
        tableHtmlOne += \`<td style="text-align:center;">\${hoursVal}</td>\`;
        tableHtmlOne += \`<td style="text-align:center;">\${minsVal}</td>\`;
        tableHtmlOne += '</tr>';
      }`;

const newLoop = `      for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(year, monthIndex, day);
        const dayOfWeek = currentDate.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const weekendName = dayOfWeek === 0 ? 'SUNDAY' : 'SATURDAY';

        const data = byDay[day];
        const amArr = data ? data.amArrival : '';
        const amDep = data ? data.amDeparture : '';
        const pmArr = data ? data.pmArrival : '';
        const pmDep = data ? data.pmDeparture : '';
        const hoursVal = '';
        const minsVal = '';

        tableHtmlOne += '<tr>';
        tableHtmlOne += \`<td style="text-align:center;">\${day}</td>\`;

        if (isWeekend && !amArr && !amDep && !pmArr && !pmDep) {
          tableHtmlOne += \`<td colspan="4" style="text-align:center;font-weight:bold;letter-spacing:1px;">\${weekendName}</td>\`;
        } else {
          tableHtmlOne += \`<td style="text-align:center;">\${amArr}</td>\`;
          tableHtmlOne += \`<td style="text-align:center;">\${amDep}</td>\`;
          tableHtmlOne += \`<td style="text-align:center;">\${pmArr}</td>\`;
          tableHtmlOne += \`<td style="text-align:center;">\${pmDep}</td>\`;
        }
        tableHtmlOne += \`<td style="text-align:center;">\${hoursVal}</td>\`;
        tableHtmlOne += \`<td style="text-align:center;">\${minsVal}</td>\`;
        tableHtmlOne += '</tr>';
      }

      for (let day = daysInMonth + 1; day <= 31; day++) {
        tableHtmlOne += '<tr>';
        tableHtmlOne += \`<td style="text-align:center;">\${day}</td>\`;
        tableHtmlOne += \`<td></td><td></td><td></td><td></td><td></td><td></td>\`;
        tableHtmlOne += '</tr>';
      }`;

if (content.indexOf(oldLoop) !== -1) {
    content = content.replace(oldLoop, newLoop);
} else {
    console.log('Could not find old loop');
}

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully updated AttendanceView.vue');
