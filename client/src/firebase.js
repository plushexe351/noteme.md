// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";
const firebaseConfig = {
  apiKey: "AIzaSyCOMK_r75945DmBu5qM2c4UfmbYJUze5EE",
  authDomain: "noteme-81ada.firebaseapp.com",
  projectId: "noteme-81ada",
  storageBucket: "noteme-81ada.appspot.com",
  messagingSenderId: "44152871301",
  appId: "1:44152871301:web:60eafd2ecd270e89ab8cec",
  measurementId: "G-7TQ67MQDT9",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const analytics = getAnalytics(app);

// const signInWithGoogle = (setUser) => {
//   signInWithPopup(auth, provider)
//     .then((result) => {
//       const user = result.user;
//       setUser({
//         uid: user.uid,
//         name: user.displayName,
//         email: user.email,
//       });

//       // Store UID in the database
//       fetch("/api/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ uid: user.uid }),
//       })
//         .then((res) => res.json())
//         .then((data) => {
//           console.log(data);
//           // Redirect to home or handle navigation
//         });
//     })
//     .catch((error) => {
//       console.error(error);
//       throw error;
//     });
// };

export { auth, provider };
