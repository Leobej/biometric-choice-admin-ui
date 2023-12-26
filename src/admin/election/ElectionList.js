import React, { useState, useEffect } from "react";
import axios from "axios";
import GenericTable from "../genericlistcomponents/GenericTable";
import GenericModal from "../genericlistcomponents/GenericModal";
import GenericForm from "../genericlistcomponents/GenericForm";
import PageNavigation from "../genericlistcomponents/PageNavigation";

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
  const [modalType, setModalType] = useState(null); // 'add', 'edit', or 'delete'
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const onAddClick = () => {
    setModalType("add");
    setIsModalOpen(true);
  };

  const onRowClick = (item) => {
    setSelectedElection(item);
  };

  const onEditClick = () => {
    if (selectedElection) {
      setModalType("edit");
      setIsModalOpen(true);
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
    { label: "Location", key: "location" },
    {
      label: 'Actions',
      key: 'actions',
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

  const fetchElections = async (page = 0, size = 10, searchQuery = "") => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `http://localhost:8080/elections?page=${page}&size=${size}&description=${searchQuery}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.content.length > 0) {
      setElections(response.data.content);
      setTotalPages(response.data.totalPages);
      setCurrentPage(page);
    } else {
      setElections([]);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalType(null);
    setSelectedElection(null);
  };

  const handleSave = async (values) => {
    handleModalClose();
    fetchElections();
  };

  const handleDeleteConfirm = async () => {
    handleModalClose();
    fetchElections();
  };

  const footerMap = {
    delete: (
      <>
        <button
          type="button"
          onClick={handleDeleteConfirm} /* ...other attributes */
        >
          Delete
        </button>
        <button
          type="button"
          onClick={handleModalClose} /* ...other attributes */
        >
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
        <AddElectionModal isOpen={isModalOpen} closeModal={handleModalClose} />
      )}
      {isModalOpen && modalType === "edit" && (
        <EditElectionModal
          isOpen={isModalOpen}
          closeModal={handleModalClose}
          election={selectedElection}
          saveElection={handleSave}
        />
      )}
      {isModalOpen && modalType !== "add" && modalType !== "edit" && (
        <GenericModal
          isOpen={isModalOpen}
          closeModal={handleModalClose}
          title={`${
            modalType.charAt(0).toUpperCase() + modalType.slice(1)
          } Election`}
          footer={footerMap[modalType]}
        >
          {modalType === "delete" ? (
            <p>Are you sure you want to delete this election?</p>
          ) : (
            <GenericForm
              initialValues={modalType === "edit" ? selectedElection : {}}
              onSubmit={handleSave}
              fields={fields.map((field) => ({
                ...field,
                type: field.type || "text",
              }))}
              id="generic-form"
            />
          )}
        </GenericModal>
      )}

      <PageNavigation
        totalPages={totalPages}
        currentPage={currentPage}
        handlePageNavigation={(newPage) => fetchElections(newPage, 10)}
      />
    </div>
  );
};

export default ElectionsList;
