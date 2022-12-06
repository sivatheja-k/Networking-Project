// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

//TODO MINE
// const firebaseConfig = {
//   apiKey: "AIzaSyCIDAQhljlTQGY59STEnF6EvrqBWmwWQD4",
//   authDomain: "travel-37b6d.firebaseapp.com",
//   projectId: "travel-37b6d",
//   storageBucket: "travel-37b6d.appspot.com",
//   messagingSenderId: "819339224842",
//   appId: "1:819339224842:web:e0deee7f2b956520e1bcf3",
// };
const firebaseConfig = {
  apiKey: "AIzaSyDBoKOB2dw_4sar0aQXI9QDpc_OUVkGz8I",
  authDomain: "uta-attendance-system.firebaseapp.com",
  projectId: "uta-attendance-system",
  storageBucket: "uta-attendance-system.appspot.com",
  messagingSenderId: "349895617208",
  appId: "1:349895617208:web:91be33149dc1773a49a24d"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
