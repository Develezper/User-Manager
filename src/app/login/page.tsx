"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Button, Card, Input, Label, TextField } from "@heroui/react";
import { login } from "@/services/authService";
import { useAuthSession } from "@/hooks/useAuthSession";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { saveSession, isAuthenticated, isReady, user } = useAuthSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isReady && isAuthenticated && user) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isReady, router, user]);

  useEffect(() => {
    if (searchParams.get("registered") === "1") {
      setMessage("Cuenta creada correctamente. Ya puedes iniciar sesion.");

      const email = searchParams.get("email");
      if (email) {
        setEmail(email);
      }
    }
  }, [searchParams]);

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
    return null;
  }

  return (
    <main className="app-shell flex items-center justify-center overflow-hidden">
      <div className="app-frame flex w-full justify-center">
        <Card className="w-full max-w-md border border-slate-300/80 bg-white/92 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur">
          <Card.Header className="flex flex-col items-center gap-2 px-6 pt-8 text-center sm:px-8">
            <div className="space-y-4">
              <Card.Title className="text-3xl font-semibold tracking-[-0.03em] text-slate-900 sm:text-4xl">
                User Manager
              </Card.Title>
              <Card.Description className="text-sm leading-6 text-slate-500 sm:text-base">
                Inicia sesion para gestionar usuarios y acceder al dashboard.
              </Card.Description>
            </div>
          </Card.Header>

          <Card.Content className="px-6 pb-6 pt-2 sm:px-8 sm:pb-8">
            <form className="grid gap-5" onSubmit={handleSubmit}>
              <TextField className="grid gap-2">
                <Label className="text-sm font-medium text-slate-700">Email</Label>
                <Input
                  required
                  className="mt-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] outline-none transition-all placeholder:text-slate-400 hover:border-slate-400 hover:bg-slate-50 focus:border-slate-500"
                  placeholder="admin@empresa.com"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </TextField>

              <TextField className="grid gap-2">
                <Label className="text-sm font-medium text-slate-700">Password</Label>
                <Input
                  required
                  className="mt-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] outline-none transition-all placeholder:text-slate-400 hover:border-slate-400 hover:bg-slate-50 focus:border-slate-500"
                  placeholder="Tu password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </TextField>

              {error ? <div className="message-error">{error}</div> : null}
              {message ? <div className="message-muted">{message}</div> : null}

              <Button className="mt-2 h-14 rounded-2xl border border-slate-900 bg-slate-900 text-base text-white transition-all hover:border-slate-800 hover:bg-slate-800" isDisabled={loading} type="submit">
                {loading ? "Iniciando..." : "Iniciar sesion"}
              </Button>
            </form>
          </Card.Content>
          <Card.Footer className="justify-center px-6 pb-8 pt-0 sm:px-8">
            <div className="flex w-full flex-col items-center gap-3 text-center">
              <p className="max-w-sm text-sm leading-6 text-slate-500">
                Si eres nuevo, crea tu cuenta desde el registro. Si ya tienes acceso, inicia sesion para entrar al dashboard.
              </p>

              <Link
                className="inline-flex h-11 items-center justify-center px-5 text-sm font-medium text-slate-700 transition-all hover:text-slate-900 hover:underline"
                href="/register"
              >
                Ir a registro
              </Link>
            </div>
          </Card.Footer>
        </Card>
      </div>
    </main>
  );
}
