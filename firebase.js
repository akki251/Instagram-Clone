// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from 'firebase/app';
import App from 'next/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDlJdqJaJdS9ghxLdT9VHpotJkszxSBTwM',
  authDomain: 'instagram-clone-50c16.firebaseapp.com',
  projectId: 'instagram-clone-50c16',
  storageBucket: 'instagram-clone-50c16.appspot.com',
  messagingSenderId: '337299157952',
  appId: '1:337299157952:web:c66299cd0cbb25b2808e25',
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export { app, db, storage };
