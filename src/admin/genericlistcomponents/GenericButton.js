// src/components/Button.js
import React from "react";

const GenericButton = ({ onClick, children, color, ariaLabel }) => {
  const colorClasses = {
    green: "bg-green-500 hover:bg-green-700",
    yellow: "bg-yellow-500 hover:bg-yellow-700",
    red: "bg-red-500 hover:bg-red-700",
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center ${colorClasses[color]} text-white font-bold py-2 px-4 rounded`}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};

export default GenericButton;
