import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function FingerprintRegistration() {
  const navigate = useNavigate();
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [cnp, setCnp] = useState("");
  const [createdAt, setCreatedAt] = useState("");

  const [fingerprintId, setFingerprintId] = useState(0);
  const [deviceId, setDeviceId] = useState("REG_1");
  const [password, setPassword] = useState("password");
  const [registerStatus, setRegisterStatus] = useState("pending");

  useEffect(
    () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
       } 
    },
    [navigate],
  );

  const sendNextFingerprint = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("fingerprints/nextFingerprint", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const getLatestFingerprintId = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `fingerprints/getFingerprintId/${deviceId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetFingerprintClick = async (event) => {
    event.preventDefault();
    const latestFingerprintId = await getLatestFingerprintId();
    setFingerprintId(latestFingerprintId);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setRegisterStatus("pending");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `/voters`,
        {
          firstname: firstname,
          lastname: lastname,
          cnp,
          fingerprint: fingerprintId,
          createdAt,
          password,
        },
        {
          withCredentials: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      setRegisterStatus("success");
    } catch (error) {
      console.log(error);
      setRegisterStatus("error");
    }

    setFirstName("");
    setLastName("");
    setCnp("");
    setFingerprintId("");
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // remove the token from local storage
    navigate("/login"); // navigate to the login page
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-6">Fingerprint Registration</h1>
      <form
        className="bg-white rounded-lg p-6 shadow-md"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="first_name"
          >
            First Name
          </label>
          <input
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="first_name"
            type="text"
            placeholder="John"
            value={firstname}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="last_name"
          >
            Last Name
          </label>
          <input
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="last_name"
            type="text"
            placeholder="Doe"
            value={lastname}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="cnp">
            CNP
          </label>
          <input
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="cnp"
            type="text"
            placeholder="1234567890123"
            value={cnp}
            onChange={(e) => setCnp(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="fingerprint"
          >
            Fingerprint
          </label>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={sendNextFingerprint}
          >
            Scan Fingerprint
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleGetFingerprintClick}
          >
            Get Latest Fingerprint ID
          </button>
        </div>

        <div className="flex items-center justify-between">
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleLogout}
          >
            Logout
          </button>

          <div>
            <div>Fingerprint ID: {fingerprintId}</div>

            {registerStatus === "success" && (
              <div style={{ color: "green" }}>
                User registered successfully!
              </div>
            )}
            {registerStatus === "error" && (
              <div style={{ color: "red" }}>
                An error occurred while registering user.
              </div>
            )}
          </div>

          <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Cancel
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}

export default FingerprintRegistration;
