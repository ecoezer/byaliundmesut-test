const MONITOR_PASSWORD = 'Ds99F7kJtBscpX';
const SESSION_KEY = 'monitor_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000;

interface MonitorSession {
  authenticated: boolean;
  expiresAt: number;
}

export const monitorAuth = {
  login: (password: string): boolean => {
    if (password === MONITOR_PASSWORD) {
      const session: MonitorSession = {
        authenticated: true,
        expiresAt: Date.now() + SESSION_DURATION
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      return true;
    }
    return false;
  },

  logout: (): void => {
    localStorage.removeItem(SESSION_KEY);
  },

  isAuthenticated: (): boolean => {
    const sessionData = localStorage.getItem(SESSION_KEY);
    if (!sessionData) return false;

    try {
      const session: MonitorSession = JSON.parse(sessionData);
      if (session.authenticated && session.expiresAt > Date.now()) {
        return true;
      }
      monitorAuth.logout();
      return false;
    } catch {
      return false;
    }
  }
};
