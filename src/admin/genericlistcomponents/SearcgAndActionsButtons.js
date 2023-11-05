// src/components/SearchAndActionButtons.js
import React from 'react';

const SearchAndActionButtons = ({
    searchQuery,
    setSearchQuery,
    handleSearch,
    handleAdd,
    handleEdit,
    handleDelete,
    selectedItem,
}) => {
    return (
        <div className="flex flex-col">
            <div className="py-4">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="rounded border px-2 py-1"
                />
                <button
                    onClick={() => handleSearch(0, 10, searchQuery)}
                    className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Search
                </button>
            </div>

            <div className="flex justify-between w-full px-10 py-5 bg-blue-500 text-white">
                <button
                    onClick={handleAdd}
                    className="flex items-center bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    aria-label="Add new item"
                >
                    {/* ...Add icon */}
                    Add
                </button>
                {selectedItem && (
                    <>
                        <button
                            onClick={() => handleEdit(selectedItem)}
                            className="flex items-center bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                            aria-label="Edit selected item"
                        >
                            {/* ...Edit icon */}
                            Edit
                        </button>
                        <button
                            onClick={() => handleDelete(selectedItem)}
                            className="flex items-center bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            aria-label="Delete selected item"
                        >
                            {/* ...Delete icon */}
                            Delete
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

// export default SearchAndActionButtons;
