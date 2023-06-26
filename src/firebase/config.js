import * as firebase from "firebase/app";
// import * as firebase from 'firebase/app'; 已经include全部东西了？
import "firebase/auth";
import "@firebase/firestore";

import { getAuth, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import {API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID, MEASUREMENT_ID} from '@env';


const firebaseConfig = {
    apiKey: API_KEY || "your-default-api-key",
    authDomain: AUTH_DOMAIN || "your-default-auth-domain",
    projectId: PROJECT_ID || "your-default-project-id",
    storageBucket: STORAGE_BUCKET || "your-default-storage-bucket",
    messagingSenderId: MESSAGING_SENDER_ID || "your-default-sender-id",
    appId: APP_ID || "your-default-app-id",
    measurementId: MEASUREMENT_ID || "your-default-measurement-id",
  };
  
  export default firebaseConfig;
  


// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
