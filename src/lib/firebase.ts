import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyAMyq0iREZEyDg4ZapRhJ3froTvWbeiehk',
  authDomain: 'appdenise-d2366.firebaseapp.com',
  databaseURL: 'https://appdenise-d2366-default-rtdb.firebaseio.com',
  projectId: 'appdenise-d2366',
  storageBucket: 'appdenise-d2366.appspot.com',
  messagingSenderId: '702606543096',
  appId: '1:702606543096:web:86dbbeced05be1a5ad130d',
  measurementId: 'G-TGNJDE56CE',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      getAnalytics(app);
    }
  });
}

export default app;

