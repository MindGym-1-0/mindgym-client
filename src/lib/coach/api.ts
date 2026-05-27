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

function assertStringField(value: unknown, fieldPath: string, entityName: string) {
  if (typeof value !== "string") {
    throw new Error(`Malformed ${entityName} response: ${fieldPath} must be a string.`);
  }
}

function assertNumberField(value: unknown, fieldPath: string, entityName: string) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error(`Malformed ${entityName} response: ${fieldPath} must be a number.`);
  }
}

function assertArrayField(value: unknown, fieldPath: string, entityName: string): asserts value is unknown[] {
  if (!Array.isArray(value)) {
    throw new Error(`Malformed ${entityName} response: ${fieldPath} must be an array.`);
  }
}

function assertObjectField(
  value: unknown,
  fieldPath: string,
  entityName: string
): asserts value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`Malformed ${entityName} response: ${fieldPath} must be an object.`);
  }
}

function assertCoachHomeResponse(payload: unknown): asserts payload is CoachHomeResponse {
  const entityName = "coach home";
  assertObject(payload, "coach home");
  assertArrayField(payload.recommended_sessions, "recommended_sessions", entityName);
  assertArrayField(payload.recommended_today, "recommended_today", entityName);
  assertObjectField(payload.maya_suggests, "maya_suggests", entityName);
  assertStringField(payload.maya_greeting, "maya_greeting", entityName);

  payload.recommended_sessions.forEach((item, index) => {
    const fieldPrefix = `recommended_sessions[${index}]`;
    assertObjectField(item, fieldPrefix, entityName);
    assertStringField(item.title, `${fieldPrefix}.title`, entityName);
    assertNumberField(item.duration_mins, `${fieldPrefix}.duration_mins`, entityName);
    assertStringField(item.focus, `${fieldPrefix}.focus`, entityName);
    assertStringField(item.session_type, `${fieldPrefix}.session_type`, entityName);
  });

  payload.recommended_today.forEach((item, index) => {
    assertStringField(item, `recommended_today[${index}]`, entityName);
  });

  assertStringField(payload.maya_suggests.text, "maya_suggests.text", entityName);
  assertStringField(payload.maya_suggests.session_type, "maya_suggests.session_type", entityName);
  assertStringField(payload.maya_suggests.time_suggestion, "maya_suggests.time_suggestion", entityName);
}

function assertCoachPrepPlanResponse(payload: unknown): asserts payload is CoachPrepPlanResponse {
  const entityName = "coach prep plan";
  assertObject(payload, "coach prep plan");
  assertArrayField(payload.plan, "plan", entityName);
  assertObjectField(payload.recommended_first_session, "recommended_first_session", entityName);
  assertStringField(payload.coach_note, "coach_note", entityName);

  payload.plan.forEach((item, index) => {
    const fieldPrefix = `plan[${index}]`;
    assertObjectField(item, fieldPrefix, entityName);
    assertNumberField(item.day, `${fieldPrefix}.day`, entityName);
    assertStringField(item.task, `${fieldPrefix}.task`, entityName);
    assertStringField(item.description, `${fieldPrefix}.description`, entityName);
    assertStringField(item.session_type, `${fieldPrefix}.session_type`, entityName);
    assertNumberField(item.duration_mins, `${fieldPrefix}.duration_mins`, entityName);
  });

  assertStringField(payload.recommended_first_session.session_type, "recommended_first_session.session_type", entityName);
  assertStringField(payload.recommended_first_session.reason, "recommended_first_session.reason", entityName);
  assertNumberField(payload.recommended_first_session.duration_mins, "recommended_first_session.duration_mins", entityName);

  if (payload.created_at !== undefined) {
    assertStringField(payload.created_at, "created_at", entityName);
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
