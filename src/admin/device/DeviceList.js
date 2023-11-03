import React, { useState, useEffect } from "react";
import axios from "axios";
import GenericTable from "../genericlistcomponents/GenericTable";
import GenericModal from "../genericlistcomponents/GenericModal";
import GenericForm from "../genericlistcomponents/GenericForm";
import PageNavigation from "./PageNavigation";
import ActionBar from "../genericlistcomponents/ActionBar";

const DevicesList = () => {
  const [devices, setDevices] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // 'add', 'edit', or 'delete'
  const [searchQuery, setSearchQuery] = useState("");

  const onAddClick = () => {
    setModalType("add");
    setIsModalOpen(true);
  };

  const onRowClick = (item) => {
    console.log("Row clicked:", item);
    setSelectedDevice(item);
  };

  const onEditClick = () => {
    console.log("Edit clicked, selected device:", selectedDevice);
    if (selectedDevice) {
      setModalType("edit");
      setIsModalOpen(true);
    } else {
      alert("Please select a device to edit.");
    }
  };

  const onDeleteClick = () => {
    if (selectedDevice) {
      setModalType("delete");
      setIsModalOpen(true);
    } else {
      alert("Please select a device to delete.");
    }
  };

  const fields = [
    { label: "Device Name", key: "name" },
    { label: "Device Type", key: "type" },
    { label: "Device Status", key: "status" },
    // ...other fields
  ];

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async (page = 0, size = 10, searchQuery = "") => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `http://localhost:8080/devices?page=${page}&size=${size}&query=${searchQuery}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.content.length > 0) {
      setDevices(response.data.content);
      setTotalPages(response.data.totalPages);
      setCurrentPage(page);
    } else {
      setDevices([]);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalType(null);
    setSelectedDevice(null);
  };

  const handleSave = async (values) => {
    // Save device logic...
    handleModalClose();
    fetchDevices();
  };

  const handleDeleteConfirm = async () => {
    // Delete device logic...
    handleModalClose();
    fetchDevices();
  };

  const handleClearSearch = () => {
    setSearchQuery(""); // Reset the search query
    fetchDevices(); // Fetch the initial list of devices
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
            placeholder="Search by name, type, or any other field..."
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
          onClick={() => fetchDevices(0, 10, searchQuery)}
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
        data={devices}
        onRowClick={onRowClick}
        selectedData={selectedDevice}
        columns={fields}
        idField="deviceId"
      />

      {isModalOpen && (
        <GenericModal
          isOpen={isModalOpen}
          closeModal={handleModalClose}
          title={`${modalType.charAt(0).toUpperCase() + modalType.slice(1)} Device`}
          footer={footerMap[modalType]}
        >
          {modalType === "delete" ? (
            <p>Are you sure you want to delete this device?</p>
          ) : (
            <GenericForm
              initialValues={modalType === "edit" ? selectedDevice : {}}
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
        handlePageNavigation={(newPage) => fetchDevices(newPage, 10)}
      />
    </div>
  );
};

export default DevicesList;
