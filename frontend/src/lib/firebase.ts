import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "placeholder-api-key",
  authDomain: "placeholder-auth-domain",
  projectId: "placeholder-project-id",
  storageBucket: "placeholder-storage-bucket",
  messagingSenderId: "placeholder-messaging-sender-id",
  appId: "placeholder-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
