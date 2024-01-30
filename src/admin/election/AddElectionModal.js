import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import Select from "react-select";

const AddElectionModal = ({
  isOpen,
  closeModal,
  showNotification,
  fetchElections,
}) => {
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [locations, setLocations] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [devices, setDevices] = useState([]);
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [selectAll, setSelectAll] = useState(false); // New state for tracking select all

  const navigate = useNavigate();
  const [deviceOptions, setDeviceOptions] = useState([]); // Options for react-select

  const handleSelectAllDevices = () => {
    const allDeviceIds = deviceOptions.map((option) => option.value);
    setSelectedDevices(allDeviceIds);
    setSelectAll(true);
  };

  // Function to handle deselecting all devices
  const handleDeselectAllDevices = () => {
    setSelectedDevices([]);
    setSelectAll(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const candidateIds = selectedCandidates.map((c) => ({
        candidateId: c.candidateId,
      }));

      const electionData = {
        description,
        locationId: location,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        active: true,
        candidates: candidateIds, // Include candidate IDs in the request
      };

      const electionResponse = await axios.post(
        "http://localhost:8080/elections",
        electionData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (electionResponse.status === 201 || electionResponse.status === 200) {
        showNotification("Election created successfully!", "success");
        resetForm(); // Reset the form fields
        closeModal(); // Close the modal
        // Optionally, you can also call a function to refresh the list of elections here if it's available in the parent component
      } else {
        // Handle non-successful responses
        showNotification("Failed to create election", "error");
      }
      const electionId = electionResponse.data.electionId; // Get the newly created election ID

      const deviceAssociationsPromises = selectedDevices.map((deviceId) =>
        axios.post(
          `http://localhost:8080/election-devices/add`,
          {
            electionId: electionId, // Make sure the names match the DTO fields
            deviceId: deviceId,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
      );
      fetchElections();
    } catch (error) {
      console.error("Failed to create election:", error);
      showNotification("Error creating election. Please try again.", "error");
    }
  };

  useEffect(() => {
    const fetchLocations = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`http://localhost:8080/locations`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched locations:", response.data); // Log the response
        setLocations(response.data.content); // Assuming response.data is an array of locations
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    if (isOpen) {
      fetchLocations();
    }
  }, [isOpen]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchDevices = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`http://localhost:8080/devices`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched devices:", response.data);
        const options = response.data.content.map((device) => ({
          value: device.id,
          label: `${device.name} (${device.type})`,
        }));
        setDeviceOptions(options);
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    };

    if (isOpen) {
      fetchDevices();
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchCandidates = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`http://localhost:8080/candidates`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched candidates:", response.data.content); 

        if (response.data && Array.isArray(response.data.content)) {
          setCandidates(response.data.content);
          console.log("Setted Candidates: ", candidates);
        } else {
          console.error(
            "Expected an array for candidates in 'content', received:",
            response.data
          );
          setCandidates([]); 
        }
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };

    fetchCandidates();
  }, []);

  const resetForm = () => {
    setDescription("");
    setStartDate("");
    setEndDate("");
    setLocation("");
    setSelectedDevices([]);
  };

  const toggleSelectAll = () => {
    setIsAllSelected((currentIsAllSelected) => {
      const newSelectedDevices = !currentIsAllSelected
        ? deviceOptions.map((option) => option.value)
        : [];
      setSelectedDevices(newSelectedDevices);
      return !currentIsAllSelected; 
    });
  };

  const handleCandidateClick = (candidate) => {
    setSelectedCandidates((prevSelected) => [...prevSelected, candidate]);
    setCandidates((prevCandidates) =>
      prevCandidates.filter((c) => c.candidateId !== candidate.candidateId)
    );
  };

  const handleRemoveCandidate = (candidateToRemove) => {
    setSelectedCandidates((prevSelected) =>
      prevSelected.filter(
        (candidate) => candidate.candidateId !== candidateToRemove.candidateId
      )
    );
    setCandidates((prevCandidates) => [...prevCandidates, candidateToRemove]);
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
              <div className="mt-4 px-4 pt-5 pb-4 sm:p-6 sm:pb-4 overflow-auto max-h-[80vh]">
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
                  <label className="block text-gray-700">
                    Selected Candidates:
                  </label>
                  <div className="flex flex-wrap space-x-2 space-y-2 max-h-40 overflow-auto">
                    <div className="flex flex-wrap">
                      {selectedCandidates.map((candidate) => (
                        <span
                          key={candidate.candidateId}
                          className="m-1 p-1 bg-blue-200 rounded"
                        >
                          {candidate.firstname} {candidate.lastname}
                          <button
                            type="button"
                            onClick={() => handleRemoveCandidate(candidate)}
                            className="ml-2 text-red-500"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
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
                    className="form-input mt-1 block w-full"
                    placeholder="Search for a candidate"
                  />

                  <ul
                    className="candidate-list mt-2 overflow-y-auto"
                    style={{ maxHeight: "150px" }}
                  >
                    {candidates.map(
                      (candidate) => (
                        console.log("Candidates trying to map: ", candidates),
                        (
                          <li
                            key={candidate.candidateId}
                            onClick={() => handleCandidateClick(candidate)}
                            className="cursor-pointer hover:bg-gray-200 px-3 py-1"
                          >
                            {candidate.firstname} {candidate.lastname}
                          </li>
                        )
                      )
                    )}
                  </ul>
                </div>
                <div className="mt-4">
                  <label className="block text-gray-700">Devices:</label>
                  <div className="flex items-center mb-6">
                    <button
                      type="button"
                      class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100
                   focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white
                    dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                      onClick={toggleSelectAll}
                    >
                      {isAllSelected ? "Deselect All" : "Select All"}
                    </button>
                  </div>
                  <div className="relative">
                    <Select
                      options={deviceOptions}
                      isMulti
                      value={deviceOptions.filter((option) =>
                        selectedDevices.includes(option.value)
                      )}
                      onChange={(selectedOptions) => {
                        const deviceIds = selectedOptions.map(
                          (option) => option.value
                        );
                        setSelectedDevices(deviceIds);
                        setSelectAll(deviceIds.length === deviceOptions.length);
                      }}
                      className="basic-multi-select h-40 overflow-auto"
                      classNamePrefix="select" 
                    />
                    <div className="absolute top-0 right-0 h-10 w-10 bg-white" />
                  </div>
                </div>
                <div className="mt-4">
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
                <div className="mt-4">
                  <label htmlFor="location" className="block text-gray-700">
                    Location:
                  </label>
                  <select
                    id="location"
                    name="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    className="form-select mt-1 block w-full"
                  >
                    <option value="">Select a location</option>
                    {locations.map((loc) => (
                      <option key={loc.locationId} value={loc.locationId}>
                        {loc.city}, {loc.street}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-green-500 text-white active:bg-green-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                    type="submit"
                  >
                    Create Election
                  </button>
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
