import React from "react";
import { Link, useNavigate } from "react-router-dom";

import Title from "./components/Title";
import FormLogin from "./components/FormLogin";
function Login() {
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Title/>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <FormLogin/>
        </div>
      </div>
    </div>
  );
}

export default Login;
