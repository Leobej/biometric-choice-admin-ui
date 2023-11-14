import React, { useState } from "react";

const AddVoterModal = ({ isOpen, closeModal }) => {
  const [cnp, setCnp] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [fingerprintId, setFingerprintId] = useState(null);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    closeModal();
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
          <form onSubmit={handleSubmit} className="max-w-lg mx-auto ml-">
            <div className="mt-4 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="mt-4">
                <label htmlFor="cnp" className="block text-gray-700">
                  CNP:
                </label>
                <input
                  type="text"
                  id="cnp"
                  name="cnp"
                  value={cnp}
                  onChange={(event) => setCnp(event.target.value)}
                  required
                  className="form-input mt-1 block w-full"
                />
              </div>
              <div className="mt-4">
                <label htmlFor="createdAt" className="block text-gray-700">
                  Created At:
                </label>
                <input
                  type="text"
                  id="createdAt"
                  name="createdAt"
                  value={createdAt}
                  onChange={(event) => setCreatedAt(event.target.value)}
                  required
                  className="form-input mt-1 block w-full"
                />
              </div>
              <div className="mt-4">
                <label htmlFor="fingerprintId" className="block text-gray-700">
                  Fingerprint ID:
                </label>
                <input
                  type="text"
                  id="fingerprintId"
                  name="fingerprintId"
                  value={fingerprintId || ''}
                  onChange={(event) => setFingerprintId(event.target.value)}
                  className="form-input mt-1 block w-full"
                />
              </div>
              <div className="mt-4">
                <label htmlFor="firstname" className="block text-gray-700">
                  First Name:
                </label>
                <input
                  type="text"
                  id="firstname"
                  name="firstname"
                  value={firstname}
                  onChange={(event) => setFirstname(event.target.value)}
                  required
                  className="form-input mt-1 block w-full"
                />
              </div>
              <div className="mt-4">
                <label htmlFor="lastname" className="block text-gray-700">
                  Last Name:
                </label>
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  value={lastname}
                  onChange={(event) => setLastname(event.target.value)}
                  required
                  className="form-input mt-1 block w-full"
                />
              </div>
              <div className="mt-4">
                <label htmlFor="password" className="block text-gray-700">
                  Password:
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
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
                  Add Voter
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

export default AddVoterModal;
