import React from 'react';

const ActionBar = ({ onAddClick, onEditClick, onDeleteClick }) => {
  return (
    <div className="action-bar flex justify-around mb-1">
      <button onClick={onAddClick} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
        Add
      </button>
      <button onClick={onEditClick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Edit
      </button>
      <button onClick={onDeleteClick} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
        Delete
      </button>
    </div>
  );
};

export default ActionBar;