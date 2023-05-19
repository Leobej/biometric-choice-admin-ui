import React from "react";

const ElectionTable = ({ elections, handleRowClick, selectedElection }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <table className="table-auto border-collapse border border-gray-800 mt-5">
        <thead>
          <tr>
            <th className="border border-gray-600 px-4 py-2 text-gray-800">
              Description
            </th>
            <th className="border border-gray-600 px-4 py-2 text-gray-800">
              Created at
            </th>
            <th className="border border-gray-600 px-4 py-2 text-gray-800">
              Location
            </th>
          </tr>
        </thead>
        <tbody>
          {elections.map((election) => (
            <tr
              key={election.electionId}
              onClick={() => handleRowClick(election)}
              className={`${
                selectedElection &&
                selectedElection.electionId === election.electionId
                  ? "bg-blue-200 cursor-pointer"
                  : "cursor-pointer"
              }`}
            >
              <td className="border border-gray-600 px-4 py-2 text-gray-800">
                {election.description}
              </td>
              <td className="border border-gray-600 px-4 py-2 text-gray-800">
                {election.createdAt}
              </td>
              <td className="border border-gray-600 px-4 py-2 text-gray-800">
                {election.location}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* <div className="mt-5">{renderPageNavigation()}</div> */}
    </div>
  );
};

export default ElectionTable;
