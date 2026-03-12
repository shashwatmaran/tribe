import { ErrorResponse } from "@/types/api";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export class APIError extends Error {
  constructor(
    public status: number,
    public data?: ErrorResponse
  ) {
    super(data?.message || "An API error occurred");
    this.name = "APIError";
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

async function request<T>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options;

  // Build URL with query parameters
  let finalUrl = `${API_BASE_URL}${url}`;
  if (params) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      queryParams.append(key, String(value));
    });
    finalUrl += `?${queryParams.toString()}`;
  }

  // Set default headers
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...fetchOptions.headers,
  };

  // Add auth token if available
  const token = localStorage.getItem("authToken");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(finalUrl, {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      let errorData: ErrorResponse | undefined;
      try {
        errorData = await response.json();
      } catch {
        // Silent fail if response body is not JSON
      }
      throw new APIError(response.status, errorData);
    }

    // Handle empty responses (e.g., 204 No Content)
    if (response.status === 204) {
      return undefined as T;
    }

    return response.json() as Promise<T>;
  } catch (error) {
    // Re-throw APIError, convert other errors
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(0, {
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred",
      code: "UNKNOWN_ERROR",
      timestamp: new Date().toISOString(),
    });
  }
}

// Group endpoints
export const groupAPI = {
  create: (data: { platformGroupId: string; totalAmount: number; memberCount: number; currency: string }) =>
    request("/api/groups", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getAll: () =>
    request("/api/groups", {
      method: "GET",
    }),

  getById: (id: string) =>
    request(`/api/groups/${id}`, {
      method: "GET",
    }),

  generateInvoice: (groupId: string) =>
    request(`/api/groups/${groupId}/invoices`, {
      method: "POST",
    }),
};

// Member endpoints
export const memberAPI = {
  add: (groupId: string, data: { email: string }) =>
    request(`/api/groups/${groupId}/members`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getByGroupId: (groupId: string) =>
    request(`/api/groups/${groupId}/members`, {
      method: "GET",
    }),

  remove: (groupId: string, memberId: string) =>
    request(`/api/groups/${groupId}/members/${memberId}`, {
      method: "DELETE",
    }),
};

// Invoice endpoints
export const invoiceAPI = {
  getByGroupId: (groupId: string, params?: { page?: number; size?: number }) =>
    request(`/api/groups/${groupId}/invoices`, {
      method: "GET",
      params,
    }),

  getById: (groupId: string, invoiceId: string) =>
    request(`/api/groups/${groupId}/invoices/${invoiceId}`, {
      method: "GET",
    }),

  downloadPDF: (groupId: string, invoiceId: string) =>
    fetch(`${API_BASE_URL}/api/groups/${groupId}/invoices/${invoiceId}/pdf`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
      },
    }),
};

// Charge endpoints
export const chargeAPI = {
  getByGroupId: (groupId: string) =>
    request(`/api/groups/${groupId}/charges`, {
      method: "GET",
    }),

  retry: (chargeId: string) =>
    request(`/api/charges/${chargeId}/retry`, {
      method: "POST",
    }),
};

export default {
  groupAPI,
  memberAPI,
  invoiceAPI,
  chargeAPI,
};
