import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
const AddElectionModal = ({ isOpen, closeModal }) => {
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
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>

          <div
            className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto ml-">
              <div className="mt-4 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="mt-4">
                <label htmlFor="name" className="block text-gray-700">
                  Election Name:
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  className="form-input mt-1 block w-full"
                />
              </div>
              <div className="mt-4">
                <label htmlFor="description" className="block text-gray-700">
                  Description:
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  required
                  className="form-input mt-1 block w-full"
                />
              </div>
              <div className="mt-4">
                <label htmlFor="candidate" className="block text-gray-700">
                  Candidate:
                </label>
                <input
                  type="text"
                  id="candidate"
                  name="candidate"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  required
                  className="form-input mt-1 block w-full"
                  placeholder="Search for a candidate"
                />

                <ul
                  className="candidate-list mt-2 overflow-y-auto"
                  style={{ maxHeight: "150px" }}
                >
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

              <div className="mt-4">
                <label htmlFor="startDate" className="block text-gray-700">
                  Start Date:
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                  required
                  className="form-input mt-1 block w-full"
                />
              </div>
              <div className="mt-4">
                <label htmlFor="endDate" className="block text-gray-700">
                  End Date:
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={endDate}
                  onChange={(event) => setEndDate(event.target.value)}
                  required
                  className="form-input mt-1 block w-full"
                />
              </div>
              <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
                  <button
                    type="submit"
                    className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-green-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-green-500 focus:outline-none focus:border-green-700 focus:shadow-outline-green transition ease-in-out duration-150 sm:text-sm"
                  >
                    Create Election
                  </button>
                </span>
                <span className="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm"
                  >
                    Cancel
                  </button>
                </span>
              </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddElectionModal;
