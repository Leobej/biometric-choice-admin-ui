import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ButtonsForm from "./ButtonsForm";
import Error from "./Error";
import axios from "axios";
const FormLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/authenticate",
        {
          username,
          password,
        },
        {
          withCredentials: true,
        }
      );

      const token = response.headers.authorization.split(" ")[1];
      localStorage.setItem("token", token);
      navigate("/registration");
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.log("error");
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
            onChange={(e) => setUsername(e.target.value)}
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
      {error && <Error message="Invalid username or password" />}
      <ButtonsForm />
    </form>
  );
};

export default FormLogin;
