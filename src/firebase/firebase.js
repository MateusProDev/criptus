// src/firebase/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAL-w-F_TDSKBNyEfg2UBmvuKYjsgDig28",
  authDomain: "criptus-55230.firebaseapp.com",
  projectId: "criptus-55230",
  storageBucket: "criptus-55230.appspot.com",
  messagingSenderId: "675165137177",
  appId: "1:675165137177:web:1dc74f4006ea777d17bd88"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

const googleProvider = new GoogleAuthProvider();

const signInWithGooglePopup = async () => {
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};

const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};

export { db, auth, storage, signInWithGooglePopup, logout };
