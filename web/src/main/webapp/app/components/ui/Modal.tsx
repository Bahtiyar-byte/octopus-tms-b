import React, { useEffect } from "react";
import ReactDOM from "react-dom";

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl";
  footer?: React.ReactNode;
};

const Modal = ({ isOpen, onClose, children, title, size = "md", footer }: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // disable scroll
    } else {
      document.body.style.overflow = ""; // reset scroll
    }

    return () => {
      document.body.style.overflow = ""; // always reset on unmount
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Size classes
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl"
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className={`bg-white rounded-lg shadow-lg ${sizeClasses[size]} w-full relative overflow-hidden max-h-[90vh]`}>
        {/* Header */}
        {title && (
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          </div>
        )}

        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>

        {/* Content */}
        <div className="px-6 py-4 overflow-y-auto" style={{ maxHeight: footer ? 'calc(90vh - 150px)' : 'calc(90vh - 70px)' }}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-6 border-t bg-gray-50">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;