import React, { useState, useEffect } from "react";
import axios from "axios";
import GenericTable from "../genericlistcomponents/GenericTable";
import GenericModal from "../genericlistcomponents/GenericModal";
import GenericForm from "../genericlistcomponents/GenericForm";
import PageNavigation from "../genericlistcomponents/PageNavigation";
import ActionBar from "../genericlistcomponents/ActionBar";
import EditCandidateModal from "./EditCandidateModal";
import AddCandidateModal from "./AddCandidateModal";

const CandidatesList = () => {
  const [candidates, setCandidates] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // 'add', 'edit', or 'delete'
  const [searchQuery, setSearchQuery] = useState("");

  const onAddClick = () => {
    setModalType("add");
    setIsModalOpen(true);
  };

  const onRowClick = (item) => {
    console.log("Row clicked:", item);
    setSelectedCandidate(item);
  };

  const onEditClick = () => {
    console.log("Edit clicked, selected candidate:", selectedCandidate);
    if (selectedCandidate) {
      setModalType("edit");
      setIsModalOpen(true);
    } else {
      alert("Please select a candidate to edit.");
    }
  };

  const onDeleteClick = () => {
    if (selectedCandidate) {
      setModalType("delete");
      setIsModalOpen(true);
    } else {
      alert("Please select a candidate to delete.");
    }
  };

  const fields = [
    { label: "First Name", key: "firstname" },
    { label: "Last Name", key: "lastname" },
    { label: "Party", key: "party" },
    { label: "Position", key: "position" },
    { label: "Description", key: "description" },
  ];

  useEffect(() => {
    fetchCandidates();
  }, [searchQuery]);

  const fetchCandidates = async (page = 0, size = 10, searchQuery = "") => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `http://localhost:8080/candidates?page=${page}&size=${size}&firstname=${encodeURIComponent(
        searchQuery
      )}&lastname=${encodeURIComponent(searchQuery)}`,

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(searchQuery);
    if (response.data.content.length > 0) {
      console.log(response.data.content);
      setCandidates(response.data.content);
      setTotalPages(response.data.totalPages);
      setCurrentPage(page);
    } else {
      setCandidates([]);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalType(null);
    setSelectedCandidate(null);
  };

  const handleSave = async (candidate) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      let response;
      if (modalType === "add") {
        // Logic for adding a new candidate
        const formData = new FormData();
        // Add candidate fields to formData
        formData.append("firstName", candidate.firstName);
        formData.append("lastName", candidate.lastName);
        formData.append("party", candidate.party);
        formData.append("position", candidate.position);
        // Add image if it exists
        if (candidate.image) {
          formData.append("image", candidate.image);
        }
        response = await axios.post(
          "http://localhost:8080/candidates",
          formData,
          config
        );
      } else if (modalType === "edit") {
        // Logic for editing an existing candidate
        response = await axios.put(
          `http://localhost:8080/candidates/${candidate.candidateId}`,
          candidate,
          config
        );
      }

      if (response.status === 200 || response.status === 201) {
        alert("Candidate saved successfully!");
        handleModalClose();
        fetchCandidates(currentPage, 10, searchQuery);
      } else {
        alert("Failed to save candidate.");
      }
    } catch (error) {
      console.error("Error saving candidate:", error);
      alert("Error saving candidate. Please try again.");
    }
  };

  const handleDeleteConfirm = async () => {
    // Delete candidate logic...
    handleModalClose();
    fetchCandidates();
  };

  const handleClearSearch = () => {
    setSearchQuery(""); // Reset the search query
    fetchCandidates(); // Fetch the initial list of candidates
  };

  const footerMap = {
    add: (
      <>
        <button type="submit" form="generic-form" /* ...other attributes */>
          Save
        </button>
        <button
          type="button"
          onClick={handleModalClose} /* ...other attributes */
        >
          Cancel
        </button>
      </>
    ),
    edit: (
      <>
        <button type="submit" form="generic-form" /* ...other attributes */>
          Save
        </button>
        <button
          type="button"
          onClick={handleModalClose} /* ...other attributes */
        >
          Cancel
        </button>
      </>
    ),
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
            placeholder="Search by name, party, or any other field..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-l border px-2 py-1"
          />
          {searchQuery && ( // Only show the clear button if there's a search query
            <button
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 flex items-center justify-center bg-red-500 w-8 rounded-r focus:outline-none"
            >
              <span className="text-white">x</span>
            </button>
          )}
        </div>
        <button
          onClick={() => fetchCandidates(0, 10, searchQuery)}
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
        data={candidates}
        onRowClick={onRowClick}
        selectedData={selectedCandidate}
        columns={fields}
        idField="candidateId"
      />

      {isModalOpen &&
        (modalType === "edit" ? (
          <EditCandidateModal
            isOpen={isModalOpen}
            closeModal={handleModalClose}
            candidate={selectedCandidate}
            saveCandidate={handleSave}
          />
        ) : modalType === "add" ? (
          <AddCandidateModal
            isOpen={isModalOpen}
            closeModal={handleModalClose}
            saveCandidate={handleSave}
          />
        ) : (
          <GenericModal
            isOpen={isModalOpen}
            closeModal={handleModalClose}
            title={`${
              modalType.charAt(0).toUpperCase() + modalType.slice(1)
            } Candidate`}
            footer={footerMap[modalType]}
          >
            {modalType === "delete" ? (
              <p>Are you sure you want to delete this candidate?</p>
            ) : (
              <GenericForm
                initialValues={modalType === "edit" ? selectedCandidate : {}}
                onSubmit={handleSave}
                fields={fields.map((field) => ({
                  ...field,
                  type: field.type || "text",
                }))}
                id="generic-form"
              />
            )}
          </GenericModal>
        ))}
      <PageNavigation
        totalPages={totalPages}
        currentPage={currentPage}
        handlePageNavigation={(newPage) => fetchCandidates(newPage, 10)}
      />
    </div>
  );
};

export default CandidatesList;
