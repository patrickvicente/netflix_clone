// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import {getFirestore} from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCWN-H-YcSmNaYXnkcHSvN2nz8tIn9O1AM",
  authDomain: "netflix-clone-8fd41.firebaseapp.com",
  projectId: "netflix-clone-8fd41",
  storageBucket: "netflix-clone-8fd41.appspot.com",
  messagingSenderId: "300694915495",
  appId: "1:300694915495:web:52f2196d695f3cec2b0e82"
};


const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth();

export { auth };
export default db;