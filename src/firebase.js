import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { collection, getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const app = initializeApp({
  apiKey: 'AIzaSyCR1Ccmrljs243Ol1Kmx3ZtDXdfiXkTcO8',
  authDomain: 'instagram-clone-b5d35.firebaseapp.com',
  projectId: 'instagram-clone-b5d35',
  storageBucket: 'instagram-clone-b5d35.appspot.com',
  messagingSenderId: '588482778839',
  appId: '1:588482778839:web:39395d4b0e3ef1ee978292'
});

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore();

export const usersColRef = collection(db, 'Users');

export const postsColRef = collection(db, 'posts');