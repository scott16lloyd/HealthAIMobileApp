// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getDatabase, ref, push } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAHFVjJjJeM_Soz2lsJOEIwSBiLWOS_RY0',
  authDomain: 'healthai-40b47.firebaseapp.com',
  databaseURL:
    'https://healthai-40b47-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'healthai-40b47',
  storageBucket: 'healthai-40b47.appspot.com',
  messagingSenderId: '493505764604',
  appId: '1:493505764604:web:2decb83a82f453f0398b79',
  measurementId: 'G-YDS75RSZME',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

const provider = new GoogleAuthProvider();

const signInWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.log(error);
    });
};

export { auth, signInWithGoogle, database, ref, push }; // Export the auth object