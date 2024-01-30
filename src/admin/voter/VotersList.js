import React, { useState, useEffect } from "react";
import axios from "axios";
import PageNavigation from "../genericlistcomponents/PageNavigation";
import EditVoterModal from "./EditVoterModal";
import GenericTable from "../genericlistcomponents/GenericTable";
import GenericModal from "../genericlistcomponents/GenericModal";
import ActionBar from "../genericlistcomponents/ActionBar";
import AddVoterModal from "./AddVoterModal";
import NotificationBanner from "../genericlistcomponents/NotificationBanner";

const VotersList = () => {
  const [voters, setVoters] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedVoter, setSelectedVoter] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ ...notification, show: false }), 5000);
  };

  const onAddClick = () => {
    setModalType("add");
    setIsModalOpen(true);
  };

  const onRowClick = (item) => {
    setSelectedVoter(item);
  };

  const onEditClick = () => {
    if (selectedVoter) {
      setModalType("edit");
      setIsModalOpen(true);
    } else {
      alert("Please select a voter to edit.");
    }
  };

  const onDeleteClick = () => {
    if (selectedVoter) {
      setModalType("delete");
      setIsModalOpen(true);
    } else {
      alert("Please select a voter to delete.");
    }
  };

  const fields = [
    { label: "First Name", key: "firstname" },
    { label: "Last Name", key: "lastname" },
    { label: "Birthdate", key: "birthdate" },
    { label: "CNP", key: "cnp" },
    { label: "fingerprint", key: "fingerprintId" },
  ];

  useEffect(() => {
    fetchVoters(currentPage, 10, searchQuery);
  }, []);

  const fetchVoters = async (page = 0, size = 10, searchQuery = "") => {
    const token = localStorage.getItem("token");
    let url = new URL(`http://localhost:8080/voters`);
    let params = { page: page, size: size };
    if (searchQuery) {
      params["search"] = searchQuery;
    }
    url.search = new URLSearchParams(params).toString();

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Response:", response);
      if (response.status === 200) {
        setVoters(response.data.content);
        setTotalPages(response.data.totalPages);
        setCurrentPage(page);
      } else {
        setVoters([]);
        setTotalPages(0);
      }
    } catch (error) {
      console.error("Error fetching voters:", error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalType(null);
    setSelectedVoter(null);
  };

  const handleSave = async (values) => {
    // Save voter logic...
    handleModalClose();
    fetchVoters();
  };

  const handleDeleteConfirm = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(
        `http://localhost:8080/voters/${selectedVoter.voterId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showNotification("Voter deleted successfully", "success");
      fetchVoters(currentPage, 10, searchQuery);
    } catch (error) {
      console.error("Error deleting voter:", error);
      showNotification("Failed to delete voter", "error");
    }
    handleModalClose();
  };

  const handleClearSearch = () => {
    setSearchQuery(""); 
    fetchVoters(); 
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
            placeholder="Search by name..."
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
          onClick={() => fetchVoters(0, 10, searchQuery)}
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
        data={voters}
        onRowClick={onRowClick}
        selectedData={selectedVoter}
        columns={fields}
        idField="voterId"
      />

      {isModalOpen &&
        (modalType === "edit" ? (
          <EditVoterModal
            isOpen={isModalOpen}
            closeModal={handleModalClose}
            voter={selectedVoter}
            refreshVoters={fetchVoters}
            showNotification={showNotification} 
          />
        ) : modalType === "add" ? ( 
          <AddVoterModal
            isOpen={isModalOpen}
            refreshVoters={fetchVoters}
            closeModal={handleModalClose}
            showNotification={showNotification} 
          />
        ) : (
          <GenericModal
            isOpen={isModalOpen}
            closeModal={handleModalClose}
            title={`${
              modalType.charAt(0).toUpperCase() + modalType.slice(1)
            } Voter`}
            footer={footerMap[modalType]}
          >
            <p>Are you sure you want to {modalType} this voter?</p>
          </GenericModal>
        ))}

      <PageNavigation
        totalPages={totalPages}
        currentPage={currentPage}
        handlePageNavigation={(newPage) =>
          fetchVoters(newPage, 10, searchQuery)
        }
      />
    </div>
  );
};

export default VotersList;
