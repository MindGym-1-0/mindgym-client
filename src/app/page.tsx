'use client';

import Link from 'next/link';

export default function SplashPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="max-w-md text-center">
        {/* Icon */}
        <div className="mb-12 flex justify-center">
          <div className="w-20 h-20 rounded-full border-2 border-teal-100 flex items-center justify-center">
            <span className="text-4xl">🌿</span>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-h1 font-serif text-ink mb-6">
          Job searching can feel heavy.
        </h1>

        {/* Subtitle */}
        <p className="text-b2 text-ink-60 mb-12">
          MindGym helps you stay calm, confident, and mentally ready — no matter where you are in your search.
        </p>

        {/* CTA Button */}
        <Link
          href="/sign-up"
          className="inline-flex items-center justify-center px-6 py-3 bg-teal-600 text-white font-sans font-medium rounded-lg hover:bg-teal-700 transition-colors"
        >
          Get started
          <span className="ml-2">→</span>
        </Link>
      </div>
    </div>
  );
}
