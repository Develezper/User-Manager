"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Button, Card, Input, Label, TextField } from "@heroui/react";
import { register } from "@/services/authService";
import { useAuthSession } from "@/hooks/useAuthSession";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const { saveSession, isAuthenticated, isReady, user } = useAuthSession();
  const [nombre, setNombre] = useState("");
  const [cc, setCc] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");
      const sessionUser = await register({ nombre, cc, email, password });
      saveSession(sessionUser);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No fue posible crear la cuenta.");
    } finally {
      setLoading(false);
    }
  }

  if (isReady && isAuthenticated && user) {
    router.replace("/dashboard");
    return null;
  }

  return (
    <main className="app-shell flex items-center justify-center py-10">
      <div className="app-frame flex w-full justify-center">
        <Card className="w-full max-w-xl border border-slate-200/80 bg-white/90 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur">
          <Card.Header className="flex flex-col items-center gap-3 px-6 pt-8 text-center sm:px-8">
            <div className="space-y-2">
              <Card.Title className="text-3xl font-semibold tracking-[-0.03em] text-slate-900 sm:text-4xl">
                Crear cuenta
              </Card.Title>
              <Card.Description className="text-sm leading-6 text-slate-500 sm:text-base">
                Registra un nuevo usuario para entrar al dashboard.
              </Card.Description>
            </div>
          </Card.Header>

          <Card.Content className="px-6 pb-6 pt-2 sm:px-8 sm:pb-8">
            <form className="grid gap-5" onSubmit={handleSubmit}>
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField className="grid gap-2">
                  <Label className="text-sm font-medium text-slate-700">Nombre</Label>
                  <Input
                    required
                    className="mt-2"
                    placeholder="Tu nombre completo"
                    value={nombre}
                    onChange={(event) => setNombre(event.target.value)}
                  />
                </TextField>

                <TextField className="grid gap-2">
                  <Label className="text-sm font-medium text-slate-700">Cedula</Label>
                  <Input
                    required
                    className="mt-2"
                    placeholder="Tu documento"
                    value={cc}
                    onChange={(event) => setCc(event.target.value)}
                  />
                </TextField>
              </div>

              <TextField className="grid gap-2">
                <Label className="text-sm font-medium text-slate-700">Email</Label>
                <Input
                  required
                  className="mt-2"
                  placeholder="correo@empresa.com"
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
                  placeholder="Minimo 6 caracteres"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </TextField>

              {error ? <div className="message-error">{error}</div> : null}

              <Button className="mt-2 h-14 bg-slate-900 text-base text-white" isDisabled={loading} type="submit">
                {loading ? "Creando cuenta..." : "Registrarme"}
              </Button>
            </form>
          </Card.Content>

          <Card.Footer className="justify-center px-6 pb-8 pt-0 sm:px-8">
            <p className="text-center text-sm text-slate-500">
              ¿Ya tienes cuenta?{" "}
              <Link className="font-semibold text-slate-900 underline-offset-4 hover:underline" href="/login">
                Inicia sesion
              </Link>
            </p>
          </Card.Footer>
        </Card>
      </div>
    </main>
  );
}
