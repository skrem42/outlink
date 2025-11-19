import type { ApiResponse } from "@/types/database";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiRequest<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    const data: ApiResponse<T> = await response.json();

    if (!response.ok) {
      throw new ApiError(response.status, data.error || "An error occurred");
    }

    if (data.error) {
      throw new ApiError(response.status, data.error);
    }

    return data.data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Network error occurred");
  }
}

// Helper functions for common HTTP methods
export const api = {
  get: <T>(url: string, options?: RequestInit) =>
    apiRequest<T>(url, { ...options, method: "GET" }),

  post: <T>(url: string, body?: unknown, options?: RequestInit) =>
    apiRequest<T>(url, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(url: string, body?: unknown, options?: RequestInit) =>
    apiRequest<T>(url, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(url: string, options?: RequestInit) =>
    apiRequest<T>(url, { ...options, method: "DELETE" }),
};


