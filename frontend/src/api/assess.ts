import type {
  ApiErrorResponse,
  ApiSuccessResponse,
  AssessEventRequest,
} from "../types/assessment";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

export class AssessApiError extends Error {
  fieldErrors?: Record<string, string[]>;

  constructor(message: string, fieldErrors?: Record<string, string[]>) {
    super(message);
    this.name = "AssessApiError";
    this.fieldErrors = fieldErrors;
  }
}

export async function assessEvent(
  payload: AssessEventRequest,
): Promise<ApiSuccessResponse["data"]> {
  const response = await fetch(`${API_BASE}/api/v1/events/assess`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const body = (await response.json()) as
    | ApiSuccessResponse
    | ApiErrorResponse;

  if (!response.ok || !body.success) {
    const errorBody = body as ApiErrorResponse;
    throw new AssessApiError(errorBody.message, errorBody.errors);
  }

  return body.data;
}
