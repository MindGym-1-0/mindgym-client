"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { readActive } from "@/lib/session/store";

const PHASE_NAMES = ["Breathe", "Ground", "Rehearse", "Anchor", "Close"];
const PHASE_EMOJIS = ["🫁", "🌱", "🎤", "⚓", "🌅"];
const WORD_SPEED_MS = 400;
const WORDS_PER_TICK = 2;

type ActiveSession = NonNullable<ReturnType<typeof readActive>>;

export default function ActiveSessionPage() {
  const router = useRouter();
  const [session, setSession] = useState<ActiveSession | null>(null);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const s = readActive();
    if (!s) {
      router.replace("/sessions");
      return;
    }
    setSession(s);
  }, [router]);

  useEffect(() => {
    if (!session) return;

    const phaseKeys = ["phase1", "phase2", "phase3", "phase4", "phase5"] as const;
    const fullText = session.script[phaseKeys[currentPhase]];

    const words = fullText.split(" ");
    setDisplayedText("");
    setIsTyping(true);
    let i = 0;

    intervalRef.current = setInterval(() => {
      i = Math.min(i + WORDS_PER_TICK, words.length);
      setDisplayedText(words.slice(0, i).join(" "));
      if (i >= words.length) {
        clearInterval(intervalRef.current!);
        setIsTyping(false);
      }
    }, WORD_SPEED_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentPhase, session]);

  if (!session) return null;

  const phaseKeys = ["phase1", "phase2", "phase3", "phase4", "phase5"] as const;
  const isLast = currentPhase === 4;

  const skipOrAdvance = (onDone: () => void) => {
    if (isTyping) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setDisplayedText(session.script[phaseKeys[currentPhase]]);
      setIsTyping(false);
    } else {
      onDone();
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F6F4] p-8">
      <div className="bg-white rounded-3xl p-6 border mb-8">
        <h1 className="text-2xl font-semibold">Maya is guiding your session</h1>
        <p className="text-gray-500 mt-2">
          Phase {currentPhase + 1} of 5 • {PHASE_NAMES[currentPhase]}
        </p>
      </div>

      <div className="grid grid-cols-[2fr_1fr] gap-6">
        <div className="rounded-3xl bg-gradient-to-br from-[#032F2B] to-[#0C6B58] p-10 text-white min-h-[500px] flex flex-col items-center justify-center">
          <div className="text-7xl mb-6">{PHASE_EMOJIS[currentPhase]}</div>
          <h2 className="text-3xl font-semibold">{PHASE_NAMES[currentPhase]}</h2>
          <p className="mt-6 text-center max-w-lg text-gray-200 leading-relaxed whitespace-pre-wrap">
            {displayedText}
            {isTyping && <span className="animate-pulse">▋</span>}
          </p>

          <div className="flex gap-4 mt-10">
            {isLast ? (
              <button
                onClick={() => skipOrAdvance(() => router.push("/sessions/feedback"))}
                className="bg-[#1A8A74] px-5 py-3 rounded-xl"
              >
                {isTyping ? "Skip →" : "Finish session →"}
              </button>
            ) : (
              <button
                onClick={() => skipOrAdvance(() => setCurrentPhase((p) => p + 1))}
                className="bg-white text-black px-5 py-3 rounded-xl"
              >
                {isTyping ? "Skip →" : "Next phase →"}
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {PHASE_NAMES.map((name, i) => (
            <div
              key={name}
              className={`rounded-2xl p-5 border transition-all ${
                i === currentPhase
                  ? "bg-[#DDF4EE] border-[#0C6B58] font-medium"
                  : i < currentPhase
                  ? "bg-white text-gray-400"
                  : "bg-white"
              }`}
            >
              Phase {i + 1} • {name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
