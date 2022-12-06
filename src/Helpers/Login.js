import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

export function googgleSignIn() {
  signInWithPopup(auth, new GoogleAuthProvider())
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      console.log(token);
      const user = result.user;

      console.log(user);
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
      console.log({ errorCode, errorMessage, email, credential });
    });
}

export function signOutUser() {
  signOut(auth)
    .then(() => {
      console.log("Sign Out Sucessfull");
    })
    .catch((error) => {
      console.log(error);
    });
}
