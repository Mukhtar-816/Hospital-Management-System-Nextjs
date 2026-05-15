/**
 * Centralized Validation Helpers
 * Used for both Frontend (Zod) and Backend (API Routes)
 */

export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (countryCode: string, number: string) => {
  const codeRegex = /^\+\d{1,4}$/;
  const numRegex = /^\d{7,15}$/;
  return codeRegex.test(countryCode) && numRegex.test(number);
};

export const validateCNIC = (cnic: string) => {
  // Example CNIC validation (5-7-1 format for Pakistan, or adjust as needed)
  const cnicRegex = /^\d{5}-\d{7}-\d{1}$|^\d{13}$/;
  return cnicRegex.test(cnic);
};

export const isNotEmpty = (value: string | undefined | null) => {
  if (value === undefined || value === null) return false;
  return value.trim().length > 0;
};

export const validateRequired = (fields: Record<string, any>) => {
  const missing = [];
  for (const [key, value] of Object.entries(fields)) {
    if (typeof value === 'string' && !isNotEmpty(value)) {
      missing.push(key);
    } else if (value === undefined || value === null) {
      missing.push(key);
    }
  }
  return {
    isValid: missing.length === 0,
    missingFields: missing
  };
};

// Generic validation result interface
export interface ValidationResult {
  isValid: boolean;
  message?: string;
}
