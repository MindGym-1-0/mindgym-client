const _SESSION_TITLES: Record<string, string[]> = {
  interview_tomorrow: [
    "Stepping Into Your Strongest Self",
    "You've Done the Work — Now Trust It",
    "Walking In Ready",
    "Pressure Is Just Preparation Speaking",
  ],
  recruiter_call: [
    "Making the Right Impression",
    "Your Story, Told Clearly",
    "Calm, Sharp, and Ready",
    "The First Door Opens Here",
  ],
  rejection_recovery: [
    "Breaking the Rejection Spiral",
    "One No Doesn't Define the Journey",
    "You're Still in the Game",
    "Rising After the Setback",
  ],
  networking: [
    "Building Genuine Connections",
    "Every Conversation Is a Door",
    "Show Up, Stay Curious",
    "People Remember How You Made Them Feel",
  ],
  salary_negotiation: [
    "Knowing Your Worth",
    "You Earn What You Negotiate",
    "Standing Firm in Your Value",
    "The Ask That Changes Everything",
  ],
  restarting_search: [
    "Reigniting Your Momentum",
    "The Search Starts Fresh Today",
    "Every Search Has a Turning Point",
    "Back in Motion",
  ],
  general_reset: [
    "A Quiet Mind Moves Faster",
    "Reset. Breathe. Begin Again.",
    "Your Clarity Starts Here",
    "Still Water Runs Deep",
  ],
};

export function sessionTitle(preparationFor: string, sessionNumber: number): string {
  const variants = _SESSION_TITLES[preparationFor] ?? _SESSION_TITLES.general_reset;
  return variants[(sessionNumber - 1) % variants.length];
}

export function preparationLabel(preparationFor: string): string {
  const labels: Record<string, string> = {
    rejection_recovery: "Rejection recovery",
    interview_tomorrow: "Interview tomorrow",
    recruiter_call: "Recruiter call",
    networking: "Networking",
    salary_negotiation: "Salary negotiation",
    restarting_search: "Restarting search",
    general_reset: "General reset",
  };
  return labels[preparationFor] ?? preparationFor;
}

export function sessionModality(preparationFor: string): string {
  const modalities: Record<string, string> = {
    rejection_recovery: "Visualisation",
    interview_tomorrow: "Rehearsal",
    recruiter_call: "Rehearsal",
    networking: "Visualisation",
    salary_negotiation: "Rehearsal",
    restarting_search: "Reset",
    general_reset: "Reset",
  };
  return modalities[preparationFor] ?? "Visualisation";
}

export function timeLabel(timeAvailable: string | null): string {
  if (!timeAvailable) return "";
  const map: Record<string, string> = {
    "5 min": "5 minutes",
    "10 min": "10 minutes",
    "15 min": "15 minutes",
  };
  return map[timeAvailable] ?? timeAvailable;
}

export function anxietyLabel(level: number): string {
  if (level <= 3) return "Calm and steady";
  if (level <= 5) return "Moderate — manageable";
  if (level <= 7) return "High anxiety";
  return "Very high anxiety";
}

export function feelingChipLabel(feeling: string): string {
  const labels: Record<string, string> = {
    calm: "Less anxious",
    grounded: "Grounded",
    confident: "More confident",
    focused: "More focused",
    clear_minded: "Clear-minded",
    composed: "Composed",
  };
  return labels[feeling] ?? feeling;
}

export function feelingReflection(desired: string[]): string {
  if (desired.length === 0) return "You showed up. That's the work.";
  const labels = desired.map(feelingChipLabel);
  const joined =
    labels.length === 1
      ? labels[0]
      : `${labels.slice(0, -1).join(", ")} and ${labels[labels.length - 1]}`;
  return `${joined} — that's exactly the state you want going into tomorrow. The session worked.`;
}

type ClosingVariant = (before: number, after: number, n: number) => string;

