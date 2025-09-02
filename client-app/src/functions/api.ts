// src/services/api.ts
const API_URL = import.meta.env.VITE_API_URL;

// Unauthenticated fetch
export async function fetchAPI<T>(
  route: string,
  options: {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: any;
    headers?: Record<string, string>;
  } = {}
): Promise<T> {
  const { method = "GET", body, headers = {} } = options;

  const fetchHeaders: Record<string, string> = {
    ...headers,
    ...(body ? { "Content-Type": "application/json" } : {}),
  };

  const response = await fetch(`${API_URL}${route}`, {
    method,
    headers: fetchHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Request failed: ${response.status} - ${errorText}`);
  }

  return response.json();
}

// Authenticated fetch
export async function fetchAuth<T>(
  route: string,
  token: string,
  options: {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: any;
    headers?: Record<string, string>;
  } = {}
): Promise<T> {
  const { method = "GET", body, headers = {} } = options;

  const fetchHeaders: Record<string, string> = {
    ...headers,
    Authorization: `Bearer ${token}`,
    ...(body ? { "Content-Type": "application/json" } : {}),
  };

  const response = await fetch(`${API_URL}${route}`, {
    method,
    headers: fetchHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Request failed: ${response.status} - ${errorText}`);
  }

  return response.json();
}
