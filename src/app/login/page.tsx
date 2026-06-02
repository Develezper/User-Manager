"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Button, Card, CardContent, Chip } from "@heroui/react";
import { login } from "@/services/authService";
import { useAuthSession } from "@/hooks/useAuthSession";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const { saveSession, isAuthenticated, isReady, user } = useAuthSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");
      const sessionUser = await login({ email, password });
      saveSession(sessionUser);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Email o contrasena incorrectos.");
    } finally {
      setLoading(false);
    }
  }

  if (isReady && isAuthenticated && user) {
    router.replace("/dashboard");
    return null;
  }

  return (
    <main className="shell overflow-hidden">
      <div className="noise" />
      <div className="frame grid min-h-[calc(100vh-48px)] gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="panel shadow-cut flex flex-col justify-between gap-10 overflow-hidden p-8 lg:p-12">
          <div className="flex flex-wrap items-center gap-3">
            <Chip className="bg-black text-white" variant="primary">
              User Manager
            </Chip>
            <Chip className="bg-[var(--accent-soft)] text-black" variant="soft">
              Login protegido
            </Chip>
          </div>

          <div className="max-w-2xl">
            <p className="mb-4 text-xs uppercase tracking-[0.4em] text-black/45">
              Puerta de acceso
            </p>
            <h1 className="editorial-title text-5xl leading-none md:text-7xl">
              Un panel de usuarios con vibra de estudio creativo, no de formulario generico.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-black/68">
              Inicia sesion para entrar al dashboard y administrar perfiles. La interfaz mezcla
              bloques editoriales, color y contraste para que no parezca el clasico front de CRUD.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="rounded-[24px] border border-black/5 bg-white/80">
              <CardContent className="gap-2 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-black/40">Ruta</p>
                <p className="text-lg font-semibold">/dashboard</p>
              </CardContent>
            </Card>
            <Card className="rounded-[24px] border border-black/5 bg-white/80">
              <CardContent className="gap-2 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-black/40">Stack</p>
                <p className="text-lg font-semibold">Next + Hero UI</p>
              </CardContent>
            </Card>
            <Card className="rounded-[24px] border border-black/5 bg-white/80">
              <CardContent className="gap-2 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-black/40">Control</p>
                <p className="text-lg font-semibold">Sesion local</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="panel flex items-center p-4 md:p-6">
          <Card className="w-full rounded-[28px] border border-black/5 bg-white/88">
            <CardContent className="gap-6 p-7">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-black/45">Acceso</p>
                <h2 className="editorial-title mt-3 text-4xl">Iniciar sesion</h2>
              </div>

              <form className="grid gap-5" onSubmit={handleSubmit}>
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-black/80">Email</span>
                  <input
                    required
                    className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-black/30"
                    placeholder="admin@empresa.com"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-black/80">Password</span>
                  <input
                    required
                    className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-black/30"
                    placeholder="Tu password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </label>

                {error ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                ) : null}

                <Button
                  className="h-14 bg-black text-base text-white"
                  isDisabled={loading}
                  type="submit"
                >
                  {loading ? "Entrando..." : "Entrar al dashboard"}
                </Button>
              </form>

              <div className="rounded-[24px] bg-[var(--accent-soft)] p-5 text-sm leading-7 text-black/75">
                <p className="font-semibold text-black">Tip de entrega</p>
                <p>
                  Cuando ingreses como admin veras acceso a la consola de usuarios con tarjetas
                  reutilizables y gestion CRUD.
                </p>
                <Link className="mt-2 inline-block font-semibold underline" href="/dashboard">
                  Ir directo si ya tienes sesion
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
