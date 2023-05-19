import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
const CreateElectionForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [candidateId, setCandidateId] = useState("");
  const [candidates, setCandidates] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchCandidates = async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8080/candidates/searchName?query=${searchQuery}`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.length > 0) {
        setCandidates(response.data);
        console.log(candidates);
      } else {
        setCandidates([]);
      }
    };

    const timer = setTimeout(() => {
      fetchCandidates();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const resetForm = () => {
    setName("");
    setDescription("");
    setStartDate("");
    setEndDate("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const handleCandidateClick = (candidate) => {
    setSearchQuery(`${candidate.firstname} ${candidate.lastname}`);
    setSelectedCandidate(candidate);
    setCandidates([]);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
          Election Name:
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="description"
          className="block text-gray-700 font-bold mb-2"
        >
          Description:
        </label>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="candidate"
          className="block text-gray-700 font-bold mb-2"
        >
          Candidate:
        </label>
        <input
          type="text"
          id="candidate"
          name="candidate"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Search for a candidate"
        />

        <ul className="candidate-list mt-2">
          {candidates.map((candidate) => (
            <li
              key={candidate.candidateId}
              onClick={() => handleCandidateClick(candidate)}
              className="cursor-pointer hover:bg-gray-200 px-3 py-1"
            >
              {candidate.firstname} {candidate.lastname}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <label
          htmlFor="startDate"
          className="block text-gray-700 font-bold mb-2"
        >
          Start Date:
        </label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          value={startDate}
          onChange={(event) => setStartDate(event.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="endDate" className="block text-gray-700 font-bold mb-2">
          End Date:
        </label>
        <input
          type="date"
          id="endDate"
          name="endDate"
          value={endDate}
          onChange={(event) => setEndDate(event.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Create Election
      </button>
    </form>
  );
};

export default CreateElectionForm;
