// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBUkmNz0vMTBB6zUVzMfVIZDU2YKProBCI",
  authDomain: "explorewithlocals-f8570.firebaseapp.com",
  projectId: "explorewithlocals-f8570",
  storageBucket: "explorewithlocals-f8570.appspot.com",
  messagingSenderId: "916921731834",
  appId: "1:916921731834:web:fb2ebca3ddecfbdf555743",
  measurementId: "G-2437J80E2M",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
