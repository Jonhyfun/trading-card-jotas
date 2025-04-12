import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA-syzN-WwskGP6ESb__lU6CFsa33kcKNU",
  authDomain: "biggiscript.firebaseapp.com",
  databaseURL: "https://biggiscript.firebaseio.com",
  projectId: "biggiscript",
  storageBucket: "biggiscript.appspot.com",
  messagingSenderId: "761282575903",
  appId: "1:761282575903:web:1f7e783b6d6a3f72321f2a"
};

const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);