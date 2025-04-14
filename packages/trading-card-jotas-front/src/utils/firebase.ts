import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
  authDomain: "biggiscript.firebaseapp.com",
  databaseURL: "https://biggiscript.firebaseio.com",
  projectId: "biggiscript",
  storageBucket: "biggiscript.firebasestorage.app",
  messagingSenderId: "761282575903",
  appId: "1:761282575903:web:1f7e783b6d6a3f72321f2a",
};

const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
