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
  const keys = new Set();
  const rawStatus = new Set();
  
  snap.forEach(doc => {
    const data = doc.data();
    Object.keys(data).forEach(k => keys.add(k));
    if (data.status) rawStatus.add(data.status);
    if (data.validationStatus) rawStatus.add(`validationStatus: ${data.validationStatus}`);
    
    if (Object.values(data).some(v => typeof v === 'string' && v.toLowerCase().includes('leave'))) {
      console.log('Found Leave in doc:', doc.id, data);
    }
  });
  console.log("Distinct Keys:", Array.from(keys));
  console.log("Distinct 'status' values:", Array.from(rawStatus));
  process.exit(0);
}
run().catch(console.error);
