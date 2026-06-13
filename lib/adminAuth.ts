'use client';

const SESSION_KEY = 'admin_session';
const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days

export function loginAdmin(password: string): boolean {
  const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'alhuda2026';
  if (password === adminPass) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(SESSION_KEY, JSON.stringify({
        loggedIn: true,
        expires: Date.now() + SESSION_DURATION,
      }));
    }
    return true;
  }
  return false;
}

export function isAdminLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const session = localStorage.getItem(SESSION_KEY);
    if (!session) return false;
    const { loggedIn, expires } = JSON.parse(session);
    if (!loggedIn || Date.now() > expires) {
      localStorage.removeItem(SESSION_KEY);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function logoutAdmin(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY);
  }
}
