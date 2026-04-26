import type React from "react";
import { Button } from "./Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm w-full h-full border-none cursor-default"
        onClick={onClose}
        onKeyUp={(e) => e.key === "Escape" && onClose()}
        aria-label="Close modal"
      />
      <div className="relative bg-surface border border-border rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-text">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-textMuted hover:text-text transition-colors"
          >
            <svg
              role="img"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <title>Close</title>
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
        <div className="p-6 border-t border-border flex justify-end gap-3">
          {footer || (
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export const EmptyState = ({
  title = "No data found",
  description = "There are no items to display at the moment.",
  icon,
}: {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-border rounded-2xl">
      {icon ? (
        <div className="mb-4 text-textMuted">{icon}</div>
      ) : (
        <div className="mb-4 text-textMuted">
          <svg
            role="img"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <title>Empty State Icon</title>
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
        </div>
      )}
      <h3 className="text-lg font-medium text-text">{title}</h3>
      <p className="text-sm text-textMuted mt-1">{description}</p>
    </div>
  );
};
