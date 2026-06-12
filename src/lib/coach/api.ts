import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { buildApiUrl } from "../auth/api";
import type {
  ChecklistItemUpdateResponse,
  CoachHomeResponse,
  CoachPrepPlanRequest,
  CoachPrepPlanResponse,
  InterviewChecklistResponse,
  InterviewOutcome,
  InterviewOutcomeResponse,
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

async function getToken(): Promise<string> {
  const supabase = getSupabaseBrowserClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) return session.access_token;
  const { data: { session: refreshed } } = await supabase.auth.refreshSession();
  if (refreshed?.access_token) return refreshed.access_token;
  throw new Error("Not authenticated");
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
  const token = await getToken();
  const response = await fetch(buildApiUrl("/api/coach/home"), {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) await throwCoachApiError(response);
  const payload = await parseJsonSafely(response);
  assertCoachHomeResponse(payload);
  return payload;
}

export async function getCoachPrepPlan(interviewId: string): Promise<CoachPrepPlanResponse> {
  const token = await getToken();
  const encodedInterviewId = encodeURIComponent(interviewId);
  const response = await fetch(buildApiUrl(`/api/coach/prep-plan/${encodedInterviewId}`), {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) await throwCoachApiError(response);
  const payload = await parseJsonSafely(response);
  assertCoachPrepPlanResponse(payload);
  return payload;
}

export async function createCoachPrepPlan(
  interviewId: string,
  worryInput: string
): Promise<CoachPrepPlanResponse> {
  const token = await getToken();
  const requestBody: CoachPrepPlanRequest = {
    interview_id: interviewId,
    worry_input: worryInput,
  };
  const response = await fetch(buildApiUrl("/api/coach/prep-plan"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(requestBody),
  });
  if (!response.ok) await throwCoachApiError(response);
  const payload = await parseJsonSafely(response);
  assertCoachPrepPlanResponse(payload);
  return payload;
}

export async function getInterviewChecklist(interviewId: string): Promise<InterviewChecklistResponse> {
  const token = await getToken();
  const response = await fetch(buildApiUrl("/api/coach/checklist"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ interview_id: interviewId }),
  });
  if (!response.ok) await throwCoachApiError(response);
  const payload = await parseJsonSafely(response);
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("Malformed checklist response.");
  }
  return payload as InterviewChecklistResponse;
}

export async function updateInterviewChecklistItem(
  interviewId: string,
  itemId: string,
  checked: boolean
): Promise<ChecklistItemUpdateResponse> {
  const token = await getToken();
  const encodedInterviewId = encodeURIComponent(interviewId);
  const encodedItemId = encodeURIComponent(itemId);
  const response = await fetch(
    buildApiUrl(`/api/coach/checklist/${encodedInterviewId}/items/${encodedItemId}`),
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ checked }),
    }
  );

  if (!response.ok) await throwCoachApiError(response);

  if (response.status === 204) {
    return {
      interview_id: interviewId,
      item_id: itemId,
      checked,
    };
  }

  const payload = await parseJsonSafely(response);
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return {
      interview_id: interviewId,
      item_id: itemId,
      checked,
    };
  }

  const candidate = payload as Record<string, unknown>;

  return {
    interview_id:
      typeof candidate.interview_id === "string" ? candidate.interview_id : interviewId,
    item_id: typeof candidate.item_id === "string" ? candidate.item_id : itemId,
    checked: typeof candidate.checked === "boolean" ? candidate.checked : checked,
  };
}

export type Interview = {
  id: string;
  company: string;
  role: string;
  interview_date: string;
  outcome?: InterviewOutcome | null;
  event_type?: string;
  job_id?: string | null;
};

export async function getInterviews(): Promise<{ upcoming: Interview[]; past: Interview[] }> {
  const token = await getToken();
  const response = await fetch(buildApiUrl("/api/interviews"), {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) await throwCoachApiError(response);
  const payload = await parseJsonSafely(response);
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("Malformed interviews response.");
  }
  return payload as { upcoming: Interview[]; past: Interview[] };
}

export async function createInterview(data: {
  company: string;
  role: string;
  interview_date: string;
  event_type?: string;
  job_id?: string;
  notes?: string;
}): Promise<Interview> {
  const token = await getToken();
  const response = await fetch(buildApiUrl("/api/interviews"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) await throwCoachApiError(response);
  const payload = await parseJsonSafely(response);
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("Malformed create interview response.");
  }
  return payload as Interview;
}

function assertInterviewOutcomeResponse(payload: unknown): asserts payload is InterviewOutcomeResponse {
  const entityName = "interview outcome";
  assertObject(payload, entityName);
  assertStringField(payload.id, "id", entityName);
  assertStringField(payload.outcome, "outcome", entityName);
  assertNumberField(payload.check_in_attempts, "check_in_attempts", entityName);

  const allowedOutcomes: InterviewOutcome[] = ["offer", "no_offer", "awaiting", "pending"];
  if (!allowedOutcomes.includes(payload.outcome as InterviewOutcome)) {
    throw new Error(`Malformed ${entityName} response: outcome must be a supported interview outcome.`);
  }

  if (payload.next_check_in_at !== null && payload.next_check_in_at !== undefined) {
    assertStringField(payload.next_check_in_at, "next_check_in_at", entityName);
  }
}

function normalizeInterviewOutcomeResponse(
  payload: unknown,
  interviewId: string,
  outcome: InterviewOutcome
): InterviewOutcomeResponse {
  if (payload === null) {
    return {
      id: interviewId,
      outcome,
      check_in_attempts: 0,
      next_check_in_at: null,
    };
  }

  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    const candidate = payload as Record<string, unknown>;
    const nextOutcome = candidate.outcome;

    if (typeof candidate.id === "string" && typeof nextOutcome === "string") {
      const allowedOutcomes: InterviewOutcome[] = ["offer", "no_offer", "awaiting", "pending"];

      if (allowedOutcomes.includes(nextOutcome as InterviewOutcome)) {
        return {
          id: candidate.id,
          outcome: nextOutcome as InterviewOutcome,
          check_in_attempts:
            typeof candidate.check_in_attempts === "number" && !Number.isNaN(candidate.check_in_attempts)
              ? candidate.check_in_attempts
              : 0,
          next_check_in_at: typeof candidate.next_check_in_at === "string" ? candidate.next_check_in_at : null,
        };
      }
    }
  }

  return {
    id: interviewId,
    outcome,
    check_in_attempts: 0,
    next_check_in_at: null,
  };
}

export async function updateInterviewOutcome(
  interviewId: string,
  outcome: InterviewOutcome
): Promise<InterviewOutcomeResponse> {
  const token = await getToken();
  const encodedInterviewId = encodeURIComponent(interviewId);
  const response = await fetch(buildApiUrl(`/api/interviews/${encodedInterviewId}/outcome`), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ outcome }),
  });

  if (!response.ok) await throwCoachApiError(response);

  if (response.status === 204) {
    return {
      id: interviewId,
      outcome,
      check_in_attempts: 0,
      next_check_in_at: null,
    };
  }

  const payload = await parseJsonSafely(response);

  if (payload !== null) {
    try {
      assertInterviewOutcomeResponse(payload);
      return payload;
    } catch {
      return normalizeInterviewOutcomeResponse(payload, interviewId, outcome);
    }
  }

  return normalizeInterviewOutcomeResponse(payload, interviewId, outcome);
}
