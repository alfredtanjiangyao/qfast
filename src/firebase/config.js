import * as firebase from 'firebase/app';
// import * as firebase from 'firebase/app'; 已经include全部东西了？
import 'firebase/auth';
import '@firebase/firestore';

import { getAuth, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// import 'firebase/firestore' -> doesn't provide access to the 'getFirestore' function -> so we need to import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDDTzek1MiTGGBz0aFSUF4dtzwuzYd4Lqs",
    authDomain: "qfast-77dbc.firebaseapp.com",
    projectId: "qfast-77dbc",
    storageBucket: "qfast-77dbc.appspot.com",
    messagingSenderId: "24806013722",
    appId: "1:24806013722:web:6060bc5454844bb37c0aa3",
    measurementId: "G-HTVGB6SQ5C"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

