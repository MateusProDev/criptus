// components/Login.js
import React from "react";
import { auth, provider } from "../firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import { useDispatch } from "react-redux";
import { login } from "../features/userSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const signIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        dispatch(login({
          name: result.user.displayName,
          email: result.user.email,
          avatar: result.user.photoURL,
        }));
        navigate("/feed");
      })
      .catch((error) => alert(error.message));
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={signIn}>Sign in with Google</button>
    </div>
  );
};

export default Login;
