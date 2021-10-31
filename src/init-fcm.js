import * as firebase from "firebase/app";
import "firebase/messaging";
const initializedFirebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyA0GeW0LSaeQ6EzioeV3c3vHDu2QF4MykQ",
   authDomain: "yoco-f7d21.firebaseapp.com",
   databaseURL: "https://yoco-f7d21.firebaseio.com",
   projectId: "yoco-f7d21",
   storageBucket: "yoco-f7d21.appspot.com",
   messagingSenderId: "253684519381",
   appId: "1:253684519381:web:e472bc45a5c5aed6c2ad5c",
   measurementId: "G-JM94R8PFD4"
});
 
    const   messaging = firebase.messaging.isSupported() ?    initializedFirebaseApp.messaging() : null
 
export {messaging}
