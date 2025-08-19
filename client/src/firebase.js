// Import the functions you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: "health-report-analysis.firebaseapp.com",
  projectId: "health-report-analysis",
  storageBucket: "health-report-analysis.appspot.com",
  messagingSenderId: "1037839184431",
  appId: "1:1037839184431:web:8a8379158bdb20b03c4cda",
  measurementId: "G-1J18NP9ZRK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialize services
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
