"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Role, SessionUser } from "@/types/user";

const STORAGE_KEY = "user-manager-session";

type Options = {
  requiresAuth?: boolean;
  requiresAdmin?: boolean;
};

export function useAuthSession(options: Options = {}) {
  const { requiresAuth = false, requiresAdmin = false } = options;
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      if (requiresAuth) {
        router.replace("/login");
      }
      setIsReady(true);
      return;
    }

    const sessionUser = JSON.parse(raw) as SessionUser;
    const isAdmin = sessionUser.role === "admin";

    if (requiresAdmin && !isAdmin) {
      router.replace("/dashboard");
      setIsReady(true);
      return;
    }

    setUser(sessionUser);
    setIsReady(true);
  }, [pathname, requiresAdmin, requiresAuth, router]);

  function saveSession(sessionUser: SessionUser) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser));
    setUser(sessionUser);
  }

  function clearSession() {
    window.localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    router.push("/login");
  }

  function hasRole(role: Role) {
    return user?.role === role;
  }

  return {
    user,
    isReady,
    isAuthenticated: Boolean(user),
    saveSession,
    clearSession,
    hasRole
  };
}
