// Import Firebase SDK
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAT2ZrY8vug9xHYVcg-L0zwoGFgIMC9PDQ",
  authDomain: "hanuman-nursery.firebaseapp.com",
  projectId: "hanuman-nursery",
  storageBucket: "hanuman-nursery.firebasestorage.app",
  messagingSenderId: "455641900703",
  appId: "1:455641900703:web:da33f7ee130f0be48fa4aa"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

