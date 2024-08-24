// esto son credenciales unicas son personales
// lo sacamos desde firabase (google) creando la propria cuenta

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCly3beWkAt-aQQaUYAHEVC_g2yh4xufc8",
  authDomain: "react-g18-codigo-todolist.firebaseapp.com",
  projectId: "react-g18-codigo-todolist",
  storageBucket: "react-g18-codigo-todolist.appspot.com",
  messagingSenderId: "179388337265",
  appId: "1:179388337265:web:caa8b881f70172b3d29fd0",
};

// este es de page-g18 firebase
// const firebaseConfig = {
//   apiKey: "AIzaSyDi1epoc7W5WKjGJYtyOWnaTi02IxMEAKo",
//   authDomain: "react-codigo-g18-page.firebaseapp.com",
//   projectId: "react-codigo-g18-page",
//   storageBucket: "react-codigo-g18-page.appspot.com",
//   messagingSenderId: "185062672670",
//   appId: "1:185062672670:web:056c7082255fa494ada10f"
// };

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);
