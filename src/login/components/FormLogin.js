import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ButtonsForm from "./ButtonsForm";
import Error from "./Error";
import axios from "axios";
import { useUserRole } from "./../../context/UserRoleContext";
import { useEffect } from "react";
const FormLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setUserRole } = useUserRole(); 
  const navigate = useNavigate();
  localStorage.setItem("userRole", "");

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token:")
    if (token==="") {
      navigate("/logged-in");
    }
  }, [navigate]);

  const fetchUserRole = async (email, setUserRole) => {
    try {
      const response = await axios.get(`http://localhost:8080/user/user-role/${email}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log(response.data);
      localStorage.setItem("userRole", response.data);
      setUserRole(response.data);
      console.log(localStorage.getItem("userRole"));
    } catch (error) {
      console.error("Error fetching user role:", error);
    }

    
  };
  

const handleSubmit = async (event) => {
  event.preventDefault();

  try {
    const response = await axios.post(
      "http://localhost:8080/authenticate",
      {
        email: email,
        password,
      },
      {
        withCredentials: true,
      }
    );

    const token = response.headers.authorization.split(" ")[1];
    localStorage.setItem("token", token);
    console.log(response);
 
    await fetchUserRole(email, setUserRole);
 
    const userRole = localStorage.getItem("userRole");
    console.log(userRole);
    if (userRole === 'ADMIN') {
      navigate("/admin");
    } else if (userRole === 'USER') {
      navigate("/registration");
    } else {
      setError("Invalid email or password");
    }
  } catch (error) {
    console.log(error);
  }
};



  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
     
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email address
        </label>
        <div className="mt-1">
          <input
            id="text"
            name="text"
            type="text"
            autoComplete="text"
            required
            onChange={(e) => setEmail(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <div className="mt-1">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            onChange={(e) => setPassword(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>
      {error && <Error message="Invalid email or password" />}
      <ButtonsForm />
    </form>
  );
};

export default FormLogin;
