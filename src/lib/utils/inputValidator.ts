export type ValidationConfig = {
  type: "number" | "text" | "date" | "time";
  value: any;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  fieldName: string;
};

export function validateInput(config: ValidationConfig) {
  const {
    type,
    value,
    min,
    max,
    minLength,
    maxLength,
    fieldName,
  } = config;

  if (value === undefined || value === null || value === "") {
    return `${fieldName} is required`;
  }

  if (type === "number") {
    const num = Number(value);

    if (Number.isNaN(num)) {
      return `${fieldName} must be a number`;
    }

    if (min !== undefined && num < min) {
      return `${fieldName} must be at least ${min}`;
    }

    if (max !== undefined && num > max) {
      return `${fieldName} must be less than ${max}`;
    }
  }

  if (type === "text") {
    if (minLength && value.length < minLength) {
      return `${fieldName} is too short`;
    }

    if (maxLength && value.length > maxLength) {
      return `${fieldName} is too long`;
    }
  }

  if (type === "date") {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return `${fieldName} must be a valid date`;
    }
  }

  if (type === "time") {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(value)) {
      return `${fieldName} must be a valid time (HH:MM)`;
    }
  }

  return null;
}
