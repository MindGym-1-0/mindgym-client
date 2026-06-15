'use client';

interface AuthSidebarProps {
  message: string;
  subtitle: string;
}

export default function AuthSidebar({ message, subtitle }: AuthSidebarProps) {
  return (
    <div
      className="hidden md:flex w-1/2 flex-col items-center justify-center px-12 py-16"
      style={{ background: 'linear-gradient(135deg, #126658 0%, #0D2B26 100%)' }}
    >
      <div className="text-center">
        <div className="mb-10 flex justify-center">
          <img
            src="/vector.png"
            alt="MindGym"
            className="w-36 h-auto object-contain"
          />
        </div>

        {/* Message */}
        <p className="text-2xl font-serif text-white italic mb-4 leading-snug">
          {'"'}{message}{'"'}
        </p>

        {/* Subtitle */}
        <p className="text-xs text-teal-200 tracking-wide">{subtitle}</p>
      </div>
    </div>
  );
}
