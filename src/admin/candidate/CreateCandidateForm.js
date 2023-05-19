import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router";
const CreateCandidateForm = () => {

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [party, setParty] = useState("");
  const [position, setPosition] = useState("");
  const [image, setImage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setParty("");
    setPosition("");
    setImage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("party", party);
    formData.append("position", position);
    formData.append("image", image);

  
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:8080/candidates", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.status === 200) {
        alert("Candidate created successfully!");
        resetForm();
      }
        resetForm();
    } catch (error) {
      console.error("Error creating candidate:", error);
      alert("Error creating candidate. Please try again.");


    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="mb-4">
        <label htmlFor="firstName" className="block text-gray-700 font-bold mb-2">
          First Name:
        </label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="lastName" className="block text-gray-700 font-bold mb-2">
          Last Name:
        </label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="party" className="block text-gray-700 font-bold mb-2">
          Party:
        </label>
        <input
          type="text"
          id="party"
          name="party"
          value={party}
          onChange={(event) => setParty(event.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="position" className="block text-gray-700 font-bold mb-2">
          Position:
        </label>
        <input
          type="text"
          id="position"
          name="position"
          value={position}
          onChange={(event) => setPosition(event.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="image" className="block text-gray-700 font-bold mb-2">
          Candidate Image:
        </label>
        <input
          type="file"
          id="image"
          name="image"
          onChange={(event) => setImage(event.target.files[0])}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Create Candidate
      </button>
    </form>
  );
};

export default CreateCandidateForm;
