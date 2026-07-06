export const logger = {
  error: (...args: unknown[]) => {
    // In a real application, this would send errors to a service like Sentry or LogRocket.
    // For now, it preserves observability by logging to the console.
    console.error(...args);
  },
  warn: (...args: unknown[]) => {
    console.warn(...args);
  },
  info: (...args: unknown[]) => {
    console.info(...args);
  },
  debug: (...args: unknown[]) => {
    console.debug(...args);
  },
};
