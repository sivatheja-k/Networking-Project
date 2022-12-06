import React, { useEffect, useRef, useState } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "../firebase/firebase";
// import { signOutUser } from "../Helpers/Login";
import Loader from "../ui-component/Loader";
import { useLocation, useNavigate } from "react-router";
import { collection, doc, onSnapshot, query, setDoc } from "firebase/firestore";
import { fetchAllData } from "../api/api";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [allStudents, setStudents] = useState([]);
  const timeout = useRef();
  console.log("AuthProvider", { user });

  function signUp(name, email, password) {
    setIsLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        setIsLoading(false);

        updateProfile(auth.currentUser, {
          displayName: name,
        })
          .then(() => {
            // Profile updated!
            console.log("Profile updated!");
          })
          .catch((error) => {
            // An error occurred
            console.log(error);
            // ...
          });
        const instructorRef = doc(db, "instructors", user.uid);
        setDoc(instructorRef, {
          email,
          id: user.uid,
          name,
          role: "Instructor",
        }).then(() => {
          console.log("Instructor Added to Database");
        });
      })
      .catch((error) => {
        setIsLoading(false);

        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        if (errorCode === "auth/weak-password") {
          setErrorMessage({ password: errorMessage });
        } else {
          setErrorMessage({ email: errorMessage });
        }
      });
  }
  function login({ email, password }) {
    setIsLoading(true);

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        setIsLoading(false);

        // ...
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
        setIsLoading(false);

        setErrorMessage("Invalid Email/Password");
      });
  }

  function signOutUser() {
    signOut(auth)
      .then(() => {
        console.log("Sign Out Sucessfull");
      })
      .catch((error) => {
        console.log(error);
      });
  }
  useEffect(() => {
    const q = query(collection(db, "students"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });
      setStudents(data);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const subscription = onAuthStateChanged(auth, (usr) => {
      console.log("inise auth change");

      if (usr != null) {
        console.log("inise auth 3 change");
        console.log(usr);
        setIsAuthenticated(true);
        setUser(usr);
        // setUser(user); // will set the user and all the useEffect's will use this user
        if (["/login", "/register"].includes(location.pathname)) {
          navigate("/");
        }
        // else {
        //   navigate(location.pathname);
        // }
      } else {
        setIsAuthenticated(false);
        console.log("😢 We are not authenticated!");
      }
      setIsLoading(false);
    });
    return () => {
      subscription();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setErrorMessage = (err) => {
    setError(err);
    if (timeout.current) {
      console.log(timeout.current);
      clearTimeout(timeout.current);
    }
    timeout.current = setTimeout(() => {
      setError(null);
    }, 3000);
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        signOutUser,
        signUp,
        login,
        error,
        allStudents,
      }}
    >
      {!isLoading ? children : <Loader />}
    </AuthContext.Provider>
  );
};
