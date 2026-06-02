"use client";

import { Spinner } from "@heroui/spinner";
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
        <Spinner color="warning" label="Cargando sesion..." />
      </div>
    );
  }

  if (!session.user) {
    return null;
  }

  return <>{children(session)}</>;
}
