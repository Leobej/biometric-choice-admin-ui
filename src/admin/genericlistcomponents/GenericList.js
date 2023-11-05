// src/components/GenericList.js
import React, { useState, useEffect } from "react";
import Button from "./Button";
import Table from "./Table";
import axios from "axios";

const GenericList = ({
  apiUrl,
  tableHeaders,
  renderTableRow,
  handleAdd,
  handleEdit,
  handleDelete,
  ...rest
}) => {
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Fetch data logic...
    const response = await axios.get(apiUrl);
    setData(response.data);
  };

  return (
    <div className="flex flex-col justify-between items-center min-h-screen">
      {/* Buttons */}
      <div className="flex justify-between w-full px-10 py-5 bg-blue-500 text-white">
        <Button onClick={handleAdd} color="green">Add</Button>
        {selectedItem && (
          <>
            <Button onClick={() => handleEdit(selectedItem)} color="yellow">Edit</Button>
            <Button onClick={() => handleDelete(selectedItem)} color="red">Delete</Button>
          </>
        )}
      </div>

      {/* Table */}
      <Table
        headers={tableHeaders}
        rows={data}
        onRowClick={setSelectedItem}
      />

      {/* Other UI elements */}
      {/* ... */}
    </div>
  );
};

// export default GenericList;
