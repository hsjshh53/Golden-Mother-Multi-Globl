import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBZ-XWW6aaPXAuuQztBNuYoQmMFJ7ossXA",
  authDomain: "gen-lang-client-0205422894.firebaseapp.com",
  databaseURL: "https://gen-lang-client-0205422894-default-rtdb.firebaseio.com",
  projectId: "gen-lang-client-0205422894",
  storageBucket: "gen-lang-client-0205422894.firebasestorage.app",
  messagingSenderId: "952068971544",
  appId: "1:952068971544:web:f82f50f6c6827ef960776d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);

export const ADMIN_EMAILS = [
  "asaq20227@gmail.com",
  "abdulwarisadeshina04@gmail.com"
];
