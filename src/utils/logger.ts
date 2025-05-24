export const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data ? data : "");
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error ? error : "");
  },
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data ? data : "");
  },
};
