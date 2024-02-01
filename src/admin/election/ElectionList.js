import React, { useState, useEffect } from "react";
import axios from "axios";
import GenericTable from "../genericlistcomponents/GenericTable";
import GenericModal from "../genericlistcomponents/GenericModal";
import PageNavigation from "../genericlistcomponents/PageNavigation";
import NotificationBanner from "../genericlistcomponents/NotificationBanner";
import ActionBar from "../genericlistcomponents/ActionBar";
import EditElectionModal from "./EditElectionModal";
import AddElectionModal from "./AddElectionModal";
import { useNavigate } from "react-router";

const ElectionsList = () => {
  const [elections, setElections] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedElection, setSelectedElection] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  const navigate = useNavigate();
  const onAddClick = () => {
    setModalType("add");
    setIsModalOpen(true);
  };

  const onRowClick = (item) => {
    setSelectedElection(item);
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ ...notification, show: false }), 5000);
  };

  const isDatePast = (endDateString) => {
    const endDate = new Date(endDateString);
    const currentDate = new Date();
    return currentDate > endDate;
  };

const onEditClick = () => {
  if (selectedElection) {
    if (isDatePast(selectedElection.endDate)) {
      alert("Editing not allowed. This election has already ended.");
    } else {
      setModalType("edit");
      setIsModalOpen(true);
    }
  } else {
    alert("Please select an election to edit.");
  }
};

  const onDeleteClick = () => {
    if (selectedElection) {
      setModalType("delete");
      setIsModalOpen(true);
    } else {
      alert("Please select an election to delete.");
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    fetchElections();
  };
  

  const fields = [
    { label: "Description", key: "description" },
    { label: "Created at", key: "createdAt" },
    { label: "Start at", key: "startDate" },
    { label: "End at", key: "endDate" },
    {
      label: "Location",
      key: "locationDetails",
      render: (election) => {
        return election.locationDetails
          ? `${election.locationDetails.city}, ${election.locationDetails.street},${election.locationDetails.number}`
          : "N/A";
      },
    },
    {
      label: "Actions",
      key: "actions",
      render: (election) => (
        <button
          onClick={() => navigate(`/elections/${election.electionId}/details`)}
          className="text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Show Details
        </button>
      ),
    },
  ];

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchLocationDetails = async (locationId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `http://localhost:8080/locations/${locationId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching location:", error);
      return null;
    }
  };

  const fetchElections = async (page = 0, size = 10, searchQuery = "") => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `http://localhost:8080/elections?page=${page}&size=${size}&description=${searchQuery}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const electionsWithLocation = await Promise.all(
        response.data.content.map(async (election) => {
          const locationDetails = await fetchLocationDetails(
            election.locationId
          );
          return { ...election, locationDetails };
        })
      );

      setElections(electionsWithLocation);
      setTotalPages(response.data.totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching elections:", error);
      setElections([]);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalType(null);
    setSelectedElection(null);
  };

  const handleDeleteConfirm = async () => {
    if (selectedElection && selectedElection.electionId) {
      const token = localStorage.getItem("token");
      try {
        await axios.delete(
          `http://localhost:8080/elections/${selectedElection.electionId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        showNotification("Election deleted successfully", "success");
        fetchElections(currentPage, 10, searchQuery);
      } catch (error) {
        console.error("Error deleting election:", error);
        showNotification("Failed to delete election", "error");
      }
    } else {
      showNotification("No election selected for deletion", "error");
    }

    setIsModalOpen(false);
    setModalType(null);
    setSelectedElection(null);
    fetchElections();
  };

  const footerMap = {
    delete: (
      <>
        <button
          type="button"
          class="focus:outline-none text-white bg-red-700 hover:bg-red-800 
                    focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5
                     py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          onClick={handleDeleteConfirm}
        >
          Delete
        </button>
        <button
          type="button"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300
           font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700
            focus:outline-none dark:focus:ring-blue-800"
          onClick={handleModalClose}
        >
          Cancel
        </button>
      </>
    ),
  };

  return (
    <div className="flex flex-col justify-start items-center min-h-screen">
      {notification.show && (
        <NotificationBanner
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ ...notification, show: false })}
        />
      )}
      <div className="py-4 flex items-center">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Search by description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-l border px-2 py-1"
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 flex items-center justify-center bg-red-500 w-8 rounded-r focus:outline-none"
            >
              <span className="text-white">x</span>
            </button>
          )}
        </div>
        <button
          onClick={() => fetchElections(0, 10, searchQuery)}
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      <ActionBar
        onAddClick={onAddClick}
        onEditClick={onEditClick}
        onDeleteClick={onDeleteClick}
      />

      <GenericTable
        data={elections}
        onRowClick={onRowClick}
        selectedData={selectedElection}
        columns={fields}
        idField="electionId"
      />

      {isModalOpen && modalType === "add" && (
        <AddElectionModal
          isOpen={isModalOpen}
          closeModal={handleModalClose}
          showNotification={showNotification}
          fetchElections={fetchElections}
        />
      )}
      {isModalOpen && modalType === "edit" && (
        <EditElectionModal
          isOpen={isModalOpen}
          closeModal={handleModalClose}
          election={selectedElection}
          showNotification={showNotification}
          fetchElections={fetchElections}
        />
      )}
      {isModalOpen && modalType === "delete" && (
        <GenericModal
          isOpen={isModalOpen}
          closeModal={handleModalClose}
          title="Delete Election"
          footer={footerMap[modalType]}
        >
          <p>Are you sure you want to delete this election?</p>
        </GenericModal>
      )}
      <PageNavigation
        totalPages={totalPages}
        currentPage={currentPage}
        handlePageNavigation={(newPage) =>
          fetchElections(newPage, 10, searchQuery)
        }
      />
    </div>
  );
};

export default ElectionsList;
