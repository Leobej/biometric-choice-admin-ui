import React, { useState, useEffect } from "react";
import axios from "axios";
import GenericTable from "../genericlistcomponents/GenericTable";
import GenericModal from "../genericlistcomponents/GenericModal";
import GenericForm from "../genericlistcomponents/GenericForm";
import PageNavigation from "./PageNavigation";
import ActionBar from "../genericlistcomponents/ActionBar";
import EditLocationModal from "./EditLocationModal";
import AddLocationModal from "./AddLocationModal";

const LocationsList = () => {
  const [locations, setLocations] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // 'add', 'edit', or 'delete'
  const [searchQuery, setSearchQuery] = useState("");

  const onAddClick = () => {
    setModalType("add");
    setIsModalOpen(true);
  };

  const onRowClick = (item) => {
    setSelectedLocation(item);
  };

  const onEditClick = () => {
    if (selectedLocation) {
      setModalType("edit");
      setIsModalOpen(true);
    } else {
      alert("Please select a location to edit.");
    }
  };

  const onDeleteClick = () => {
    if (selectedLocation) {
      setModalType("delete");
      setIsModalOpen(true);
    } else {
      alert("Please select a location to delete.");
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    fetchLocations();
  };

  const fields = [
    { label: "Name", key: "name" },
    { label: "Address", key: "address" },
    { label: "City", key: "city" },
  ];

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async (page = 0, size = 10, searchQuery = "") => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `http://localhost:8080/locations?page=${page}&size=${size}&name=${searchQuery}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.content.length > 0) {
      setLocations(response.data.content);
      setTotalPages(response.data.totalPages);
      setCurrentPage(page);
    } else {
      setLocations([]);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalType(null);
    setSelectedLocation(null);
  };

  const handleSave = async (values) => {
    handleModalClose();
    fetchLocations();
  };

  const handleDeleteConfirm = async () => {
    handleModalClose();
    fetchLocations();
  };

  const footerMap = {
    delete: (
      <>
        <button
          type="button"
          onClick={handleDeleteConfirm}
        >
          Delete
        </button>
        <button
          type="button"
          onClick={handleModalClose}
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
          onClick={() => fetchLocations(0, 10, searchQuery)}
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
        data={locations}
        onRowClick={onRowClick}
        selectedData={selectedLocation}
        columns={fields}
        idField="locationId"
      />

      {isModalOpen && modalType === "add" && (
        <AddLocationModal
          isOpen={isModalOpen}
          closeModal={handleModalClose}
        />
      )}
      {isModalOpen && modalType === "edit" && (
        <EditLocationModal
          isOpen={isModalOpen}
          closeModal={handleModalClose}
          location={selectedLocation}
          saveLocation={handleSave}
        />
      )}
      {isModalOpen && modalType !== "add" && modalType !== "edit" && (
        <GenericModal
          isOpen={isModalOpen}
          closeModal={handleModalClose}
          title={`${modalType.charAt(0).toUpperCase() + modalType.slice(1)} Location`}
          footer={footerMap[modalType]}
        >
          {modalType === "delete" ? (
            <p>Are you sure you want to delete this location?</p>
          ) : (
            <GenericForm
              initialValues={modalType === "edit" ? selectedLocation : {}}
              onSubmit={handleSave}
              fields={fields.map((field) => ({ ...field, type: field.type || "text" }))}
              id="generic-form"
            />
          )}
        </GenericModal>
      )}

      <PageNavigation
        totalPages={totalPages}
        currentPage={currentPage}
        handlePageNavigation={(newPage) => fetchLocations(newPage, 10)}
      />
    </div>
  );
};

export default LocationsList;
