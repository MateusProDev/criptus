// src/components/PrivateRoute.js
import React from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const user = useSelector(selectUser);
  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
