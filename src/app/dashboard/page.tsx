"use client";

import Link from "next/link";
import { Avatar, Button, Card, Chip, Separator } from "@heroui/react";
import { ProtectedView } from "@/components/ProtectedView";

export default function DashboardPage() {
  return (
    <ProtectedView>
      {({ user, clearSession, hasRole }) => (
        <main className="app-shell">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 lg:gap-8">
            <Card className="surface-card shadow-none">
              <Card.Content className="px-4 py-4 sm:px-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-11 w-11 bg-slate-900 text-sm font-semibold text-white">
                      <Avatar.Fallback>{getInitials(user?.nombre ?? "U")}</Avatar.Fallback>
                    </Avatar>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900">User Manager</p>
                      <p className="text-sm text-slate-500">Espacio personal</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Chip
                      className={`${getRoleChipClass(user?.role)} rounded-full border px-3`}
                      size="sm"
                      variant="soft"
                    >
                      {getRoleLabel(user?.role)}
                    </Chip>

                    <Button
                      className="h-11 rounded-full border border-slate-200 bg-white/90 px-4 font-medium text-slate-700 shadow-none hover:bg-white"
                      variant="outline"
                      onPress={clearSession}
                    >
                      Cerrar sesion
                    </Button>
                  </div>
                </div>
              </Card.Content>
            </Card>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_360px]">
              <Card className="surface-card shadow-none">
                <Card.Header className="flex flex-col items-start gap-2 px-5 pb-0 pt-6 sm:px-8 sm:pt-8">
                  <p className="eyebrow">Sesion activa</p>
                  <Card.Title className="text-[1.75rem] font-semibold text-slate-900 sm:text-[2rem]">
                    Hola, {user?.nombre}
                  </Card.Title>
                  <Card.Description className="max-w-2xl text-sm leading-6 text-slate-500">
                    Este es tu espacio principal. Aqui puedes revisar la informacion de tu cuenta y los accesos disponibles segun tu rol.
                  </Card.Description>
                </Card.Header>

                <Card.Content className="px-5 pb-5 pt-6 sm:px-8 sm:pb-8">
                  <div className="grid gap-4 md:grid-cols-2">
                    <InfoCard label="Nombre" value={user?.nombre ?? "-"} />
                    <InfoCard label="Correo" value={user?.email ?? "-"} />
                    <InfoCard label="Rol" value={getRoleLabel(user?.role)} />
                    <InfoCard label="Id de usuario" value={user?._id ?? "-"} />
                  </div>

                  <Separator className="my-6 bg-slate-200" />

                  <div className="grid gap-3 sm:grid-cols-3">
                    <StatusCard
                      label="Estado"
                      value="Activo"
                      helper="Tu sesion esta disponible en este navegador."
                    />
                    <StatusCard
                      label="Acceso"
                      value={hasRole("admin") ? "Administrador" : "Usuario"}
                      helper={hasRole("admin") ? "Puedes gestionar usuarios del sistema." : "Tu perfil tiene acceso al panel general."}
                    />
                    <StatusCard
                      label="Navegacion"
                      value="Dashboard"
                      helper="Este panel muestra solo informacion esencial."
                    />
                  </div>
                </Card.Content>
              </Card>

              <Card className="surface-card shadow-none">
                <Card.Header className="flex flex-col items-start gap-2 px-5 pb-0 pt-6 sm:px-6 sm:pt-7">
                  <Card.Title className="text-xl font-semibold text-slate-900">
                    Accesos disponibles
                  </Card.Title>
                  <Card.Description className="text-sm leading-6 text-slate-500">
                    Acciones habilitadas para tu cuenta en este momento.
                  </Card.Description>
                </Card.Header>

                <Card.Content className="grid gap-5 px-5 pb-5 pt-6 sm:px-6 sm:pb-6">
                  <div className="rounded-[28px] border border-slate-100 bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(248,250,252,0.94))] px-4 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-slate-900">Cuenta</p>
                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          {hasRole("admin")
                            ? "Tienes permisos para administrar usuarios."
                            : "Tu cuenta esta activa."}
                        </p>
                      </div>
                      <Chip
                        className={hasRole("admin") ? "rounded-full border border-blue-100 bg-blue-50 text-blue-700" : "rounded-full border border-emerald-100 bg-emerald-50 text-emerald-700"}
                        size="sm"
                        variant="soft"
                      >
                        {hasRole("admin") ? "Admin" : "User"}
                      </Chip>
                    </div>
                  </div>

                  {hasRole("admin") ? (
                    <Link href="/admin/users" className="block">
                      <Button className="h-11 w-full rounded-full bg-slate-900 font-medium text-white shadow-none">
                        Gestionar usuarios
                      </Button>
                    </Link>
                  ) : (
                    <div className="rounded-[28px] border border-slate-100 bg-white/90 px-4 py-4 text-sm text-slate-600">
                      Tu cuenta esta activa.
                    </div>
                  )}
                </Card.Content>
              </Card>
            </div>
          </div>
        </main>
      )}
    </ProtectedView>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="rounded-[28px] border border-slate-100 bg-white/90 shadow-none">
      <Card.Content className="gap-1 px-4 py-4 sm:px-5 sm:py-5">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="break-all text-base font-semibold text-slate-900">{value}</p>
      </Card.Content>
    </Card>
  );
}

function StatusCard({
  label,
  value,
  helper
}: {
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="rounded-[28px] border border-slate-100 bg-white/92 px-4 py-4">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-base font-semibold text-slate-900">{value}</p>
      <p className="mt-1 text-sm leading-6 text-slate-500">{helper}</p>
    </div>
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

function getRoleChipClass(role?: string) {
  return role === "admin"
    ? "border-blue-100 bg-blue-50 text-blue-700"
    : "border-emerald-100 bg-emerald-50 text-emerald-700";
}

function getRoleLabel(role?: string) {
  return role === "admin" ? "Administrador" : "Usuario";
}
