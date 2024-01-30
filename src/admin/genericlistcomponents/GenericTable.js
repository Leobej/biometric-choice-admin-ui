import React from "react";

const GenericTable = ({ data, onRowClick, selectedData, columns, idField }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <table className="table-auto border-collapse border border-gray-800 mt-5">
        <thead>
          <tr>
            {columns &&
              columns.map((col, index) => (
                <th
                  key={index}
                  className="border border-gray-600 px-4 py-2 text-gray-800"
                >
                  {col.label}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={item[idField]}
              onClick={() => onRowClick(item)}
              className={`${
                selectedData && selectedData[idField] === item[idField]
                  ? "bg-blue-200 cursor-pointer"
                  : "cursor-pointer"
              }`}
            >
              {columns.map((col, colIndex) => (
                <td
                  key={colIndex}
                  className="border border-gray-600 px-4 py-2 text-gray-800"
                >
                  {col.render ? col.render(item) : item[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GenericTable;
