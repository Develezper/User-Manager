"use client";

import { Spinner } from "@heroui/react";
import { useAuthSession } from "@/hooks/useAuthSession";

type ProtectedViewProps = {
  children: (session: ReturnType<typeof useAuthSession>) => React.ReactNode;
  requiresAdmin?: boolean;
};

export function ProtectedView({ children, requiresAdmin = false }: ProtectedViewProps) {
  const session = useAuthSession({ requiresAuth: true, requiresAdmin });

  if (!session.isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Spinner />
          <p className="text-sm text-black/60">Cargando sesion...</p>
        </div>
      </div>
    );
  }

  if (!session.user) {
    return null;
  }

  return <>{children(session)}</>;
}
