const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: 'AIzaSyC4f3shTFohCCpYQS2Ies3QSbdY9fXEzNg',
  authDomain: 'attendict-8f7ae.firebaseapp.com',
  projectId: 'attendict-8f7ae',
  storageBucket: 'attendict-8f7ae.firebasestorage.app',
  messagingSenderId: '983312728497',
  appId: '1:983312728497:web:acd7624a6673830e027d90',
  measurementId: 'G-SP4J5LCEZV'
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  const q = query(collection(db, 'staff_attendance'));
  const snap = await getDocs(q);
  const statuses = new Set();
  snap.forEach(doc => {
    const data = doc.data();
    if (data.staffStatus) statuses.add(data.staffStatus);
    if (data.staffStatusAM) statuses.add(data.staffStatusAM + ' (AM)');
    if (data.staffStatusPM) statuses.add(data.staffStatusPM + ' (PM)');
    
    // just in case it is capitalized differently
    if (data.staffStatus && data.staffStatus.toLowerCase() === 'leave') {
      console.log('Found alternative Leave casing:', data.staffStatus);
    }
  });
  console.log("Distinct Statuses:", Array.from(statuses));
  process.exit(0);
}
run().catch(console.error);
