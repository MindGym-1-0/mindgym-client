'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { exchangeGoogleCode, saveToken } from '@/lib/api';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const errorParam = searchParams.get('error');

        if (errorParam) {
          throw new Error(`Google OAuth error: ${errorParam}`);
        }

        if (!code) {
          throw new Error('No authorization code received from Google');
        }

        // Exchange code for JWT token
        const authResponse = await exchangeGoogleCode(code);

        // Save token
        saveToken(authResponse.access_token);

        // Redirect to onboarding
        router.push('/onboarding');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
        setError(errorMessage);
        setIsLoading(false);

        // Redirect back to sign up after 3 seconds
        setTimeout(() => {
          router.push('/sign-up');
        }, 3000);
      }
    };

    handleCallback();
  }, [searchParams, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-b2 text-ink">Signing you in...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface">
        <div className="text-center max-w-sm">
          <div className="mb-4 text-4xl">❌</div>
          <h1 className="text-h3 font-serif text-ink mb-2">Authentication Failed</h1>
          <p className="text-b2 text-ink-60 mb-6">{error}</p>
          <p className="text-b3 text-ink-60">Redirecting you back to sign up...</p>
        </div>
      </div>
    );
  }

  return null;
}
