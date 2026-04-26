import type React from "react";
import { useId } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = ({
  label,
  error,
  className = "",
  id: providedId,
  ...props
}: InputProps) => {
  const generatedId = useId();
  const id = providedId || generatedId;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-text">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full px-4 py-2 bg-surface border rounded-xl text-text placeholder:text-textMuted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
          error ? "border-error" : "border-border"
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-error">{error}</span>}
    </div>
  );
};

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = ({
  label,
  error,
  className = "",
  id: providedId,
  ...props
}: TextareaProps) => {
  const generatedId = useId();
  const id = providedId || generatedId;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-text">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={`w-full px-4 py-2 bg-surface border rounded-xl text-text placeholder:text-textMuted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all min-h-[100px] ${
          error ? "border-error" : "border-border"
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-error">{error}</span>}
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = ({
  label,
  error,
  options,
  className = "",
  id: providedId,
  ...props
}: SelectProps) => {
  const generatedId = useId();
  const id = providedId || generatedId;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-text">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`w-full px-4 py-2 bg-surface border rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
          error ? "border-error" : "border-border"
        } ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option
            key={opt.value}
            value={opt.value}
            className="bg-surface text-text"
          >
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-error">{error}</span>}
    </div>
  );
};
