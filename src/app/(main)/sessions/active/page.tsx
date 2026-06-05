"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { readActive, type ActiveSession } from "@/lib/session/store";
import { fetchPhaseAudio, revokePhaseAudio } from "@/lib/session/audio";

const PHASE_NAMES = ["Breathe", "Ground", "Rehearse", "Anchor", "Close"];
const PHASE_EMOJIS = ["🫁", "🌱", "🎤", "⚓", "🌅"];
const PHASE_KEYS = ["phase1", "phase2", "phase3", "phase4", "phase5"] as const;
const WORD_SPEED_MS = 400;
const WORDS_PER_TICK = 2;
const AUDIO_READY_TIMEOUT_MS = 3000;

function getPhaseText(session: ActiveSession, phaseIndex: number): string {
  return session.script[PHASE_KEYS[phaseIndex]];
}

export default function ActiveSessionPage() {
  const router = useRouter();

  const [session, setSession] = useState<ActiveSession | null>(null);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [audioMode, setAudioMode] = useState(true);
  const [audioReady, setAudioReady] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Refs used inside event handlers to avoid stale closures
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentUrlRef = useRef<string | null>(null);
  const nextUrlRef = useRef<string | null>(null);
  const currentPhaseRef = useRef(0);
  const sessionRef = useRef<ActiveSession | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const handlePhaseEndedRef = useRef<() => void>(() => {});

  const startTypewriter = useCallback((phaseIndex: number) => {
    if (!sessionRef.current) return;
    const words = getPhaseText(sessionRef.current, phaseIndex).split(" ");
    if (intervalRef.current) clearInterval(intervalRef.current);
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
  }, []);

  // Fetch audio for a backend phase number (1–5) and store in nextUrlRef
  const prefetchNextPhase = useCallback((backendPhase: number) => {
    if (!sessionRef.current || backendPhase > 5) return;
    fetchPhaseAudio(sessionRef.current.session_id, backendPhase).then((url) => {
      if (url) nextUrlRef.current = url;
    });
  }, []);

  // Keep handlePhaseEndedRef current so audio.onended always calls latest version
  useEffect(() => {
    handlePhaseEndedRef.current = () => {
      const nextPhaseIndex = currentPhaseRef.current + 1;

      if (nextPhaseIndex >= 5) {
        router.push("/sessions/feedback");
        return;
      }

      if (currentUrlRef.current) {
        revokePhaseAudio(currentUrlRef.current);
        currentUrlRef.current = null;
      }

      currentPhaseRef.current = nextPhaseIndex;
      setCurrentPhase(nextPhaseIndex);

      if (nextUrlRef.current && audioRef.current) {
        // Play the pre-fetched audio for the next phase
        currentUrlRef.current = nextUrlRef.current;
        nextUrlRef.current = null;
        audioRef.current.src = currentUrlRef.current;
        audioRef.current.play().catch(() => {
          setAudioMode(false);
          startTypewriter(nextPhaseIndex);
        });
        if (sessionRef.current) {
          setDisplayedText(getPhaseText(sessionRef.current, nextPhaseIndex));
        }
        // backendPhase for the phase after next = nextPhaseIndex (0-indexed) + 2
        prefetchNextPhase(nextPhaseIndex + 2);
      } else {
        // Next phase audio wasn't ready — fall back to typewriter
        setAudioMode(false);
        startTypewriter(nextPhaseIndex);
      }
    };
  }, [router, startTypewriter, prefetchNextPhase]);

  // Mount: read session, create audio element, prefetch phase 1
  useEffect(() => {
    const s = readActive();
    if (!s) {
      router.replace("/sessions");
      return;
    }
    setSession(s);
    sessionRef.current = s;

    const audio = new Audio();
    audio.onended = () => handlePhaseEndedRef.current();
    audioRef.current = audio;

    // Enable Begin button after 3 s even if audio hasn't arrived
    const fallbackTimer = setTimeout(() => {
      if (!currentUrlRef.current) setAudioMode(false);
      setAudioReady(true);
    }, AUDIO_READY_TIMEOUT_MS);

    fetchPhaseAudio(s.session_id, 1).then((url) => {
      clearTimeout(fallbackTimer);
      if (url) {
        currentUrlRef.current = url;
      } else {
        setAudioMode(false);
      }
      setAudioReady(true);
    });

    return () => {
      clearTimeout(fallbackTimer);
      audio.pause();
      audio.onended = null;
      audio.src = "";
      if (currentUrlRef.current) revokePhaseAudio(currentUrlRef.current);
      if (nextUrlRef.current) revokePhaseAudio(nextUrlRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [router]);

  const handleBegin = () => {
    if (!session || !audioReady) return;
    setSessionStarted(true);

    if (audioMode && currentUrlRef.current && audioRef.current) {
      // audio.play() called directly from tap handler — satisfies iOS autoplay policy
      audioRef.current.src = currentUrlRef.current;
      audioRef.current.play().catch(() => {
        setAudioMode(false);
        startTypewriter(0);
      });
      setDisplayedText(getPhaseText(session, 0));
      prefetchNextPhase(2); // backend phase 2 = phase index 1
    } else {
      setAudioMode(false);
      startTypewriter(0);
    }
  };

  const handleToggleAudio = () => {
    if (!audioMode || !sessionStarted) return;
    if (audioRef.current) audioRef.current.pause();
    setAudioMode(false);
    startTypewriter(currentPhase);
  };

  const skipOrAdvance = () => {
    if (audioMode) {
      // Stop current audio and switch to typewriter for remaining phases
      if (audioRef.current) audioRef.current.pause();
      if (currentUrlRef.current) {
        revokePhaseAudio(currentUrlRef.current);
        currentUrlRef.current = null;
      }
      if (currentPhase >= 4) {
        router.push("/sessions/feedback");
        return;
      }
      const next = currentPhase + 1;
      currentPhaseRef.current = next;
      setCurrentPhase(next);
      setAudioMode(false);
      startTypewriter(next);
    } else {
      // Typewriter mode: skip to full text first tap, advance on second
      if (isTyping) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayedText(session ? getPhaseText(session, currentPhase) : "");
        setIsTyping(false);
      } else if (currentPhase >= 4) {
        router.push("/sessions/feedback");
      } else {
        const next = currentPhase + 1;
        currentPhaseRef.current = next;
        setCurrentPhase(next);
        startTypewriter(next);
      }
    }
  };

  if (!session) return null;

  const isLast = currentPhase === 4;

  return (
    <div className="min-h-screen bg-[#F6F6F4] p-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Maya is guiding your session</h1>
          <p className="text-gray-500 mt-2">
            Phase {currentPhase + 1} of 5 • {PHASE_NAMES[currentPhase]}
          </p>
        </div>
        {sessionStarted && (
          <button
            onClick={handleToggleAudio}
            title={audioMode ? "Switch to text" : "Audio off"}
            className="p-2 rounded-full hover:bg-gray-100 text-xl transition-colors"
            aria-label={audioMode ? "Switch to text mode" : "Audio is off"}
          >
            {audioMode ? "🔊" : "🔇"}
          </button>
        )}
      </div>

      <div className="grid grid-cols-[2fr_1fr] gap-6">
        {/* Main phase card */}
        <div className="rounded-3xl bg-gradient-to-br from-[#032F2B] to-[#0C6B58] p-10 text-white min-h-[500px] flex flex-col items-center justify-center">
          <div className="text-7xl mb-6">{PHASE_EMOJIS[currentPhase]}</div>
          <h2 className="text-3xl font-semibold">{PHASE_NAMES[currentPhase]}</h2>

          {!sessionStarted ? (
            // Pre-session intro — shown while audio is prefetching
            <div className="mt-8 flex flex-col items-center gap-3 text-center">
              <p className="text-white/70 text-sm max-w-xs">
                {audioMode
                  ? "Find a comfortable position. Close your eyes when you're ready."
                  : "Find a comfortable position and follow along with Maya's words."}
              </p>
              <button
                onClick={handleBegin}
                disabled={!audioReady}
                className="mt-4 bg-white text-[#032F2B] font-semibold px-8 py-3 rounded-xl transition-opacity disabled:opacity-50 disabled:cursor-wait"
              >
                {!audioReady
                  ? "Maya is getting ready…"
                  : audioMode
                  ? "Begin with Maya's voice →"
                  : "Begin session →"}
              </button>
              {audioMode && audioReady && (
                <button
                  onClick={() => setAudioMode(false)}
                  className="text-white/50 text-xs underline"
                >
                  Read instead
                </button>
              )}
            </div>
          ) : (
            // Session content
            <>
              <p className="mt-6 text-center max-w-lg text-gray-200 leading-relaxed whitespace-pre-wrap">
                {displayedText}
                {isTyping && <span className="animate-pulse">▋</span>}
              </p>

              <div className="flex gap-4 mt-10">
                {isLast ? (
                  <button
                    onClick={skipOrAdvance}
                    className="bg-[#1A8A74] px-5 py-3 rounded-xl"
                  >
                    {audioMode || isTyping ? "Skip →" : "Finish session →"}
                  </button>
                ) : (
                  <button
                    onClick={skipOrAdvance}
                    className="bg-white text-black px-5 py-3 rounded-xl"
                  >
                    {audioMode || isTyping ? "Skip →" : "Next phase →"}
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {/* Phase sidebar */}
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