const _DROP_VARIANTS: Record<string, ClosingVariant[]> = {
  interview_tomorrow: [
    (b, a, n) => `You walked into this at ${b}. You're leaving at ${a}. Whatever happens tomorrow, you've already moved. Session ${n} done.`,
    (b, a, n) => `${b} going in, ${a} going out. That gap matters — especially with tomorrow ahead. Session ${n} is in the books.`,
    (b, a, n) => `${b - a} points down before the interview. You didn't perform your way there — you just showed up. Session ${n} logged.`,
  ],
  recruiter_call: [
    (b, a, n) => `${b} to ${a}. You're steadier going into that call than you were an hour ago. Session ${n} done.`,
    (b, a, n) => `You came in at ${b} and you're leaving at ${a}. The call will go better because of this. Session ${n} in the books.`,
    (b, a, n) => `${b - a}-point drop. The preparation happened. Session ${n} logged.`,
  ],
  rejection_recovery: [
    (b, a, n) => `You came in carrying ${b}. You're leaving with ${a}. One data point doesn't define the trajectory. Session ${n} done.`,
    (b, a, n) => `${b} in, ${a} out. That's not nothing after a rejection. Session ${n} in the books.`,
    (b, a, n) => `You sat with the hard thing and came out ${b - a} points lighter. That's the work. Session ${n} logged.`,
  ],
  networking: [
    (b, a, n) => `${b} to ${a}. You're walking in clearer than you walked in here. Session ${n} done.`,
    (b, a, n) => `${b - a}-point shift. The anxiety was real — so is this. Session ${n} in the books.`,
    (b, a, n) => `You came in at ${b}, you're leaving at ${a}. Good conversations start from here. Session ${n} logged.`,
  ],
  salary_negotiation: [
    (b, a, n) => `${b} to ${a}. You know your number. Now you believe it a little more. Session ${n} done.`,
    (b, a, n) => `You walked in at ${b} and you're leaving at ${a}. That steadiness is part of the negotiation. Session ${n} in the books.`,
    (b, a, n) => `${b - a} points. Negotiating from ${a} is a different posture than negotiating from ${b}. Session ${n} logged.`,
  ],
  restarting_search: [
    (b, a, n) => `You came in at ${b}. You're leaving at ${a}. One session, one small shift. That's how momentum builds. Session ${n} done.`,
    (b, a, n) => `${b} to ${a}. The search didn't restart itself — you did. Session ${n} in the books.`,
    (b, a, n) => `${b - a}-point drop. Starting is the hard part. You already did it. Session ${n} logged.`,
  ],
  general_reset: [
    (b, a, n) => `You came in at ${b} and left at ${a}. That ${b - a}-point drop didn't happen by accident — you chose to pause when it would've been easier not to. Session ${n} done.`,
    (b, a, n) => `${b} to ${a}. No interview, no crisis — just you deciding to show up for yourself. That's the quiet kind of discipline that compounds. Session ${n} in the books.`,
    (b, a, n) => `You came in carrying ${b}. You're leaving with ${a}. The reset worked. Come back before the noise builds again. Session ${n} logged.`,
  ],
};

const _HOLD_VARIANTS: ClosingVariant[] = [
  (_b, _a, n) => `You held steady through the whole session. Some days the win is just staying in it. That counts. Session ${n} is in the books.`,
  (_b, _a, n) => `The ground didn't move. Some days that's the whole job. Session ${n} done.`,
  (_b, _a, n) => `Steady all the way through. Not every session shifts the number — sometimes it just keeps you upright. That's enough. Session ${n} complete.`,
  (_b, _a, n) => `Some sessions hold the floor rather than drop the ceiling. That matters. Session ${n} logged.`,
];

const _RISE_VARIANTS: ClosingVariant[] = [
  (b, a, n) => `You moved from ${b} to ${a}. Noticing where you are is the start of shifting it. Session ${n} is complete — come back tomorrow.`,
  (b, a, n) => `${b} to ${a}. Some sessions surface what's there rather than dissolve it. You know more now than when you sat down. Session ${n} done.`,
  (_b, _a, n) => `The number went up. That's honest data, not a failure. Awareness is the first move. Come back. Session ${n} logged.`,
  (b, a, n) => `You showed up at ${b} and you're leaving at ${a}. That's hard. Sessions compound — come back tomorrow. Session ${n} complete.`,
];

export function closingMessage(
  before: number,
  after: number,
  sessionNumber: number,
  preparationFor: string,
): string {
  const drop = before - after;
  if (drop > 0) {
    const variants = _DROP_VARIANTS[preparationFor] ?? _DROP_VARIANTS.general_reset;
    return variants[(sessionNumber - 1) % variants.length](before, after, sessionNumber);
  }
  const variants = drop === 0 ? _HOLD_VARIANTS : _RISE_VARIANTS;
  return variants[(sessionNumber - 1) % variants.length](before, after, sessionNumber);
}

export function nextSessionLabel(preparationFor: string): string {
  const map: Record<string, string> = {
    rejection_recovery: "Panel room visualisation",
    interview_tomorrow: "Post-interview debrief",
    recruiter_call: "Deep-dive interview prep",
    networking: "Follow-up confidence builder",
    salary_negotiation: "Offer evaluation session",
    restarting_search: "Weekly momentum check-in",
    general_reset: "Focus and clarity reset",
  };
  return map[preparationFor] ?? "Your next session";
}
