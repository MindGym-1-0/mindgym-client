export type RecommendedSession = {
  title: string;
  duration_mins: number;
  focus: string;
  session_type: string;
};

export type MayaSuggests = {
  text: string;
  session_type: string;
  time_suggestion: string;
};

export type CoachHomeResponse = {
  recommended_sessions: RecommendedSession[];
  recommended_today: string[];
  maya_suggests: MayaSuggests;
  maya_greeting: string;
};

export type PrepPlanItem = {
  day: number;
  task: string;
  description: string;
  session_type: string;
  duration_mins: number;
};

export type RecommendedFirstSession = {
  session_type: string;
  reason: string;
  duration_mins: number;
};

export type CoachPrepPlanResponse = {
  plan: PrepPlanItem[];
  recommended_first_session: RecommendedFirstSession;
  coach_note: string;
  created_at?: string;
};

export type CoachPrepPlanRequest = {
  interview_id: string;
  worry_input: string;
};

export type ChecklistItem = {
  id: string;
  label: string;
  checked: boolean;
  metadata: Record<string, unknown>;
};

export type TonightsPlanTask = {
  time: string;
  task: string;
};

export type OverallReadiness = {
  score: number;
  total_items: number;
  label: string;
  message: string;
  confidence_baseline: number;
};

export type InterviewChecklistResponse = {
  overall_readiness: OverallReadiness;
  mental_prep: ChecklistItem[];
  logistics: ChecklistItem[];
  tonights_plan: TonightsPlanTask[];
  quote: string;
};

export type ChecklistRequest = {
  interview_id: string;
};

export type InterviewOutcome = "offer" | "no_offer" | "awaiting" | "pending";

export type InterviewOutcomeResponse = {
  id: string;
  outcome: InterviewOutcome;
  check_in_attempts: number;
  next_check_in_at: string | null;
};
