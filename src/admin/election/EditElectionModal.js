import React from "react";
import { useEffect } from "react";

const EditElectionModal = ({ isOpen, closeModal, election, saveElection }) => {
  // Local state to track the form field values
  const [description, setDescription] = React.useState(election.description);
  const [location, setLocation] = React.useState(election.location);
  const [createdAt, setCreatedAt] = React.useState(election.createdAt);
  const [voterId, setVoterId] = React.useState(election.voterId);

  // Use an effect to update the form field values when the election prop changes
  useEffect(() => {
    setDescription(election.description);
    setLocation(election.location);
    setCreatedAt(election.createdAt);
    setVoterId(election.voterId);
  }, [election]);

  const handleSubmit = (event) => {
    event.preventDefault();

    // Save the updated election details
    saveElection({
      ...election,
      description,
      location,
      createdAt,
      voterId,
    });

    // Close the modal
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
                  <span className="text-gray-700">Description</span>
                  <input
                    type="text"
                    className="form-input mt-1 block w-full"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </label>
              </div>
              <div className="mt-4">
                <label className="block">
                  <span className="text-gray-700">Location</span>
                  <input
                    type="text"
                    className="form-input mt-1 block w-full"
                    placeholder="Location"
                    value={location}  
                    onChange={(e) => setLocation(e.target.value)}
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

export default EditElectionModal;
