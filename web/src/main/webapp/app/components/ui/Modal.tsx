import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import clsx from 'clsx';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl";
  footer?: React.ReactNode;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  className?: string;
  contentClassName?: string;
}

const Modal = ({ 
  isOpen, 
  onClose, 
  children, 
  title, 
  size = "md", 
  footer,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  className,
  contentClassName
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  // Handle escape key press
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, closeOnEscape]);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      // Small delay to ensure modal is rendered
      setTimeout(() => modalRef.current?.focus(), 0);
    } else {
      previousActiveElement.current?.focus();
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  // Size classes
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl"
  };

  return ReactDOM.createPortal(
    <div 
      className={clsx(
        "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30",
        className
      )}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div 
        ref={modalRef}
        tabIndex={-1}
        className={clsx(
          "bg-white rounded-lg shadow-lg w-full relative overflow-hidden max-h-[90vh]",
          sizeClasses[size],
          contentClassName
        )}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="px-6 py-4 border-b flex items-center justify-between">
            {title && (
              <h3 id="modal-title" className="text-lg font-medium text-gray-900">{title}</h3>
            )}
            {showCloseButton && (
              <button
                className="ml-auto text-gray-500 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1"
                onClick={onClose}
                aria-label="Close modal"
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/* Close button for no header */}
        {!title && showCloseButton && (
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        )}

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