"use client";

import Link from "next/link";
import { Avatar, Button, Card, Chip, Header } from "@heroui/react";
import { ProtectedView } from "@/components/ProtectedView";

export default function DashboardPage() {
  return (
    <ProtectedView>
      {({ user, clearSession, hasRole }) => (
        <main className="app-shell">
          <div className="app-frame space-y-6">
            <Card className="border border-slate-200/80 bg-white/80 shadow-none backdrop-blur">
              <Card.Content className="p-3 sm:p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="bg-slate-900 text-white">
                      <Avatar.Fallback>{getInitials(user?.nombre ?? "U")}</Avatar.Fallback>
                    </Avatar>
                    <Header className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-900">User Manager</span>
                      <span className="text-sm text-slate-500">Dashboard</span>
                    </Header>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Chip
                      className={user?.role === "admin" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"}
                      size="sm"
                      variant="soft"
                    >
                      {user?.role}
                    </Chip>
                    <Button
                      className="border border-slate-200 bg-white text-slate-800"
                      variant="outline"
                      onPress={clearSession}
                    >
                      Cerrar sesion
                    </Button>
                  </div>
                </div>
              </Card.Content>
            </Card>

            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <Card className="border border-slate-200/80 bg-white/88 shadow-none">
                <Card.Header className="flex flex-col items-start gap-2 p-6 sm:p-8">
                  <p className="eyebrow">Resumen</p>
                  <Card.Title className="text-3xl font-semibold tracking-[-0.03em] text-slate-900 sm:text-4xl">
                    Hola, {user?.nombre}
                  </Card.Title>
                  <Card.Description className="text-sm leading-6 text-slate-500 sm:text-base">
                    Tu sesion esta activa. Desde aqui puedes revisar tu perfil y continuar segun tu rol.
                  </Card.Description>
                </Card.Header>
                <Card.Content className="grid gap-4 p-6 pt-0 sm:grid-cols-3 sm:p-8 sm:pt-0">
                  <InfoCard label="Nombre" value={user?.nombre ?? ""} />
                  <InfoCard label="Email" value={user?.email ?? ""} />
                  <Card className="border border-slate-200 bg-slate-50 shadow-none">
                    <Card.Content className="gap-2 p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Rol
                      </p>
                      <div className="flex items-center gap-3">
                        <span className={`status-dot ${user?.role}`} />
                        <p className="text-lg font-semibold capitalize text-slate-900">{user?.role}</p>
                      </div>
                    </Card.Content>
                  </Card>
                </Card.Content>
              </Card>

              <div className="grid gap-6">
                <Card className="border border-slate-200/80 bg-white/88 shadow-none">
                  <Card.Header className="flex items-center justify-between gap-3 p-6 sm:p-8">
                    <div>
                      <p className="eyebrow">Navegacion</p>
                      <Card.Title className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-900">
                        Accesos
                      </Card.Title>
                    </div>
                    <Chip className="bg-slate-100 text-slate-700" size="sm" variant="soft">
                      {hasRole("admin") ? "Admin" : "User"}
                    </Chip>
                  </Card.Header>
                  <Card.Content className="grid gap-3 p-6 pt-0 sm:p-8 sm:pt-0">
                    <Link href="/login">
                      <Button className="w-full justify-start bg-slate-900 text-white">
                        Volver al login
                      </Button>
                    </Link>
                    {hasRole("admin") ? (
                      <Link href="/admin/users">
                        <Button className="w-full justify-start bg-blue-600 text-white">
                          Administrar usuarios
                        </Button>
                      </Link>
                    ) : (
                      <div className="message-muted">
                        Solo los administradores pueden acceder a <span className="font-semibold">/admin/users</span>.
                      </div>
                    )}
                  </Card.Content>
                </Card>

                <Card className="border border-slate-200/80 bg-slate-900 text-white shadow-none">
                  <Card.Content className="gap-2 p-6 sm:p-8">
                    <p className="eyebrow text-slate-400">Estado de sesion</p>
                    <p className="text-lg font-medium text-white">
                      Acceso activo con persistencia local y control por rol.
                    </p>
                  </Card.Content>
                </Card>
              </div>
            </div>
          </div>
        </main>
      )}
    </ProtectedView>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="border border-slate-200 bg-slate-50 shadow-none">
      <Card.Content className="gap-2 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
        <p className="text-lg font-semibold text-slate-900">{value}</p>
      </Card.Content>
    </Card>
  );
}

function getInitials(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
