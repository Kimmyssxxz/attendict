import { initializeApp } from 'firebase/app';
import { getFirestore, initializeFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyC4f3shTFohCCpYQS2Ies3QSbdY9fXEzNg',
  authDomain: 'attendict-8f7ae.firebaseapp.com',
  projectId: 'attendict-8f7ae',
  storageBucket: 'attendict-8f7ae.firebasestorage.app',
  messagingSenderId: '983312728497',
  appId: '1:983312728497:web:acd7624a6673830e027d90',
  measurementId: 'G-SP4J5LCEZV'
};

// Google Maps configuration
export const GOOGLE_MAPS_API_KEY = 'AIzaSyC4f3shTFohCCpYQS2Ies3QSbdY9fXEzNg';
export const GOOGLE_MAPS_EMBED_URL = 'https://www.google.com/maps/embed/v1/place';

const app = initializeApp(firebaseConfig);

let db;
try {
  db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
    useFetchStreams: false,
  });
} catch {
  db = getFirestore(app);
}
const storage = getStorage(app);

export { app, db, storage };
