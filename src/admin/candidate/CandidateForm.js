import React, { useState, useEffect } from "react";
import axios from "axios";

const CandidateForm = ({ isAddModalOpen, closeModal, saveCandidate, ...rest }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [party, setParty] = useState("");
  const [description, setDescription] = useState("");

  return (
    isAddModalOpen && (
      <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
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
                    Add Candidate
                  </h3>
                  <div className="mt-2">
                    <div className="mt-2">
                      <form onSubmit={saveCandidate}>
                        {/* First Name field */}
                        <div className="mb-4">
                          <label
                            htmlFor="firstName"
                            className="block text-gray-700 font-bold mb-2"
                          >
                            First Name:
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={firstName}
                            onChange={(event) => setFirstName(event.target.value)}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          />
                        </div>
                        {/* Last Name field */}
                        <div className="mb-4">
                          <label
                            htmlFor="lastName"
                            className="block text-gray-700 font-bold mb-2"
                          >
                            Last Name:
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={lastName}
                            onChange={(event) => setLastName(event.target.value)}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          />
                        </div>
                        {/* Party field */}
                        <div className="mb-4">
                          <label
                            htmlFor="party"
                            className="block text-gray-700 font-bold mb-2"
                          >
                            Party:
                          </label>
                          <input
                            type="text"
                            id="party"
                            name="party"
                            value={party}
                            onChange={(event) => setParty(event.target.value)}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          />
                        </div>
                        {/* Description field */}
                        <div className="mb-4">
                          <label
                            htmlFor="description"
                            className="block text-gray-700 font-bold mb-2"
                          >
                            Description:
                          </label>
                          <textarea
                            id="description"
                            name="description"
                            value={description}
                            onChange={(event) =>
                              setDescription(event.target.value)
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
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={saveCandidate}
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

export default CandidateForm;
