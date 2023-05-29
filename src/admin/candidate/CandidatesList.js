import React, { useState, useEffect } from "react";
import axios from "axios";
import CandidateForm from "./CandidateForm";
import CandidateTable from "./CandidateTable.js";
import PageNavigation from "./PageNavigation";
import EditCandidateModal from "./EditCandidateModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

const CandidatesList = () => {
  const [candidates, setCandidates] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const handleDeleteClick = (candidate) => {
    setSelectedCandidate(candidate);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    // Deleting candidate logic...
    setIsDeleteModalOpen(false);
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    // submit form logic...
  };

  const handleEdit = (candidate) => {
    setSelectedCandidate(candidate);
    setIsEditModalOpen(true); 
  };

  const handleDelete = (candidate) => {
    // Delete candidate logic...
  };

  const handleAdd = () => {
    setIsAddModalOpen(true);
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
  };

  const saveCandidate = (candidate) => {
    // Save candidate logic...
    closeModal();
  };

  const fetchCandidates = async (page = 0, size = 10, searchQuery = '') => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `http://localhost:8080/candidates?page=${page}&size=${size}&query=${searchQuery}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  
    if (response.data.content.length > 0) {
      setCandidates(response.data.content);
      setTotalPages(response.data.totalPages);
      setCurrentPage(page);
    } else {
      setCandidates([]);
    }
  };
  

  const handlePageNavigation = (newPage) => {
    fetchCandidates(newPage, 10);
  };

  const handleRowClick = (candidate) => {
    setSelectedCandidate(candidate);
  };

  return (
    <div className="flex flex-col justify-between items-center min-h-screen">
      <div className="py-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="rounded border px-2 py-1"
        />
        <button
          onClick={() => fetchCandidates(0, 10, searchQuery)}
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      <div className="flex justify-between w-full px-10 py-1 bg-blue-500 text-white">
        <button
          onClick={handleAdd}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Add
        </button>
        {selectedCandidate && (
          <>
            <button
              onClick={() => handleEdit(selectedCandidate)}
              className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteClick(selectedCandidate)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Delete
            </button>
          </>
        )}
      </div>

      {isAddModalOpen && (
        <CandidateForm
          isAddModalOpen={isAddModalOpen}
          closeModal={closeModal}
          saveCandidate={saveCandidate}
        />
      )}

      {selectedCandidate && (
        <EditCandidateModal
          isOpen={isEditModalOpen}
          closeModal={() => setIsEditModalOpen(false)}
          candidate={selectedCandidate}
          saveCandidate={saveCandidate}
        />
      )}

      <CandidateTable
        candidates={candidates}
        handleRowClick={handleRowClick}
        selectedCandidate={selectedCandidate}
      />

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

export default CandidatesList;
