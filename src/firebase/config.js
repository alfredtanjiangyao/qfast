import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDDTzek1MiTGGBz0aFSUF4dtzwuzYd4Lqs",
    authDomain: "qfast-77dbc.firebaseapp.com",
    projectId: "qfast-77dbc",
    storageBucket: "qfast-77dbc.appspot.com",
    messagingSenderId: "24806013722",
    appId: "1:24806013722:web:6060bc5454844bb37c0aa3",
    measurementId: "G-HTVGB6SQ5C"
};

const app = firebase.initializeApp(firebaseConfig);
export const db = getFirestore(app);