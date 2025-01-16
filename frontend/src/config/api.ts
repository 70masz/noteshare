export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_URL,
    TIMEOUT: 5000,
    HEADERS: {
      'Content-Type': 'application/json'
    }
  } as const;