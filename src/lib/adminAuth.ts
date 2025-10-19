const ADMIN_PASSWORD = 'Zb^73ZnP9T%Hr!';
const SESSION_KEY = 'admin_session';
const SESSION_DURATION = 2 * 60 * 60 * 1000;

export function checkAdminAuth(): boolean {
  const sessionData = localStorage.getItem(SESSION_KEY);
  if (!sessionData) return false;

  try {
    const { timestamp } = JSON.parse(sessionData);
    const now = Date.now();

    if (now - timestamp > SESSION_DURATION) {
      localStorage.removeItem(SESSION_KEY);
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export function loginAdmin(password: string): boolean {
  if (password === ADMIN_PASSWORD) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ timestamp: Date.now() }));
    return true;
  }
  return false;
}

export function logoutAdmin(): void {
  localStorage.removeItem(SESSION_KEY);
}
