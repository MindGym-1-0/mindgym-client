export function sessionTitle(preparationFor: string): string {
  const titles: Record<string, string> = {
    rejection_recovery: "Envisioning Success — Breaking the Rejection Spiral",
    interview_tomorrow: "Stepping Into Your Strongest Self",
    recruiter_call: "Making the Right Impression",
    networking: "Building Genuine Connections",
    salary_negotiation: "Knowing Your Worth",
    restarting_search: "Reigniting Your Momentum",
    general_reset: "Clearing the Mental Slate",
  };
  return titles[preparationFor] ?? "Mindset Reset";
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

export function closingMessage(
  before: number,
  after: number,
  sessionNumber: number,
): string {
  const drop = before - after;
  if (drop > 0) {
    return `You came in at ${before} and left at ${after}. That ${drop}-point drop didn't happen by accident — you chose to show up for yourself, and that matters. Session ${sessionNumber} is done. Keep this feeling close.`;
  }
  if (drop === 0) {
    return `You held steady at ${before} through the whole session. Some days the win is just staying in it. That counts. Session ${sessionNumber} is in the books.`;
  }
  return `You moved from ${before} to ${after}. Noticing where you are is the start of shifting it. Session ${sessionNumber} is complete — come back tomorrow.`;
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
