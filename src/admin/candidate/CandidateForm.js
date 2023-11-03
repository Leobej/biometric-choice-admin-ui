import React from "react";
import GenericForm from "../genericlistcomponents/GenericForm";
import GenericModal from "../genericlistcomponents/GenericModal";

const CandidateForm = ({ isAddModalOpen, closeModal, saveCandidate }) => {
  const initialValues = {
    firstName: "",
    lastName: "",
    party: "",
    description: "",
  };
  const fields = [
    { name: "firstname", label: "First Name", type: "text", required: true },
    { name: "lastname", label: "Last Name", type: "text", required: true },
    { name: "party", label: "Party", type: "text", required: true },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      required: true,
    },
  ];

  const footer = (
    <>
      <button
        type="submit"
        form="generic-form" // This should match the id of the form
        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
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
    </>
  );

  return (
    <GenericModal
      isOpen={isAddModalOpen}
      closeModal={closeModal}
      title="Add Candidate"
      footer={footer}
    >
      <GenericForm
        initialValues={initialValues}
        onSubmit={saveCandidate}
        fields={fields}
        id="generic-form"
      />
    </GenericModal>
  );
};

// export default CandidateForm;
