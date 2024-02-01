import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
const EditElectionModal = ({
  isOpen,
  closeModal,
  election,
  showNotification,
  fetchElections,
}) => {
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [location, setLocation] = useState("");
  const [locations, setLocations] = useState([]);
  const [endDate, setEndDate] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [devices, setDevices] = useState([]);
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedCandidates, setSelectedCandidates] = useState(
    election.candidates || []
  );
  const [deviceOptions, setDeviceOptions] = useState([]);

  console.log(election);

  const toggleSelectAll = () => {
    setIsAllSelected((currentIsAllSelected) => {
      const newSelectedDevices = !currentIsAllSelected
        ? deviceOptions.map((option) => option.value)
        : [];
      setSelectedDevices(newSelectedDevices);
      return !currentIsAllSelected;
    });
  };

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
    setLocation(election.locationId);
    if (election && election.candidates) {
      setSelectedCandidates(election.candidates);
    } else {
      setSelectedCandidates([]);
    }
    console.log("Select candidates:", selectedCandidates);
  }, [election]);

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
      locationId: location,
      active:true
    };

    try {
      console.log("Updated election:", updatedElection);
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:8080/elections`, updatedElection, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Updated election devices:");
      console.log(selectedDevices);

      await axios.put(
        `http://localhost:8080/election-devices/edit/${election.electionId}`,
        selectedDevices, // Directly sending the array
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      showNotification("Election updated successfully", "success");
      fetchElections();
      closeModal();
    } catch (error) {
      console.error("Error updating election:", error);
      showNotification("Failed to update election", "error");
    }
  };

  useEffect(() => {
    const fetchLocations = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`http://localhost:8080/locations`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched locations:", response.data);
        setLocations(response.data.content);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    const fetchElectionDevices = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `http://localhost:8080/election-devices/election/${election.electionId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Fetched election devices:", response.data);
        // Assuming the response contains an array of devices
        setSelectedDevices(response.data.map((device) => device.id));
      } catch (error) {
        console.error("Error fetching election devices:", error);
      }
    };

    if (isOpen) {
    
      fetchElectionDevices();
      fetchLocations();
    }
  }, [isOpen, election.electionId]);

  useEffect(() => {
    setDeviceOptions(
      devices.map((device) => ({
        value: device.id,
        label: `${device.name} (${device.type})`,
      }))
    );
  }, [devices]);

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
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <form onSubmit={handleSubmit}>
            <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
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
