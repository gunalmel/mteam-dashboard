// firebase.js
import { initializeApp } from 'firebase/app';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
    apiKey: 'AIzaSyBaeP4r0k-wafVUnRns2dBmOoSK6Hw6p-0',
    authDomain: 'mteam-dashboard.firebaseapp.com',
    projectId: 'mteam-dashboard',
    storageBucket: 'mteam-dashboard.appspot.com',
    messagingSenderId: '1021586868377',
    appId: '1:1021586868377:web:790918f1cf1db7336f9008',
    measurementId: 'G-C3350L99YY'
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage, ref, getDownloadURL };
