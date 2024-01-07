import React, { useState, useEffect } from "react";
import axios from "axios";
const EditLocationModal = ({
  isOpen,
  closeModal,
  location,
  refreshLocations,
  showNotification,
}) => {
  const [address, setAddress] = useState(location ? location.address : "");
  const [city, setCity] = useState(location ? location.city : "");
  const [postalCode, setPostalCode] = useState(
    location ? location.postalCode : ""
  );
  const [country, setCountry] = useState(location ? location.country : "");
  const [street, setStreet] = useState(location ? location.street : "");
  const [number, setNumber] = useState(location ? location.number : "");

  useEffect(() => {
    if (location) {
      setAddress(location.address);
      setCity(location.city);
      setPostalCode(location.postalCode);
      setCountry(location.country);
      setStreet(location.street);
      setNumber(location.number);
    }
  }, [location]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const updatedLocation = {
      ...location,

      address,
      city,
      postalCode,
      country,
      street,
      number,
    };

    await saveLocation(updatedLocation);
    closeModal();
  };

  const saveLocation = async (updatedLocation) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8080/locations/${updatedLocation.locationId}`,
        updatedLocation,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      refreshLocations();
      closeModal();
      showNotification("Location updated successfully", "success");
    } catch (error) {
      console.error("Error updating location:", error);
      showNotification("Error updating location. Please try again.", "error");
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
              <div className="mt-4">
                <label htmlFor="city" className="block text-gray-700">
                  City:
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  required
                  className="form-input mt-1 block w-full"
                />
              </div>

              <div className="mt-4">
                <label htmlFor="postalCode" className="block text-gray-700">
                  Postal Code:
                </label>
                <input
                  type="text"
                  id="postalCode"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                  className="form-input mt-1 block w-full"
                />
              </div>
              <div className="mt-4">
                <label htmlFor="country" className="block text-gray-700">
                  Country:
                </label>
                <input
                  type="text"
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                  className="form-input mt-1 block w-full"
                />
              </div>
              <div className="mt-4">
                <label htmlFor="street" className="block text-gray-700">
                  Street:
                </label>
                <input
                  type="text"
                  id="street"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  required
                  className="form-input mt-1 block w-full"
                />
              </div>
              <div className="mt-4">
                <label htmlFor="number" className="block text-gray-700">
                  Number:
                </label>
                <input
                  type="text"
                  id="number"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  required
                  className="form-input mt-1 block w-full"
                />
              </div>
            </div>
            <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
                <button
                  type="submit"
                  className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-green-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-green-500 focus:outline-none focus:border-green-700 focus:shadow-outline-green transition ease-in-out duration-150 sm:text-sm"
                >
                  Save Location
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

export default EditLocationModal;
