'use client';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { establishSupabaseSession } from '@/lib/auth/api';
function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState('');
  useEffect(() => {
    const handleCallback = async () => {
      try {
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        const errorParam = searchParams.get('error');
        const isNewUser = searchParams.get('is_new_user') === 'true';
        if (errorParam) {
          throw new Error(`Google OAuth error: ${errorParam}`);
        }
        if (!accessToken || !refreshToken) {
          throw new Error('Missing tokens in callback');
        }
        await establishSupabaseSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        router.push(isNewUser ? '/onboarding' : '/dashboard');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
        setError(errorMessage);
        setTimeout(() => {
          router.push('/log-in');
        }, 3000);
      }
    };
    handleCallback();
  }, [searchParams, router]);
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface">
        <div className="text-center max-w-sm">
          <div className="mb-4 text-4xl">❌</div>
          <h1 className="text-h3 font-serif text-ink mb-2">Authentication Failed</h1>
          <p className="text-b2 text-ink-60 mb-6">{error}</p>
          <p className="text-b3 text-ink-60">Redirecting you back to sign in...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-surface">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
        <p className="text-b2 text-ink">Signing you in...</p>
      </div>
    </div>
  );
}
export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-surface">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-b2 text-ink">Signing you in...</p>
          </div>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
