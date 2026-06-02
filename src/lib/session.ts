import type { SessionUser } from "@/types/user";

export const SESSION_STORAGE_KEY = "user-manager-session";
const SESSION_HEADER_KEY = "x-user-session";

export function getClientSessionHeaders() {
  if (typeof window === "undefined") {
    return {} as Record<string, string>;
  }

  const rawSession = window.localStorage.getItem(SESSION_STORAGE_KEY);

  if (!rawSession) {
    return {} as Record<string, string>;
  }

  return {
    [SESSION_HEADER_KEY]: rawSession
  } satisfies Record<string, string>;
}

export function getSessionFromRequest(request: Request): SessionUser | null {
  const rawSession = request.headers.get(SESSION_HEADER_KEY);

  if (!rawSession) {
    return null;
  }

  try {
    return JSON.parse(rawSession) as SessionUser;
  } catch {
    return null;
  }
}
