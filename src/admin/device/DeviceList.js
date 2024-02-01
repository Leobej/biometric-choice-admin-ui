import React, { useState, useEffect } from "react";
import axios from "axios";
import GenericTable from "../genericlistcomponents/GenericTable";
import GenericModal from "../genericlistcomponents/GenericModal";
import PageNavigation from "../genericlistcomponents/PageNavigation";
import ActionBar from "../genericlistcomponents/ActionBar";
import EditDeviceModal from "./EditDeviceModal";
import AddDeviceModal from "./AddDeviceModal";
import NotificationBanner from "../genericlistcomponents/NotificationBanner";

const DevicesList = () => {
  const [devices, setDevices] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedDevice, setSelectedDevice] = useState(null);
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

  const closeNotification = () => {
    setNotification({ ...notification, show: false });
  };

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
    { label: "Device name", key: "name" },
    { label: "Device Type", key: "type" },
    { label: "Device Status", key: "status" },
    {
      label: "Location",
      key: "locationDetails",
      render: (election) => {
        return election.locationDetails
          ? `${election.locationDetails.city}, ${election.locationDetails.street},${election.locationDetails.number}`
          : "N/A";
      },
    },
  ];

  useEffect(() => {
    fetchDevices();
  }, []);


  const fetchLocationDetails = async (locationId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `http://localhost:8080/locations/${locationId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching location:", error);
      return null;
    }
  };

  const fetchDevices = async (page = 0, size = 10, searchQuery = "") => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`http://localhost:8080/devices`, {
        params: {
          page,
          size,
          search: searchQuery,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data && response.data.content) {
        console.log(response.data.content);
        const deviceWithLocation = await Promise.all(
        
          response.data.content.map(async (device) => {
            const locationDetails = await fetchLocationDetails(
              device.locationId
            );
            return { ...device, locationDetails };
          })
        );
        setDevices(deviceWithLocation);
        setTotalPages(response.data.totalPages);
        setCurrentPage(page);
      } else {
        setDevices([]);
      }

     
    } catch (error) {
      console.error("Error fetching devices:", error);
      showNotification("Error fetching devices", "error");
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
    if (selectedDevice && selectedDevice.id) {
      await deleteDevice(selectedDevice.id);
    }
    fetchDevices();
    handleModalClose();
  };

  const deleteDevice = async (deviceId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:8080/devices/${deviceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showNotification("Device deleted successfully", "success");
      fetchDevices(); // Fetch updated list of devices
    } catch (error) {
      console.error("Error deleting device:", error);
      showNotification("Failed to delete device", "error");
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    fetchDevices();
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
          onClose={closeNotification}
        />
      )}
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
        idField="id"
      />

      {modalType === "add" && (
        <AddDeviceModal
          isOpen={isModalOpen}
          closeModal={handleModalClose}
          showNotification={showNotification}
          refreshDevices={fetchDevices}
        />
      )}

      {modalType === "edit" && (
        <EditDeviceModal
          isOpen={isModalOpen}
          closeModal={handleModalClose}
          device={selectedDevice}
          showNotification={showNotification}
          refreshDevices={fetchDevices}
        />
      )}

      {modalType === "delete" && (
        <GenericModal
          isOpen={isModalOpen}
          closeModal={handleModalClose}
          title={`Delete Device`}
          footer={footerMap[modalType]}
        >
          <p>Are you sure you want to delete this device?</p>
        </GenericModal>
      )}

      <PageNavigation
        totalPages={totalPages}
        currentPage={currentPage}
        handlePageNavigation={(newPage) =>
          fetchDevices(newPage, 10, searchQuery)
        }
      />
    </div>
  );
};

export default DevicesList;
