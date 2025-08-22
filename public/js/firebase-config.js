import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAt8wJzeOA1Ewi8ook67NNE6_gXTJuqXxQ",
  authDomain: "smartlib-team.firebaseapp.com",
  projectId: "smartlib-team",
  storageBucket: "smartlib-team.firebasestorage.app",
  messagingSenderId: "765080868030",
  appId: "1:765080868030:web:8905d5487ea2e01a07faef",
  measurementId: "G-0LCPPKFPQX"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);
const messaging = getMessaging(app);

export { app, auth, db, functions, messaging };
