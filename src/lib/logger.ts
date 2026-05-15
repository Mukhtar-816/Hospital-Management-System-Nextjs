export const devLog = (...args: any[]) => {
  if (process.env.NODE_ENV === "development") {
    console.log("[DEV-LOG]:", ...args);
  }
};

export const devError = (...args: any[]) => {
  if (process.env.NODE_ENV === "development") {
    console.error("[DEV-ERROR]:", ...args);
  }
};
