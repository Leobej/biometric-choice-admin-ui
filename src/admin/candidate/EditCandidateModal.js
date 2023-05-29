import React, { useState, useEffect } from "react";

const EditCandidateModal = ({ isOpen, closeModal, candidate, saveCandidate }) => {
  // Local state to track the form field values
  const [firstname, setFirstName] = useState(candidate ? candidate.firstname : '');
  const [lastname, setLastName] = useState(candidate ? candidate.lastname : '');
  const [party, setParty] = useState(candidate ? candidate.party : '');

  useEffect(() => {
    if (candidate) {
      setFirstName(candidate.firstname);
      setLastName(candidate.lastname);
      setParty(candidate.party);
    }
  }, [candidate]);

  const handleSubmit = (event) => {
    event.preventDefault();

    saveCandidate({
      ...candidate,
      firstname,
      lastname,
      party,
    });

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
         <form onSubmit={handleSubmit}>
            <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div>
                <label className="block">
                  <span className="text-gray-700">First Name</span>
                  <input
                    type="text"
                    className="form-input mt-1 block w-full"
                    placeholder="First Name"
                    value={firstname}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </label>
              </div>
              <div className="mt-4">
                <label className="block">
                  <span className="text-gray-700">Last Name</span>
                  <input
                    type="text"
                    className="form-input mt-1 block w-full"
                    placeholder="Last Name"
                    value={lastname}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </label>
              </div>
              <div className="mt-4">
                <label className="block">
                  <span className="text-gray-700">Party</span>
                  <input
                    type="text"
                    className="form-input mt-1 block w-full"
                    placeholder="Party"
                    value={party}
                    onChange={(e) => setParty(e.target.value)}
                  />
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

export default EditCandidateModal;
