"use client";

import Link from "next/link";
import { Button, Card, CardContent, Chip } from "@heroui/react";
import { ProtectedView } from "@/components/ProtectedView";

export default function DashboardPage() {
  return (
    <ProtectedView>
      {({ user, clearSession, hasRole }) => (
        <main className="shell">
          <div className="noise" />
          <div className="frame grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="panel shadow-cut p-8 lg:p-10">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-black/45">
                    Dashboard protegido
                  </p>
                  <h1 className="editorial-title mt-3 text-5xl md:text-6xl">
                    Hola, {user?.nombre}
                  </h1>
                </div>
                <Button
                  className="border border-black/10 bg-white text-black"
                  variant="outline"
                  onPress={clearSession}
                >
                  Cerrar sesion
                </Button>
              </div>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-black/68">
                Este espacio resume tu sesion activa y te mueve por la app segun tu rol. Todo el
                control de acceso vive en un custom hook para que la logica no ensucie las vistas.
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <Card className="rounded-[26px] border border-black/5 bg-white/85">
                  <CardContent className="gap-2 p-5">
                    <p className="text-xs uppercase tracking-[0.3em] text-black/40">Nombre</p>
                    <p className="text-lg font-semibold">{user?.nombre}</p>
                  </CardContent>
                </Card>
                <Card className="rounded-[26px] border border-black/5 bg-white/85">
                  <CardContent className="gap-2 p-5">
                    <p className="text-xs uppercase tracking-[0.3em] text-black/40">Email</p>
                    <p className="text-lg font-semibold">{user?.email}</p>
                  </CardContent>
                </Card>
                <Card className="rounded-[26px] border border-black/5 bg-white/85">
                  <CardContent className="gap-2 p-5">
                    <p className="text-xs uppercase tracking-[0.3em] text-black/40">Rol</p>
                    <div className="flex items-center gap-3">
                      <span className={`status-dot ${user?.role}`} />
                      <p className="text-lg font-semibold capitalize">{user?.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="grid gap-6">
              <Card className="panel rounded-[32px] border border-black/5 bg-white/80">
                <CardContent className="gap-4 p-8">
                  <Chip className="bg-[var(--accent-soft)] text-black" variant="soft">
                    Navegacion
                  </Chip>
                  <h2 className="editorial-title text-4xl">Tus siguientes movimientos</h2>
                  <div className="grid gap-3">
                    <Link href="/login">
                      <Button className="w-full justify-start bg-black text-white">
                        Volver al acceso
                      </Button>
                    </Link>
                    {hasRole("admin") ? (
                      <Link href="/admin/users">
                        <Button
                          className="w-full justify-start bg-[var(--accent)] text-black"
                        >
                          Abrir administracion de usuarios
                        </Button>
                      </Link>
                    ) : (
                      <div className="rounded-[22px] border border-black/8 bg-zinc-100 px-4 py-4 text-sm text-black/70">
                        Tu rol actual es user. Solo los administradores pueden entrar a
                        <span className="font-semibold"> /admin/users</span>.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[32px] border border-black/5 bg-[linear-gradient(135deg,#111827,#1f2937)] text-white">
                <CardContent className="gap-4 p-8">
                  <p className="text-xs uppercase tracking-[0.35em] text-white/60">Arquitectura</p>
                  <p className="text-lg leading-8 text-white/80">
                    Servicios separados, rutas API, MongoDB con Mongoose, login persistido en
                    localStorage y componentes Hero UI usados sin caer en la estetica clasica.
                  </p>
                </CardContent>
              </Card>
            </section>
          </div>
        </main>
      )}
    </ProtectedView>
  );
}
