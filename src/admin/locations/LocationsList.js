import React, { useState, useEffect } from "react";
import axios from "axios";
import GenericTable from "../genericlistcomponents/GenericTable";
import GenericModal from "../genericlistcomponents/GenericModal";
import GenericForm from "../genericlistcomponents/GenericForm";
import PageNavigation from "../genericlistcomponents/PageNavigation";
import ActionBar from "../genericlistcomponents/ActionBar";
import EditLocationModal from "./EditLocationModal";
import AddLocationModal from "./AddLocationModal";
import NotificationBanner from "../genericlistcomponents/NotificationBanner";
const LocationsList = () => {
  const [locations, setLocations] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // 'add', 'edit', or 'delete'
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

  const onRowClick = (item) => {
    console.log("Row clicked:", item);
    setSelectedLocation(item);
  };

  const onAddClick = () => {
    setModalType("add");
    setIsModalOpen(true);
  };

  const onEditClick = () => {
    // Existing code...
    if (selectedLocation) {
      setModalType("edit");
      setIsModalOpen(true);
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
    { label: "City", key: "city" },
    { label: "Postal Code", key: "postalCode" },
    { label: "Country", key: "country" },
    { label: "Street", key: "street" },
    { label: "Number", key: "number" },
  ];

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async (page = 0, size = 10, searchQuery = "") => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `http://localhost:8080/locations?page=${page}&size=${size}&searchTerm=${searchQuery}`,
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
            placeholder="Search..."
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
          refreshLocations={fetchLocations}
          showNotification={showNotification}
        />
      )}
      {isModalOpen && modalType === "edit" && (
        <EditLocationModal
          isOpen={isModalOpen}
          closeModal={handleModalClose}
          location={selectedLocation}
          saveLocation={handleSave}
          refreshLocations={fetchLocations}
          showNotification={showNotification}
        />
      )}
      {isModalOpen && modalType === "delete" && (
        <GenericModal
          isOpen={isModalOpen}
          closeModal={handleModalClose}
          footer={footerMap[modalType]}
        >
          <h1 className="text-2xl font-bold">Delete Location</h1>
          <p>Are you sure you want to delete this location?</p>
        </GenericModal>
      )}

      <PageNavigation
        totalPages={totalPages}
        currentPage={currentPage}
        handlePageNavigation={(newPage) =>
          fetchLocations(newPage, 10, searchQuery)
        }
      />
    </div>
  );
};

export default LocationsList;
