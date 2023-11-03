import React from "react";

const VoterTable = ({ voters, handleRowClick, selectedVoter }) => {
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
              Voter ID
            </th>
            <th className="border border-gray-600 px-4 py-2 text-gray-800">
              CNP
            </th>
            <th className="border border-gray-600 px-4 py-2 text-gray-800">
              Created At
            </th>
          </tr>
        </thead>
        <tbody>
          {voters.map((voter) => (
            <tr
              key={voter.voterId}
              onClick={() => handleRowClick(voter)}
              className={`${
                selectedVoter &&
                selectedVoter.voterId === voter.voterId
                  ? "bg-blue-200 cursor-pointer"
                  : "cursor-pointer"
              }`}
            >
              <td className="border border-gray-600 px-4 py-2 text-gray-800">
                {voter.firstName}
              </td>
              <td className="border border-gray-600 px-4 py-2 text-gray-800">
                {voter.lastName}
              </td>
              <td className="border border-gray-600 px-4 py-2 text-gray-800">
                {voter.voterId}
              </td>
              <td className="border border-gray-600 px-4 py-2 text-gray-800">
                {voter.cnp}
              </td>
              <td className="border border-gray-600 px-4 py-2 text-gray-800">
                {voter.createdAt}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VoterTable;
