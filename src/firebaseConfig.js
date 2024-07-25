// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAL-w-F_TDSKBNyEfg2UBmvuKYjsgDig28",
    authDomain: "criptus-55230.firebaseapp.com",
    projectId: "criptus-55230",
    storageBucket: "criptus-55230.appspot.com",
    messagingSenderId: "675165137177",
    appId: "1:675165137177:web:1dc74f4006ea777d17bd88"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };
