import React, { useState } from "react";

const VoterForm = ({ isAddModalOpen, closeModal, saveVoter, ...rest }) => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [password, setPassword] = useState("");
  const [cnp, setCnp] = useState("");
  const [fingerprintId, setFingerprintId] = useState("");
  const [createdAt, setCreatedAt] = useState("123");

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log({
      firstname,
      lastname,
      password,
      cnp,
      fingerprintId,
      createdAt,
    });
    saveVoter(
      { firstname, lastname, password, cnp, fingerprintId, createdAt },
      event
    );
    closeModal();
  };

  return (
    isAddModalOpen && (
      <div
        className="fixed z-10 inset-0 overflow-y-auto"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3
                    className="text-lg leading-6 font-medium text-gray-900"
                    id="modal-title"
                  >
                    Add Voter
                  </h3>
                  <div className="mt-2">
                    <form onSubmit={handleSubmit}>
                      <div className="mb-4">
                        <label
                          htmlFor="firstname"
                          className="block text-gray-700 font-bold mb-2"
                        >
                          First Name:
                        </label>
                        <input
                          type="text"
                          id="firstname"
                          value={firstname}
                          onChange={(event) => setFirstname(event.target.value)}
                          required
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="lastname"
                          className="block text-gray-700 font-bold mb-2"
                        >
                          Last Name:
                        </label>
                        <input
                          type="text"
                          id="lastname"
                          value={lastname}
                          onChange={(event) => setLastname(event.target.value)}
                          required
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="password"
                          className="block text-gray-700 font-bold mb-2"
                        >
                          Password:
                        </label>
                        <input
                          type="password"
                          id="password"
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                          required
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="cnp"
                          className="block text-gray-700 font-bold mb-2"
                        >
                          CNP:
                        </label>
                        <input
                          type="text"
                          id="cnp"
                          value={cnp}
                          onChange={(event) => setCnp(event.target.value)}
                          required
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="fingerprintId"
                          className="block text-gray-700 font-bold mb-2"
                        >
                          Fingerprint ID:
                        </label>
                        <input
                          type="text"
                          id="fingerprintId"
                          value={fingerprintId}
                          onChange={(event) =>
                            setFingerprintId(event.target.value)
                          }
                          required
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={handleSubmit}
              >
                Save
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default VoterForm;
