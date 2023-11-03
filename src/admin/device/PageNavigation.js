import React from 'react';

const PageNavigation = ({ totalPages, currentPage, handlePageNavigation }) => {
    const pages = [
      <button key="first" onClick={() => handlePageNavigation(0)}>&lt;&lt;</button>,
      <button key="prev" onClick={() => handlePageNavigation(Math.max(currentPage - 1, 0))}>&lt;</button>,
    ];
    pages.push(
      <button key={currentPage} className="bg-blue-500 text-white px-4 py-2 mx-1 rounded">
        {currentPage + 1}
      </button>
    );
    pages.push(
      <button key="next" onClick={() => handlePageNavigation(Math.min(currentPage + 1, totalPages - 1))}>&gt;</button>
    );
    pages.push(
      <button key="last" onClick={() => handlePageNavigation(totalPages - 1)}>&gt;&gt;</button>
    );
  
    return (
      <div className="flex justify-center items-center py-4 bg-gray-200">
        {pages}
      </div>
    );
  };
  

export default PageNavigation;
