import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyDkeV5iBsc5Zq-8AtDE5BzvXatGcvmvmUo",
  authDomain: "home-energy-report-ba33d.firebaseapp.com",
  projectId: "home-energy-report-ba33d",
  storageBucket: "home-energy-report-ba33d.firebasestorage.app",
  messagingSenderId: "238459081144",
  appId: "1:238459081144:web:3284d63064fc33dfd47f4d",
  measurementId: "G-QDNKR8CQWZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export { auth, db, storage }