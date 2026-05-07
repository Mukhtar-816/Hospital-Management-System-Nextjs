const IS_DEV = process.env.NODE_ENV === "development";

export function handleApiError(error: any) {
  if (IS_DEV) {
    console.error("DEBUG API ERROR:", error);
  }

  const message = String(error?.message || "").toLowerCase();

  if (message.includes("duplicate")) {
    return "Record already exists (e.g. duplicate email or name)";
  }

  if (message.includes("invalid input") || message.includes("invalid format")) {
    return "Invalid data provided. Please check your inputs.";
  }

  if (message.includes("not found")) {
    return "Requested record not found.";
  }

  if (message.includes("unauthorized") || message.includes("forbidden")) {
    return "Access denied. Please login with appropriate credentials.";
  }

  if (message.includes("conflict")) {
    return "Scheduling conflict. Please try a different time.";
  }

  return "Something went wrong. Please try again later.";
}
