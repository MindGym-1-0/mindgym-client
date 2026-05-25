const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user_id: string;
  email: string;
}

/**
 * Exchange Google authorization code for JWT token
 */
export async function exchangeGoogleCode(code: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/google/callback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to authenticate with Google');
  }

  return response.json();
}

/**
 * Verify JWT token with backend
 */
export async function verifyToken(token: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/auth/verify`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Token verification failed');
  }

  return response.json();
}

/**
 * Get Google OAuth URL for sign up/login
 */
export function getGoogleAuthUrl(): string {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const redirectUri = `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/auth/callback`;
  
  if (!clientId) {
    throw new Error('Google Client ID not configured');
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid profile email',
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/**
 * Store JWT token in localStorage
 */
export function saveToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token);
  }
}

/**
 * Get JWT token from localStorage
 */
export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
}

/**
 * Clear JWT token from localStorage
 */
export function clearToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getToken() !== null;
}
