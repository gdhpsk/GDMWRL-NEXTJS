// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_API,
  authDomain: "mwrl-7b27f.firebaseapp.com",
  databaseURL: "https://mwrl-7b27f-default-rtdb.firebaseio.com",
  projectId: "mwrl-7b27f",
  storageBucket: "mwrl-7b27f.appspot.com",
  messagingSenderId: "859550591453",
  appId: "1:859550591453:web:c5855e3297dbc893f9ee34",
  measurementId: "G-F3NGY6T7QH"
};

// Initialize Firebase
let app = firebase.initializeApp(firebaseConfig, "client");


// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app)

export default db

