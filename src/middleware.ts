import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const AUTH_ROUTES = new Set(["/login", "/sign-up", "/auth/callback"]);
const PROTECTED_ROUTES = ["/dashboard", "/onboarding"];
const BACKEND_AUTH_COOKIE_KEYS = ["access_token", "refresh_token"] as const;

function isProtectedRoute(pathname: string) {
  return PROTECTED_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

function hasBackendAuthCookie(request: NextRequest) {
  return BACKEND_AUTH_COOKIE_KEYS.some((key) => {
    const value = request.cookies.get(key)?.value;
    return Boolean(value && value.trim());
  });
}

async function hasSupabaseSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) return false;

  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({ name, value, ...options });
        response = NextResponse.next({ request });
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({ name, value: "", ...options });
        response = NextResponse.next({ request });
        response.cookies.set({ name, value: "", ...options });
      }
    }
  });

  const {
    data: { user }
  } = await supabase.auth.getUser();

  return Boolean(user);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthRoute = AUTH_ROUTES.has(pathname);
  const requiresAuth = isProtectedRoute(pathname);

  const backendCookieAuth = hasBackendAuthCookie(request);
  const supabaseAuth = backendCookieAuth ? false : await hasSupabaseSession(request);
  const isAuthenticated = backendCookieAuth || supabaseAuth;

  if (process.env.NODE_ENV !== "production") {
    console.info("[auth-middleware]", {
      path: pathname,
      requiresAuth,
      isAuthRoute,
      hasAccessCookie: Boolean(request.cookies.get("access_token")?.value),
      hasRefreshCookie: Boolean(request.cookies.get("refresh_token")?.value),
      supabaseAuth,
      isAuthenticated
    });
  }

  if (!isAuthenticated && requiresAuth) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (isAuthenticated && isAuthRoute && pathname !== "/auth/callback") {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"]
};
