import React, { useState } from "react";
import axios from "axios";
const AddDeviceModal = ({
  isOpen,
  closeModal,
  refreshDevices,
  showNotification,
}) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault(); // Keep this line only

    const newDevice = { name, type, status };
    console.log("Sending devic3e data:", newDevice);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:8080/devices`,
        { name: name, type: type, status: status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        showNotification("Device added successfully", "success");
        refreshDevices();
        closeModal();
      } else {
        // Handle other successful statuses if necessary
      }
    } catch (error) {
      console.error("Error adding device:", error);
      showNotification("Error adding device. Please try again.", "error");
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <form onSubmit={handleSubmit}>
            <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div>
                <label className="block">
                  <span className="text-gray-700">Device Name</span>
                  <input
                    type="text"
                    className="form-input mt-1 block w-full"
                    placeholder="Device Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </label>
              </div>
              <div className="mt-4">
                <label className="block">
                  <span className="text-gray-700">Device Type</span>
                  <select
                    className="form-select mt-1 block w-full"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="Fingerprint Registration">
                      Fingerprint Registration
                    </option>
                    <option value="Fingerprint Verification">
                      Fingerprint Verification
                    </option>
                    <option value="Voting Device">Voting Device</option>
                  </select>
                </label>
              </div>
              <div className="mt-4">
                <label className="block">
                  <span className="text-gray-700">Device Status</span>
                  <select
                    className="form-select mt-1 block w-full"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </label>
              </div>
            </div>
            <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
                <button
                  type="submit"
                  className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-green-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-green-500 focus:outline-none focus:border-green-700 focus:shadow-outline-green transition ease-in-out duration-150 sm:text-sm"
                >
                  Save
                </button>
              </span>
              <span className="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
                <button
                  type="button"
                  onClick={closeModal}
                  className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm"
                >
                  Cancel
                </button>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDeviceModal;
