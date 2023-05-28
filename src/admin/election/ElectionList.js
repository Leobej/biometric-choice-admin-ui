import React, { useState, useEffect } from "react";
import axios from "axios";
import ElectionForm from "./ElectionForm";
import ElectionTable from "./ElectionTable";
import PageNavigation from "./PageNavigation";
import EditElectionModal from "./EditElectionModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

const ElectionsList = () => {
  const [elections, setElections] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [selectedElection, setSelectedElection] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    console.log("Deleting item...");
    setIsDeleteModalOpen(false);
  };

  useEffect(() => {
    fetchElections();
  }, []);

  const resetForm = () => {
    setName("");
    setDescription("");
    setStartDate("");
    setEndDate("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const handleEdit = () => {
    if (selectedElection) {
      // Put your edit logic here
      console.log(`Editing election with ID: ${selectedElection.id}`);
    }
  };

  const handleDelete = () => {
    if (selectedElection) {
      <DeleteConfirmationModal></DeleteConfirmationModal>;
      console.log(`Deleting election with ID: ${selectedElection.id}`);
    }
  };

  const handleAdd = () => {
    setIsAddModalOpen(true);
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
  };

  const saveElection = () => {
    // Implement save election logic here
    closeModal();
  };

  const onDelete = () => {};

  const deleteElection = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.delete(
      `http://localhost:8080/elections/${selectedElection.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response);
  };

  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  const handleEditClick = (election) => {
    setSelectedElection(election);
    setIsEditModalOpen(true);
  };

  const fetchElections = async (page = 0, size = 10, searchQuery = '') => {
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
  

  const handlePageNavigation = (newPage) => {
    console.log(newPage);
    fetchElections(newPage, 10);
  };

  const handleRowClick = (election) => {
    console.log(election);
    setSelectedElection(election);
  };

  const renderPageNavigation = () => {
    const pages = [];
    for (let i = 0; i < totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageNavigation(i)}
          className={`${
            i === currentPage
              ? "bg-blue-500 text-white"
              : "bg-white text-blue-500"
          } border border-blue-500 px-4 py-2 mx-1 rounded`}
        >
          {i + 1}
        </button>
      );
    }

    return <div className="mt-4">{pages}</div>;
  };

  return (
    <div className="flex flex-col justify-between items-center min-h-screen">
      <div className="py-4">
        <input
          type="text"
          placeholder="Search by description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="rounded border px-2 py-1"
        />
        <button
          onClick={() => fetchElections(0, 10, searchQuery)}
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      <div className="flex justify-between w-full px-10 py-5 bg-blue-500 text-white">
        <button
          onClick={handleAdd}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Add
        </button>
        {selectedElection && (
          <>
            <button
              onClick={() => handleEditClick(selectedElection)}
              className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteClick(selectedElection)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Delete
            </button>
          </>
        )}
      </div>

      {isAddModalOpen && (
        <ElectionForm
          isAddModalOpen={isAddModalOpen}
          closeModal={closeModal}
          saveElection={saveElection}
          // pass other required props
        />
      )}

      {selectedElection && (
        <EditElectionModal
          isOpen={isEditModalOpen}
          closeModal={() => setIsEditModalOpen(false)}
          election={selectedElection}
          saveElection={saveElection}
        />
      )}
      <div className="flex-grow flex items-start">
        <ElectionTable
          elections={elections}
          handleRowClick={handleRowClick}
          selectedElection={selectedElection}
        />
      </div>

      {/* Render page navigation */}
      <PageNavigation
        totalPages={totalPages}
        currentPage={currentPage}
        handlePageNavigation={handlePageNavigation}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        closeModal={() => setIsDeleteModalOpen(false)}
        handleDelete={handleDeleteConfirm}
      />
    </div>
  );
};

export default ElectionsList;
