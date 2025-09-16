import type { Event } from "../interface";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface EventApiProps {
  url: string;
  method?: HttpMethod;
  body?: Event | null;
}

export const eventApi = async ({
  url,
  method = "GET",
  body = null,
}: EventApiProps) => {
  try {
    const options: RequestInit = {
      method: method.toUpperCase(),
      headers: {
        "Content-Type": "application/json",
      },
    };

    // Only attach body for methods that support it
    if (body && ["POST", "PUT", "PATCH"].includes(method)) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to fetch events");
    }

    const data = await response.json();
    return data;
  } catch (error: unknown) {
    // Let the caller handle errors and display toasts
    console.error("API error:", error);
    throw error instanceof Error ? error : new Error("Unknown error");
  }
};
