import React from "react";

const Modal = ({
  children,
  isOpen,
  onClose,
  title,
  hideHeader,
  showActionBtn,
  actionBtnIcon = null,
  actionBtnText,
  onActionClick,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-black/50 backdrop-blur-sm">
      {/* Modal Content */}
      <div
        className={`relative flex flex-col bg-white dark:bg-[#1C2330] shadow-lg rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 transition-colors`}
      >
        {/* Modal Header */}
        {!hideHeader && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
            <h3 className="md:text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>

            {showActionBtn && (
              <button
                className="btn-small-light mr-12"
                onClick={() => onActionClick()}
              >
                {actionBtnIcon}
                {actionBtnText}
              </button>
            )}
          </div>
        )}

        <button
          type="button"
          className="text-gray-400 dark:text-gray-500 bg-transparent hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg text-sm w-8 h-8 flex justify-center items-center absolute top-3.5 right-3.5 transition-all cursor-pointer"
          onClick={onClose}
        >
          <svg
            className="w-3 h-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
        </button>

        {/* Modal Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-[#1C2330] text-gray-800 dark:text-gray-100">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
