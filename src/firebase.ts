// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword ,signInWithEmailAndPassword,signOut, onAuthStateChanged} from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs ,where,query ,deleteDoc, doc } from 'firebase/firestore';

import 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBmegmvJGs09uD5maDHzAfGg7jaLumn-hw",
  authDomain: "giffy-c1d11.firebaseapp.com",
  projectId: "giffy-c1d11",
  storageBucket: "giffy-c1d11.appspot.com",
  messagingSenderId: "236731912386",
  appId: "1:236731912386:web:5d581c6c1f904b8db86b5b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

 const signUpWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('User signed up:', user);
    return user;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};


export {
  auth,
  signUpWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  db,
  collection,
  addDoc,
  getDocs,
  where,
  query,
  deleteDoc,
  doc
};