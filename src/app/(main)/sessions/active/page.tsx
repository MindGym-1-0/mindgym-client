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
const AUDIO_READY_TIMEOUT_MS = 10000;

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

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentUrlRef = useRef<string | null>(null);
  const nextUrlRef = useRef<string | null>(null);
  const currentPhaseRef = useRef(0);
  const sessionRef = useRef<ActiveSession | null>(null);
  const sessionStartedRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const handlePhaseEndedRef = useRef<() => void>(() => {});
  const phase1LoadIdRef = useRef(0);

  const revokeCurrentUrl = useCallback(() => {
    if (currentUrlRef.current) {
      revokePhaseAudio(currentUrlRef.current);
      currentUrlRef.current = null;
    }
  }, []);

  const revokeNextUrl = useCallback(() => {
    if (nextUrlRef.current) {
      revokePhaseAudio(nextUrlRef.current);
      nextUrlRef.current = null;
    }
  }, []);

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

  const prefetchNextPhase = useCallback((backendPhase: number) => {
    if (!sessionRef.current || backendPhase > 5) return;
    fetchPhaseAudio(sessionRef.current.session_id, backendPhase).then((url) => {
      if (url) nextUrlRef.current = url;
    });
  }, []);

  useEffect(() => {
    handlePhaseEndedRef.current = () => {
      const nextPhaseIndex = currentPhaseRef.current + 1;
      if (nextPhaseIndex >= 5) {
        router.push("/sessions/feedback");
        return;
      }
      revokeCurrentUrl();
      currentPhaseRef.current = nextPhaseIndex;
      setCurrentPhase(nextPhaseIndex);
      if (nextUrlRef.current && audioRef.current) {
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
        prefetchNextPhase(nextPhaseIndex + 2);
      } else {
        setAudioMode(false);
        startTypewriter(nextPhaseIndex);
      }
    };
  }, [router, startTypewriter, prefetchNextPhase, revokeCurrentUrl]);

  useEffect(() => {
    const s = readActive();
    if (!s) {
      router.replace("/sessions");
      return;
    }
    setSession(s);
    sessionRef.current = s;
    currentPhaseRef.current = 0;
    sessionStartedRef.current = false;
    setCurrentPhase(0);
    setSessionStarted(false);
    setAudioMode(true);
    setAudioReady(false);
    setDisplayedText("");
    setIsTyping(false);
    revokeCurrentUrl();
    revokeNextUrl();

    let active = true;
    const loadId = phase1LoadIdRef.current + 1;
    phase1LoadIdRef.current = loadId;
    const fallbackTimer = setTimeout(() => {
      if (!active || phase1LoadIdRef.current !== loadId || currentUrlRef.current) return;
      setAudioMode(false);
      setAudioReady(true);
    }, AUDIO_READY_TIMEOUT_MS);

    fetchPhaseAudio(s.session_id, 1).then((url) => {
      if (!active || phase1LoadIdRef.current !== loadId) {
        if (url) revokePhaseAudio(url);
        return;
      }
      clearTimeout(fallbackTimer);
      if (sessionStartedRef.current) {
        if (url) revokePhaseAudio(url);
        return;
      }
      if (url) {
        revokeCurrentUrl();
        currentUrlRef.current = url;
        setAudioMode(true);
      } else {
        setAudioMode(false);
      }
      setAudioReady(true);
    });

    return () => {
      active = false;
      clearTimeout(fallbackTimer);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeAttribute("src");
        audioRef.current.load();
      }
      revokeCurrentUrl();
      revokeNextUrl();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [router, revokeCurrentUrl, revokeNextUrl]);

  const handleBegin = () => {
    if (!session) return;
    sessionStartedRef.current = true;
    setSessionStarted(true);
    if (audioMode && audioReady && currentUrlRef.current && audioRef.current) {
      audioRef.current.src = currentUrlRef.current;
      audioRef.current.play().catch(() => {
        setAudioMode(false);
        startTypewriter(0);
      });
      setDisplayedText(getPhaseText(session, 0));
      prefetchNextPhase(2);
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
      if (audioRef.current) audioRef.current.pause();
      revokeCurrentUrl();
      if (currentPhase >= 4) {
        router.push("/sessions/feedback");
        return;
      }
      const next = currentPhase + 1;
      currentPhaseRef.current = next;
      setCurrentPhase(next);
      if (nextUrlRef.current && audioRef.current) {
        currentUrlRef.current = nextUrlRef.current;
        nextUrlRef.current = null;
        audioRef.current.src = currentUrlRef.current;
        audioRef.current.play().catch(() => {
          setAudioMode(false);
          startTypewriter(next);
        });
        setDisplayedText(getPhaseText(session!, next));
        prefetchNextPhase(next + 2);
      } else {
        setAudioMode(false);
        startTypewriter(next);
      }
    } else {
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
      <audio
        ref={audioRef}
        onEnded={() => handlePhaseEndedRef.current()}
        preload="auto"
        className="hidden"
      />
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
        <div className="rounded-3xl bg-gradient-to-br from-[#032F2B] to-[#0C6B58] p-10 text-white min-h-[500px] flex flex-col items-center justify-center">
          <div className="text-7xl mb-6">{PHASE_EMOJIS[currentPhase]}</div>
          <h2 className="text-3xl font-semibold">{PHASE_NAMES[currentPhase]}</h2>

          {!sessionStarted ? (
            <div className="mt-8 flex flex-col items-center gap-3 text-center">
              <p className="text-white/70 text-sm max-w-xs">
                {audioMode
                  ? "Find a comfortable position. Close your eyes when you're ready."
                  : "Find a comfortable position and follow along with Maya's words."}
              </p>
              <button
                onClick={handleBegin}
                className="mt-4 bg-white text-[#032F2B] font-semibold px-8 py-3 rounded-xl transition-opacity"
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
            <>
              <p className="mt-6 text-center max-w-lg text-gray-200 leading-relaxed whitespace-pre-wrap">
                {displayedText}
                {isTyping && <span className="animate-pulse">▋</span>}
              </p>
              <div className="flex gap-4 mt-10">
                {isLast ? (
                  <button onClick={skipOrAdvance} className="bg-[#1A8A74] px-5 py-3 rounded-xl">
                    {audioMode || isTyping ? "Skip →" : "Finish session →"}
                  </button>
                ) : (
                  <button onClick={skipOrAdvance} className="bg-white text-black px-5 py-3 rounded-xl">
                    {audioMode || isTyping ? "Skip →" : "Next phase →"}
                  </button>
                )}
              </div>
            </>
          )}
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