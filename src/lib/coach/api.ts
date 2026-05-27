import { buildApiUrl } from "../auth/api";
import type {
  CoachHomeResponse,
  CoachPrepPlanRequest,
  CoachPrepPlanResponse
} from "./types";

type ApiErrorPayload = {
  error?: string;
  message?: string;
};

export class CoachApiError extends Error {
  status: number;
  payload: unknown;

  constructor(status: number, message: string, payload: unknown) {
    super(message);
    this.name = "CoachApiError";
    this.status = status;
    this.payload = payload;
  }
}

function readPayloadMessage(payload: unknown) {
  if (!payload || typeof payload !== "object") return null;

  const candidate = payload as ApiErrorPayload;
  if (typeof candidate.error === "string" && candidate.error.trim()) return candidate.error;
  if (typeof candidate.message === "string" && candidate.message.trim()) return candidate.message;
  return null;
}

async function parseJsonSafely(response: Response) {
  try {
    return (await response.json()) as unknown;
  } catch {
    return null;
  }
}

function assertObject(payload: unknown, entityName: string): asserts payload is Record<string, unknown> {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error(`Malformed ${entityName} response.`);
  }
}

function assertCoachHomeResponse(payload: unknown): asserts payload is CoachHomeResponse {
  assertObject(payload, "coach home");

  if (!Array.isArray(payload.recommended_sessions)) {
    throw new Error("Malformed coach home response: recommended_sessions must be an array.");
  }

  if (!Array.isArray(payload.recommended_today)) {
    throw new Error("Malformed coach home response: recommended_today must be an array.");
  }

  if (!payload.maya_suggests || typeof payload.maya_suggests !== "object") {
    throw new Error("Malformed coach home response: maya_suggests is required.");
  }

  if (typeof payload.maya_greeting !== "string") {
    throw new Error("Malformed coach home response: maya_greeting must be a string.");
  }
}

function assertCoachPrepPlanResponse(payload: unknown): asserts payload is CoachPrepPlanResponse {
  assertObject(payload, "coach prep plan");

  if (!Array.isArray(payload.plan)) {
    throw new Error("Malformed coach prep plan response: plan must be an array.");
  }

  if (!payload.recommended_first_session || typeof payload.recommended_first_session !== "object") {
    throw new Error("Malformed coach prep plan response: recommended_first_session is required.");
  }

  if (typeof payload.coach_note !== "string") {
    throw new Error("Malformed coach prep plan response: coach_note must be a string.");
  }
}

async function throwCoachApiError(response: Response) {
  const payload = await parseJsonSafely(response);
  const fallback = response.status >= 500
    ? "Coach service is temporarily unavailable."
    : "Coach request failed.";
  const message = readPayloadMessage(payload) ?? fallback;
  throw new CoachApiError(response.status, message, payload);
}

export async function getCoachHome(): Promise<CoachHomeResponse> {
  const response = await fetch(buildApiUrl("/api/coach/home"), {
    method: "GET",
    credentials: "include"
  });

  if (!response.ok) {
    await throwCoachApiError(response);
  }

  const payload = await parseJsonSafely(response);
  assertCoachHomeResponse(payload);
  return payload;
}

export async function getCoachPrepPlan(interviewId: string): Promise<CoachPrepPlanResponse> {
  const encodedInterviewId = encodeURIComponent(interviewId);
  const response = await fetch(buildApiUrl(`/api/coach/prep-plan/${encodedInterviewId}`), {
    method: "GET",
    credentials: "include"
  });

  if (!response.ok) {
    await throwCoachApiError(response);
  }

  const payload = await parseJsonSafely(response);
  assertCoachPrepPlanResponse(payload);
  return payload;
}

export async function createCoachPrepPlan(
  interviewId: string,
  worryInput: string
): Promise<CoachPrepPlanResponse> {
  const requestBody: CoachPrepPlanRequest = {
    interview_id: interviewId,
    worry_input: worryInput
  };

  const response = await fetch(buildApiUrl("/api/coach/prep-plan"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    await throwCoachApiError(response);
  }

  const payload = await parseJsonSafely(response);
  assertCoachPrepPlanResponse(payload);
  return payload;
}
