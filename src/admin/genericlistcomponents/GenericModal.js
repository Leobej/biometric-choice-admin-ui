import React from 'react';

const GenericModal = ({ isOpen, closeModal, title, children, footer }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
  
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-6 pt-5 pb-4 sm:p-6 sm:pb-4"> 
            {title && <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">{title}</h3>}
            <div className="mt-2">
              {children}
            </div>
          </div>
          {footer && (
            <div className="bg-gray-50 px-6 py-3 sm:px-6  sm:flex sm:flex-row-reverse"> 
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenericModal;
