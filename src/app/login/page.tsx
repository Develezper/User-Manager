"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Button, Card, Input, Label, TextField } from "@heroui/react";
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
    <main className="app-shell flex items-center justify-center overflow-hidden">
      <div className="app-frame flex w-full justify-center">
        <Card className="w-full max-w-md border border-slate-200/80 bg-white/90 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur">
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
                  className="mt-2"
                  classNames={{
                    inputWrapper:
                      "border border-slate-300 bg-white shadow-none transition-colors hover:border-slate-400 data-[focus=true]:border-slate-500",
                    input: "text-slate-900 placeholder:text-slate-400",
                  }}
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
                  className="mt-2"
                  classNames={{
                    inputWrapper:
                      "border border-slate-300 bg-white shadow-none transition-colors hover:border-slate-400 data-[focus=true]:border-slate-500",
                    input: "text-slate-900 placeholder:text-slate-400",
                  }}
                  placeholder="Tu password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </TextField>

              {error ? <div className="message-error">{error}</div> : null}

              <Button className="mt-2 h-14 bg-slate-900 text-base text-white" isDisabled={loading} type="submit">
                {loading ? "Iniciando..." : "Iniciar sesion"}
              </Button>
            </form>
          </Card.Content>
          <Card.Footer className="justify-center px-6 pb-8 pt-0 sm:px-8">
            <p className="text-center text-sm text-slate-500">
              ¿No tienes cuenta?{" "}
              <Link className="font-semibold text-slate-900 underline-offset-4 hover:underline" href="/register">
                Registrate aqui
              </Link>
            </p>
          </Card.Footer>
        </Card>
      </div>
    </main>
  );
}
