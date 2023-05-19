import axios from "axios";
import { useNavigate } from "react-router";
import { useUserRole } from "./../context/UserRoleContext";
import React from "react";

const LoggedIn = () => {
  const { setUserRole } = useUserRole();
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token"); // remove the token from local storage
    navigate("/login"); // navigate to the login page
    setUserRole("");
  };

  return (
    <button
      className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      onClick={handleLogout}
    >
      Logout
    </button>
  );
};
export default LoggedIn;
