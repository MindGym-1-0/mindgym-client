const DEFAULT_GREETING = "MindGym dummy placeholder";

export function getDummyMessage(name?: string): string {
  if (!name?.trim()) {
    return DEFAULT_GREETING;
  }

  return `Hello, ${name.trim()} — ${DEFAULT_GREETING}`;
}
