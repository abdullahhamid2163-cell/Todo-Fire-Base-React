import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBHJ_y_jy_BCY9Dhvo8Tjy3UzW5Kt4wIv8",
  authDomain: "todo-app-8d474.firebaseapp.com",
  projectId: "todo-app-8d474",
  storageBucket: "todo-app-8d474.firebasestorage.app",
  messagingSenderId: "22627656069",
  appId: "1:22627656069:web:302450c228bb24fa9024ec",
  measurementId: "G-8SNGFKGEBZ",
};

const app = initializeApp(firebaseConfig);

export const analytics =
  typeof window !== "undefined" ? getAnalytics(app) : null;

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
