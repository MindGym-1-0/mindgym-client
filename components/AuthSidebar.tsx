'use client';

interface AuthSidebarProps {
  message: string;
  subtitle: string;
}

export default function AuthSidebar({ message, subtitle }: AuthSidebarProps) {
  return (
    <div className="hidden md:flex w-1/2 bg-teal-600 flex-col items-center justify-center px-12 py-16" style={{ background: 'linear-gradient(135deg, #126658 0%, #0D2B26 100%)' }}>
      <div className="text-center">
        {/* Leaf icon circle */}
        <div className="mb-12 flex justify-center">
          <div className="w-24 h-24 rounded-full border-2 border-teal-100 flex items-center justify-center">
            <span className="text-4xl">🌿</span>
          </div>
        </div>
        
        {/* Message */}
        <p className="text-2xl font-serif text-white italic mb-6">
          "{message}"
        </p>
        
        {/* Subtitle */}
        <p className="text-sm text-teal-50">{subtitle}</p>
      </div>
    </div>
  );
}
