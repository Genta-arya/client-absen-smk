import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
const firebaseConfig = {
  apiKey: "AIzaSyCLzMlv6A-xW3FebAeJH5wtQJVaFhWjtO8",
  authDomain: "hotel-bc51a.firebaseapp.com",
  projectId: "hotel-bc51a",
  storageBucket: "hotel-bc51a.firebasestorage.app",
  messagingSenderId: "416841634167",
  appId: "1:416841634167:web:84579aa161d9e253a15172",
  measurementId: "G-9K63CQPWY3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//     FCM
export const messaging = getMessaging(app);


