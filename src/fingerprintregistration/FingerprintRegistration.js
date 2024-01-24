import React from "react";
import {  useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";

function FingerprintRegistration() {
  const navigate = useNavigate();
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [cnp, setCnp] = useState("");
  const [fingerprintId, setFingerprintId] = useState(0);
  const [deviceId, setDeviceId] = useState("");
  const [devices, setDevices] = useState([]);
  const [registerStatus, setRegisterStatus] = useState("pending");
  const [birthdate, setBirthdate] = useState("");
  const [selectedDevice, setSelectedDevice] = useState(null); 

  const handleDeviceChange = (selectedOption) => {
    setSelectedDevice(selectedOption);
    setDeviceId(selectedOption.value); 
    console.log(selectedOption.value);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
    fetchDevices();
  }, [navigate]);

  const fetchDevices = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`http://localhost:8080/devices`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const deviceOptions = response.data.content.map((device) => ({
        value: device.id,
        label: device.name,
      }));
      console.log(deviceOptions);
      setDevices(deviceOptions);
    } catch (error) {
      console.error("Error fetching devices:", error);
    }
  };

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

  const voterData = {
    firstname,
    lastname,
    cnp,
    fingerprintId,
    birthdate,
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setRegisterStatus("pending");
    console.log(localStorage.getItem("token"));
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8080/voters/register",
        voterData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response);
      setRegisterStatus("success");
      if (response.status === 200 || response.status === 201) {
        setBirthdate("");
        setCnp("");
        setFirstName("");
        setLastName("");

        setFingerprintId(0);
      }
    } catch (error) {
      console.log(error);
      setRegisterStatus("error");
    }

    console.log({
      firstname,
      lastname,
      cnp,
      fingerprintId,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // remove the token from local storage
    navigate("/login"); // navigate to the login page
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="w-full max-w-lg p-4 bg-white rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
            Fingerprint Registration
          </h1>
          <div className="space-y-4">
            <div className="flex flex-col">
              <label
                className="text-gray-700 font-bold mb-2"
                htmlFor="first_name"
              >
                First Name
              </label>
              <input
                className="border border-gray-300 rounded py-2 px-3 text-gray-700 focus:ring-2 focus:ring-blue-500"
                id="first_name"
                type="text"
                placeholder="John"
                value={firstname}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label
                className="text-gray-700 font-bold mb-2"
                htmlFor="last_name"
              >
                Last Name
              </label>
              <input
                className="border border-gray-300 rounded py-2 px-3 text-gray-700 focus:ring-2 focus:ring-blue-500"
                id="last_name"
                type="text"
                placeholder="Doe"
                value={lastname}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700 font-bold mb-2" htmlFor="cnp">
                CNP
              </label>
              <input
                className="border border-gray-300 rounded py-2 px-3 text-gray-700 focus:ring-2 focus:ring-blue-500"
                id="cnp"
                type="text"
                placeholder="1234567890123"
                value={cnp}
                onChange={(e) => {
                  setCnp(e.target.value);
                }}
              />
            </div>

            <div className="flex flex-col">
              <label
                className="text-gray-700 font-bold mb-2"
                htmlFor="birthdate"
              >
                Birthdate
              </label>
              <input
                className="border border-gray-300 rounded py-2 px-3 text-gray-700 focus:ring-2 focus:ring-blue-500"
                id="birthdate"
                type="date"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
              />
            </div>

            <div className="mt-4">
              <label className="block text-gray-700 font-bold mb-2">
                Select Device:
              </label>
              <Select
                value={selectedDevice}
                onChange={handleDeviceChange}
                options={devices}
                className="basic-single"
                classNamePrefix="select"
              />
            </div>
          </div>
          <div className="mt-6 mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="fingerprint"
            >
              Fingerprint
            </label>
            <div className="flex space-x-4">
              <button
                className="flex-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={sendNextFingerprint}
              >
                Scan Fingerprint
              </button>
              <button
                className="flex-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={handleGetFingerprintClick}
              >
                Get Latest Fingerprint ID
              </button>
            </div>
          </div>

  
          <div className="flex items-center justify-between mt-6">
            <button
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleLogout}
            >
              Logout
            </button>
            <div className="text-center">
              <div>Fingerprint ID: {fingerprintId}</div>
              <div className="mt-4">
                <span className="text-gray-700">Device ID: {deviceId}</span>
              </div>
              {registerStatus === "success" && (
                <div className="text-green-500">
                  User registered successfully!
                </div>
              )}
              {registerStatus === "error" && (
                <div className="text-red-500">
                  An error occurred while registering user.
                </div>
              )}
            </div>
            <div className="flex space-x-4">
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
          </div>
        </form>
      </div>
    </div>
  );
}

export default FingerprintRegistration;
