/* ──────────────────────────────────────────────────────
   SIRCA — Centralized API Client
   
   Provides a unified interface for HTTP requests, 
   replacing scattered fetch() calls with consistent
   error handling and JSON headers.
   ────────────────────────────────────────────────────── */

/**
 * Execute a fetch request with automatic JSON headers and error handling.
 * Throws an error with the server's message if the response is not OK.
 */
export async function apiRequest<T>(url: string, options?: RequestInit): Promise<T | undefined> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || `Error ${res.status}`);
  }

  // Handle 204 No Content
  const text = await res.text();
  if (!text) return undefined;
  return JSON.parse(text) as T;
}

/** Convenience methods for common HTTP verbs */
export const api = {
  get: <T>(url: string) => apiRequest<T>(url, { method: 'GET' }),

  post: <T>(url: string, body?: unknown) =>
    apiRequest<T>(url, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(url: string, body?: unknown) =>
    apiRequest<T>(url, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(url: string, body?: unknown) =>
    apiRequest<T>(url, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(url: string) => apiRequest<T>(url, { method: 'DELETE' }),
};
