/**
 * API Configuration for backend integration
 */

export const API_CONFIG = {
  baseURL: "https://e-api-omega.vercel.app",
  companyId: "COMP-000002",
};

/**
 * Get the full API URL for an endpoint
 */
export const getApiUrl = (endpoint: string): string => {
  const base = API_CONFIG.baseURL.replace(/\/$/, "");
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${base}${path}`;
};

/**
 * Get headers for API requests with authentication
 */
export const getApiHeaders = (token?: string): Record<string, string> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};
