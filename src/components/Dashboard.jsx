// components/Dashboard.js
import React from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";

const Dashboard = () => {
  const user = useSelector(selectUser);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user.name}</p>
    </div>
  );
};

export default Dashboard;
