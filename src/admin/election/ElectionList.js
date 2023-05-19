import React, { useState, useEffect } from "react";
import axios from "axios";
import ElectionForm from "./ElectionForm";
import ElectionTable from "./ElectionTable";
import PageNavigation from "./PageNavigation";
import EditElectionModal from "./EditElectionModal";
const ElectionsList = () => {
  const [elections, setElections] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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

  useEffect(() => {
    fetchElections();
  }, []);

  // useEffect(() => {
  //   const fetchCandidates = async () => {
  //     const token = localStorage.getItem("token");
  //     const response = await axios.get(
  //       `http://localhost:8080/candidates/searchName?query=${searchQuery}`,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     if (response.data.length > 0) {
  //       setCandidates(response.data);
  //       console.log(candidates);
  //     } else {
  //       setCandidates([]);
  //     }
  //   };

  //   const timer = setTimeout(() => {
  //     fetchCandidates();
  //   }, 300);

  //   return () => clearTimeout(timer);
  // }, [searchQuery]);

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
      // Put your delete logic here
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

  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  const handleEditClick = (election) => {
    setSelectedElection(election);
    setIsEditModalOpen(true);
  };

  const fetchElections = async (page = 0, size = 10) => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `http://localhost:8080/elections?page=${page}&size=${size}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response);

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
              onClick={handleDelete}
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
    </div>
  );
};

export default ElectionsList;
