import React, { useState, useEffect } from "react";
import axios from "axios";

const ElectionForm = ({ isAddModalOpen, closeModal, saveElection, ...rest }) => {
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
  
    const [selectedElection, setSelectedElection] = useState(null);

    const handleCandidateClick = (candidate) => {
        setSearchQuery(`${candidate.firstname} ${candidate.lastname}`);
        setSelectedCandidate(candidate);
        setCandidates([]);
      };

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

    return (
        isAddModalOpen && (
          <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
             <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3
                    className="text-lg leading-6 font-medium text-gray-900"
                    id="modal-title"
                  >
                    Add Election
                  </h3>
                  <div className="mt-2">
                    <div className="mt-2">
                      <form onSubmit={saveElection}>
                        {/* Name field */}
                        <div className="mb-4">
                          <label
                            htmlFor="name"
                            className="block text-gray-700 font-bold mb-2"
                          >
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
                        {/* Description field */}
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
                            onChange={(event) =>
                              setDescription(event.target.value)
                            }
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          />
                        </div>
                        {/* Start Date field */}
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
                            onChange={(event) =>
                              setStartDate(event.target.value)
                            }
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          />
                        </div>
                        {/* End Date field */}
                        <div className="mb-4">
                          <label
                            htmlFor="endDate"
                            className="block text-gray-700 font-bold mb-2"
                          >
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
                            onChange={(event) =>
                              setSearchQuery(event.target.value)
                            }
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
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={saveElection}
              >
                Save
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring                  -2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
          </div>
        )
      )
    }
    
   


export default ElectionForm;
