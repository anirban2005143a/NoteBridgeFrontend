import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDXsY7E7L9ax2DRxg0VMbLwRem9kFE3BWA",
  authDomain: "enotebook-b18cd.firebaseapp.com",
  projectId: "enotebook-b18cd",
  storageBucket: "enotebook-b18cd.appspot.com",
  messagingSenderId: "1012814641456",
  appId: "1:1012814641456:web:3590f5337d4172a7c7f0f5",
  measurementId: "G-KBENG4HQLZ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);