'use client';

import { useState, useEffect } from 'react';
import AuthSidebar from '@/components/AuthSidebar';
import Link from 'next/link';

export default function AuthVerifyPage() {
  const [code, setCode] = useState(['', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(4 * 60); // 4 minutes
  const [isResent, setIsResent] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next field
    if (value && index < 4) {
      const nextInput = document.getElementById(`code-${index + 1}`) as HTMLInputElement;
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`) as HTMLInputElement;
      prevInput?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle verification
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Verification Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-12 bg-surface">
        <div className="w-full max-w-sm">
          {/* Logo and Progress */}
          <div className="mb-12">
            <h1 className="text-h2 font-serif text-ink mb-2">MindGym</h1>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-teal-600"></div>
              <div className="w-2 h-2 rounded-full bg-teal-600"></div>
              <div className="w-2 h-2 rounded-full bg-teal-100"></div>
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-h3 font-serif text-ink mb-2">Check your email</h2>
          <p className="text-b3 text-ink-60 mb-2">We sent a 6-digit code to</p>
          <p className="text-b3 text-ink font-medium mb-8">Claire@gmail.com</p>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Code inputs */}
            <div className="flex gap-2 mb-6">
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  maxLength={1}
                  className="w-12 h-12 border-2 border-teal-600 rounded-lg text-center text-h4 font-sans font-medium text-ink focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              ))}
            </div>

            {/* Timer */}
            <div className="px-4 py-2 bg-teal-10 rounded-lg text-b3 text-ink-60 mb-6 flex items-center">
              <span className="mr-2">🕐</span>
              Code expires in {formatTime(timeLeft)}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full px-4 py-3 bg-teal-600 text-white font-sans font-medium rounded-lg hover:bg-teal-700 transition-colors mb-4"
            >
              Verify email →
            </button>
          </form>

          {/* Help options */}
          <div className="flex items-center justify-between mb-8">
            <button className="text-b4 text-ink-60 hover:text-ink">
              Didn't receive it? Resend code
            </button>
          </div>

          {/* Link to change email */}
          <Link href="/sign-up" className="flex items-center text-b4 text-teal-600 hover:text-teal-700">
            ← Change email
          </Link>

          {/* Info text */}
          <p className="text-b4 text-ink-60 mt-8">
            Check your spam folder if you don't see it within a minute. The code is valid for 10 minutes.
          </p>
        </div>
      </div>

      {/* Right side - Sidebar */}
      <AuthSidebar
        message="One step closer. You're already doing the hard part."
        subtitle="MindGym · Built for job seekers"
      />
    </div>
  );
}
