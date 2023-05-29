import React from "react";

const CandidateTable = ({ candidates, handleRowClick, selectedCandidate }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <table className="table-auto border-collapse border border-gray-800 mt-5">
        <thead>
          <tr>
            <th className="border border-gray-600 px-4 py-2 text-gray-800">
              First Name
            </th>
            <th className="border border-gray-600 px-4 py-2 text-gray-800">
              Last Name
            </th>
            <th className="border border-gray-600 px-4 py-2 text-gray-800">
              Party
            </th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate) => (
            <tr
              key={candidate.candidateId}
              onClick={() => handleRowClick(candidate)}
              className={`${
                selectedCandidate &&
                selectedCandidate.candidateId === candidate.candidateId
                  ? "bg-blue-200 cursor-pointer"
                  : "cursor-pointer"
              }`}
            >
              <td className="border border-gray-600 px-4 py-2 text-gray-800">
                {candidate.firstname}
              </td>
              <td className="border border-gray-600 px-4 py-2 text-gray-800">
                {candidate.lastname}
              </td>
              <td className="border border-gray-600 px-4 py-2 text-gray-800">
                {candidate.party}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CandidateTable;
