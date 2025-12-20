// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

//AIzaSyDgfdCGcc1EQ9-uZZ2rjA4THkOMezUnLa8
const firebaseConfig = {
    apiKey: 'AIzaSyDgfdCGcc1EQ9-uZZ2rjA4THkOMezUnLa8',
    authDomain: 'react-app-chat-dbfcd.firebaseapp.com',
    projectId: 'react-app-chat-dbfcd',
    storageBucket: 'react-app-chat-dbfcd.firebasestorage.app',
    messagingSenderId: '41776032474',
    appId: '1:41776032474:web:91984ffaa303bdf9aa93e3',
    measurementId: 'G-B8ENM2MG6V',
    databaseURL:'https://react-app-chat-dbfcd-default-rtdb.asia-southeast1.firebasedatabase.app',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { app, db };
