const GREETINGS: Record<string, string[]> = {
  lateNight: [
    "Most are asleep. You're still building",
    "Late nights become early wins",
    "The quiet hours are yours",
    "The best candidates are the ones who put in the reps no one sees",
    "Every hour you invest now compounds later",
    "Silence is where the real work gets done",
  ],
  earlyMorning: [
    "Up before the competition",
    "Early momentum compounds",
    "The day hasn't picked its winner yet — that's still up for grabs",
    "Recruiters check inboxes in the morning. Yours could be next",
    "Your edge is being ready when others aren't",
    "Most candidates are still sleeping. You're not",
  ],
  morning: [
    "Composure is your edge today",
    "Interviews are won before they start",
    "Today's focus shapes next month's offer",
    "A clear mind opens more doors than a polished resume",
    "The search is slow — your standards aren't",
    "Clarity over chaos, every morning",
    "What you do before noon sets the tone for everything",
  ],
  midday: [
    "Midday is where momentum lives",
    "Half the day is still yours",
    "The afternoon belongs to those who planned the morning",
    "Refuel. Refocus. Keep the thread",
    "You've made it this far — don't coast now",
    "Persistence is the skill no job description ever lists",
  ],
  afternoon: [
    "Afternoons are for follow-ups and forward thinking",
    "The grind is quiet — that's where real progress happens",
    "You showed up today. That matters more than it feels",
    "One more application, one more connection, one more step",
    "Rejections are just redirections in disguise",
    "Every 'not yet' is moving you closer to the right yes",
  ],
  evening: [
    "Reflect on what moved today",
    "The evening reset is part of the strategy",
    "You put in the work. Now let it settle",
    "Rest is not retreat — it's preparation",
    "What you let go of tonight, you carry lighter tomorrow",
    "The search is a marathon. Pace yourself",
  ],
  night: [
    "Close the tabs. Rest the mind",
    "Tomorrow has a fresh shot — tonight is for recovery",
    "Sleep is the most underrated career move",
    "Your subconscious is still working. Let it",
    "The best version of you tomorrow starts with rest tonight",
    "Wind down with intention",
  ],
};

function getTimeSlot(hour: number): keyof typeof GREETINGS {
  if (hour >= 0 && hour < 5) return "lateNight";
  if (hour >= 5 && hour < 8) return "earlyMorning";
  if (hour >= 8 && hour < 12) return "morning";
  if (hour >= 12 && hour < 14) return "midday";
  if (hour >= 14 && hour < 18) return "afternoon";
  if (hour >= 18 && hour < 21) return "evening";
  return "night";
}

export function getGreeting(name: string): string {
  const now = new Date();
  const slot = getTimeSlot(now.getHours());
  const phrases = GREETINGS[slot];
  // Rotate by day of year so it changes daily but stays consistent within a day
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86_400_000
  );
  const phrase = phrases[dayOfYear % phrases.length];
  return name ? `${phrase}, ${name}.` : `${phrase}.`;
}
