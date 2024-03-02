// src/firebase-config.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCW-5VNS3duO_pJaBrJquoiclh8jGq69-Q",
  authDomain: "hack-for-health-416014.firebaseapp.com",
  projectId: "hack-for-health-416014",
  storageBucket: "hack-for-health-416014.appspot.com",
  messagingSenderId: "167742677785",
  appId: "1:167742677785:web:someAppIdValue",
  measurementId: "someMeasurementId"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
