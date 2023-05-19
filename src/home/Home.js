import React from 'react';
import axios from "axios";
import { useNavigate } from 'react-router';
import './Home.css'; // Import the CSS file

const Home = ({ onAdminClick, onRegisterClick }) => {
  const navigate = useNavigate();

  const handleAdminClick = () => {
    navigate("/admin");
  };

  const handleRegisterClick = () => {
    navigate("/registration");
  };

  return (
    <div className="home-menu">
      <h1>Welcome</h1>
      <div className="buttons">
        <button className="admin-btn" onClick={handleAdminClick}>
          Admin
        </button>
        <button className="register-btn" onClick={handleRegisterClick}>
          Registration User
        </button>
      </div>
    </div>
  );
};



export default Home;

