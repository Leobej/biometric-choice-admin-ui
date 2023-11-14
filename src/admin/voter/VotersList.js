import React, { useState, useEffect } from "react";
import axios from "axios";
import PageNavigation from "../genericlistcomponents/PageNavigation";
import EditVoterModal from "./EditVoterModal";
import GenericTable from "../genericlistcomponents/GenericTable";
import GenericModal from "../genericlistcomponents/GenericModal";
import ActionBar from "../genericlistcomponents/ActionBar";
import AddVoterModal from "./AddVoterModal";
const VotersList = () => {
  const [voters, setVoters] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedVoter, setSelectedVoter] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // 'add', 'edit', or 'delete'
  const [searchQuery, setSearchQuery] = useState("");

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
    { label: "Voter Id", key: "voterId" },
    { label: "Created At", key: "createdAt" },
    { label: "fingerprint", key: "fingerprintId" },
  ];

  useEffect(() => {
    fetchVoters();
  }, []);

  const fetchVoters = async (page = 0, size = 10, searchQuery = "") => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `http://localhost:8080/voters?page=${page}&size=${size}&query=${searchQuery}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.content.length > 0) {
      setVoters(response.data.content);
      setTotalPages(response.data.totalPages);
      setCurrentPage(page);
    } else {
      setVoters([]);
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
    // Delete voter logic...
    handleModalClose();
    fetchVoters();
  };

  const handleClearSearch = () => {
    setSearchQuery(""); // Reset the search query
    fetchVoters(); // Fetch the initial list of voters
  };

  const footerMap = {
    add: (
      <>
        <button type="submit" form="generic-form">
          Save
        </button>
        <button type="button" onClick={handleModalClose}>
          Cancel
        </button>
      </>
    ),
    edit: (
      <>
        <button type="submit" form="generic-form">
          Save
        </button>
        <button type="button" onClick={handleModalClose}>
          Cancel
        </button>
      </>
    ),
    delete: (
      <>
        <button type="button" onClick={handleDeleteConfirm}>
          Delete
        </button>
        <button type="button" onClick={handleModalClose}>
          Cancel
        </button>
      </>
    ),
  };

  return (
    <div className="flex flex-col justify-start items-center min-h-screen">
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

{isModalOpen && (
        modalType === 'edit' ? (
          <EditVoterModal
            isOpen={isModalOpen}
            closeModal={handleModalClose}
            voter={selectedVoter}
            saveVoter={handleSave}
          />
        ) : modalType === 'add' ? (   // Check if modalType is 'add'
          <AddVoterModal   // Render the AddVoterModal when modalType is 'add'
            isOpen={isModalOpen}
            closeModal={handleModalClose}
          />
        ) : (
          <GenericModal
            isOpen={isModalOpen}
            closeModal={handleModalClose}
            title={`${modalType.charAt(0).toUpperCase() + modalType.slice(1)} Voter`}
            footer={footerMap[modalType]}
          >
            {/* ... rest of your code ... */}
          </GenericModal>
        )
      )}

      <PageNavigation
        totalPages={totalPages}
        currentPage={currentPage}
        handlePageNavigation={(newPage) => fetchVoters(newPage, 10)}
      />
    </div>
  );
};

export default VotersList;
