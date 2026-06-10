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

export interface RecommendedAction {
  title: string;
  body: string;
  timing: string;
}

const ACTION_MAP: Record<string, RecommendedAction[]> = {
  rejection_recovery: [
    {
      title: "Name the narrative",
      body: "Write one sentence about what this rejection taught you — not what it says about you.",
      timing: "Today",
    },
    {
      title: "Return to your evidence",
      body: "Re-read your last 3 wins — applications, interviews, kind feedback. They're still true.",
      timing: "Ongoing",
    },
    {
      title: "Reach out to one person",
      body: "Send a message to someone in your network — not to ask for a job, just to stay warm.",
      timing: "Tomorrow",
    },
  ],
  interview_tomorrow: [
    {
      title: "Rehearse your opener",
      body: "Say your 'tell me about yourself' answer aloud, once, with confidence.",
      timing: "Today",
    },
    {
      title: "Prepare two questions",
      body: "Write two thoughtful questions to ask the interviewer. It signals genuine interest.",
      timing: "Today",
    },
    {
      title: "Protect your sleep",
      body: "Your brain consolidates preparation during sleep. Be in bed by 10pm.",
      timing: "Tonight",
    },
  ],
  recruiter_call: [
    {
      title: "Confirm your narrative",
      body: "Know in one sentence why you're looking and what you're moving toward.",
      timing: "Today",
    },
    {
      title: "Research the recruiter's firm",
      body: "Five minutes on their recent placements signals you take the relationship seriously.",
      timing: "Today",
    },
    {
      title: "Follow up within 24 hours",
      body: "Send a short thank-you and one specific detail from the call.",
      timing: "Tomorrow",
    },
  ],
  networking: [
    {
      title: "Draft your opening line",
      body: "Write a two-sentence intro that explains what you're working on and what you're looking for.",
      timing: "Today",
    },
    {
      title: "Identify three people to reach",
      body: "Pick contacts you've been meaning to reconnect with. Send one message today.",
      timing: "Ongoing",
    },
    {
      title: "Follow up on warm leads",
      body: "Reply to any unanswered messages from the last two weeks.",
      timing: "Tomorrow",
    },
  ],
  salary_negotiation: [
    {
      title: "Anchor your number",
      body: "Write down the number you'll say first. Practice saying it aloud without flinching.",
      timing: "Today",
    },
    {
      title: "Know your walk-away",
      body: "Define the minimum you'd accept before you get in the room — not during.",
      timing: "Today",
    },
    {
      title: "Practice the pause",
      body: "After you name your number, stop talking. Silence is your strongest tool.",
      timing: "Ongoing",
    },
  ],
  restarting_search: [
    {
      title: "Clear the backlog",
      body: "Archive applications more than 3 weeks old with no response. Start fresh.",
      timing: "Today",
    },
    {
      title: "Update one thing",
      body: "Refresh your LinkedIn headline or resume summary — just one paragraph.",
      timing: "Today",
    },
    {
      title: "Set a daily minimum",
      body: "One meaningful outreach per day is more powerful than a weekly sprint.",
      timing: "Ongoing",
    },
  ],
  general_reset: [
    {
      title: "Name what's weighing on you",
      body: "Write it down in one sentence. Getting it out of your head makes it manageable.",
      timing: "Today",
    },
    {
      title: "Pick one thing to move",
      body: "Choose the single smallest action in your job search you can take today.",
      timing: "Today",
    },
    {
      title: "Build a recovery ritual",
      body: "A 10-minute daily reset — walk, journal, breathe — compounds over weeks.",
      timing: "Ongoing",
    },
  ],
};

export function recommendedActions(preparationFor: string): RecommendedAction[] {
  return ACTION_MAP[preparationFor] ?? ACTION_MAP.general_reset;
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
