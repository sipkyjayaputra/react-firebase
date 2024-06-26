import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage'; // Import getStorage from Firebase Storage

const firebaseConfig = {
    apiKey: "AIzaSyBjVrl7HV4QZt0YuUWK4wQoXLzcnaXZ8JE",
    authDomain: "react-firebase-ad600.firebaseapp.com",
    projectId: "react-firebase-ad600",
    storageBucket: "react-firebase-ad600.appspot.com",
    messagingSenderId: "1045598392759",
    appId: "1:1045598392759:web:6d6f98cc162dcd86455832",
    measurementId: "G-TPNR224B98"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app); // Initialize Firebase Storage

export { db, auth, storage }; // Export the storage object
