import React, { useState, useEffect } from "react";

const NotificationBanner = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Start with the banner invisible and then fade in
    const fadeInTimer = setTimeout(() => {
      setIsVisible(true);
    }, 100); // Short delay before starting the fade in

    // Start a timer to automatically close the banner
    const fadeOutTimer = setTimeout(() => {
      setIsVisible(false);
    }, 4700); // Keep the banner visible for a bit longer

    // Clear the timeouts if the component is unmounted
    return () => {
      clearTimeout(fadeInTimer);
      clearTimeout(fadeOutTimer);
    };
  }, []);

  useEffect(() => {
    // When the banner is no longer visible, call onClose
    if (!isVisible) {
      const closeTimer = setTimeout(onClose, 600); // Wait for the fade-out to complete
      return () => clearTimeout(closeTimer);
    }
  }, [isVisible, onClose]);

  return (
    <div
      className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-lg text-white flex items-center justify-between ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      } transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      style={{ zIndex: 50 }}
    >
      {message}
      <button onClick={() => setIsVisible(false)} className="ml-4">
        X
      </button>
    </div>
  );
};

export default NotificationBanner;
