import React, { useEffect, useState } from "react";
import axios from "axios";

const EditElectionModal = ({
  isOpen,
  closeModal,
  election,
  showNotification,
  fetchElections,
}) => {
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  // const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedCandidates, setSelectedCandidates] = useState(
    election.candidates || []
  );

  console.log(election);

  useEffect(() => {
    setDescription(election.description);
    setStartDate(
      election.startDate
        ? new Date(election.startDate).toISOString().slice(0, 16)
        : ""
    );
    setEndDate(
      election.endDate
        ? new Date(election.endDate).toISOString().slice(0, 16)
        : ""
    );
    if (election && election.candidates) {
      setSelectedCandidates(election.candidates);
    } else {
      setSelectedCandidates([]);
    }
    console.log("Select candidates:", selectedCandidates);
  }, [election]);

  // Fetch candidates excluding already selected ones
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
      const newCandidates = response.data.filter(
        (candidate) =>
          !selectedCandidates.some(
            (selected) => selected.candidateId === candidate.candidateId
          )
      );
      setCandidates(newCandidates.length > 0 ? newCandidates : []);
    };
    const timer = setTimeout(() => fetchCandidates(), 300);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCandidates]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const updatedElection = {
      electionId: election.electionId,
      description,
      startDate,
      endDate,
      candidates: selectedCandidates,
      location: election.location,
    };

    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:8080/elections`, updatedElection, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      showNotification("Election updated successfully", "success");
      fetchElections();
      closeModal();
    } catch (error) {
      console.error("Error updating election:", error);
      showNotification("Failed to update election", "error");
    }
  };

  const handleCandidateClick = (candidate) => {
    const isAlreadySelected = selectedCandidates.some(
      (c) => c.candidateId === candidate.candidateId
    );

    setSelectedCandidates(
      isAlreadySelected
        ? selectedCandidates.filter(
            (c) => c.candidateId !== candidate.candidateId
          )
        : [...selectedCandidates, candidate]
    );

    setSearchQuery("");
    setCandidates([]);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      {/* Modal content */}
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* More modal content */}
        <div
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <form onSubmit={handleSubmit}>
            {/* Form content */}
            <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              {/* Description, Candidate, and Dates inputs */}
              <div className="mt-4">
                {/* Description input */}
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
                <label className="block text-gray-700">
                  Selected Candidates:
                </label>
                <div className="flex flex-wrap">
                  {selectedCandidates.map((candidate) => (
                    <span
                      key={candidate.candidateId}
                      className="m-1 p-1 bg-blue-200 rounded"
                    >
                      {candidate.firstname} {candidate.lastname}
                      <button
                        type="button"
                        onClick={() => handleCandidateClick(candidate)}
                        className="ml-2 text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                {/* Candidate input */}
                <label htmlFor="candidate" className="block text-gray-700">
                  Candidate:
                </label>
                <input
                  type="text"
                  id="candidate"
                  name="candidate"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  required={selectedCandidates.length === 0}
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
                {/* Start Date input */}
                <label htmlFor="startDate" className="block text-gray-700">
                  Start Date:
                </label>
                <input
                  type="datetime-local"
                  id="startDate"
                  name="startDate"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                  required
                  className="form-input mt-1 block w-full"
                />
              </div>
              <div className="mt-4">
                {/* End Date input */}
                <label htmlFor="endDate" className="block text-gray-700">
                  End Date:
                </label>
                <input
                  type="datetime-local"
                  id="endDate"
                  name="endDate"
                  value={endDate}
                  onChange={(event) => setEndDate(event.target.value)}
                  required
                  className="form-input mt-1 block w-full"
                />
              </div>

              {/* Submit and Cancel buttons */}
              <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
                  <button
                    type="submit"
                    className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-green-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-green-500 focus:outline-none focus:border-green-700 focus:shadow-outline-green transition ease-in-out duration-150 sm:text-sm"
                  >
                    Save Election
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
  );
};

export default EditElectionModal;
