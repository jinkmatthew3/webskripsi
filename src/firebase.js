import firebase from 'firebase';
require("firebase/firestore")

var firebaseConfig = {
    apiKey: "AIzaSyA3cLLSJSlUlXdMdxxxP0ofxF8x1FjYYXk",
    authDomain: "skripsironi-7de02.firebaseapp.com",
    projectId: "skripsironi-7de02",
    storageBucket: "skripsironi-7de02.appspot.com",
    messagingSenderId: "449314187171",
    appId: "1:449314187171:web:a1d629b02ea8a7798f9c16"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export default firebase;