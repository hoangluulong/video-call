import firebase from 'firebase/compat/app';
import "firebase/compat/auth"
import { getDatabase } from '@firebase/database';

const app = firebase.initializeApp({
    apiKey: "AIzaSyB5LG2uEw2hPa0cMmSk9uDRE8VZnNQz--0",
    authDomain: "video-call-23046.firebaseapp.com",
    databaseURL: "https://video-call-23046-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "video-call-23046",
    storageBucket: "video-call-23046.appspot.com",
    messagingSenderId: "416785819156",
    appId: "1:416785819156:web:130946d6a487d432eca901",
    measurementId: "G-M93HP6WQLN"
})

const databasedb = getDatabase(app);
export const roomID = window.location.pathname;

export const auth = app.auth();
export default databasedb;


