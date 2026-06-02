"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Card, Input, Label, TextField } from "@heroui/react";
import { register } from "@/services/authService";

export default function RegisterPage() {
  const router = useRouter();
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

      router.push(`/login?registered=1&email=${encodeURIComponent(sessionUser.email)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No fue posible crear la cuenta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="app-shell flex items-center justify-center overflow-hidden">
      <div className="app-frame flex w-full justify-center">
        <Card className="w-full max-w-lg border border-slate-300/80 bg-white/92 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur">
          <Card.Header className="flex flex-col items-center gap-2 px-6 pt-8 text-center sm:px-8">
            <div className="space-y-4">
              <Card.Title className="text-3xl font-semibold tracking-[-0.03em] text-slate-900 sm:text-4xl">
                Crear cuenta
              </Card.Title>
              <Card.Description className="text-sm leading-6 text-slate-500 sm:text-base">
                Completa tus datos para registrarte. Tu acceso se creara con rol de usuario normal.
              </Card.Description>
            </div>
          </Card.Header>

          <Card.Content className="px-6 pb-6 pt-2 sm:px-8 sm:pb-8">
            <form className="grid gap-5" onSubmit={handleSubmit}>
              <TextField className="grid gap-2">
                <Label className="text-sm font-medium text-slate-700">Nombre</Label>
                <Input
                  required
                  className="mt-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] outline-none transition-all placeholder:text-slate-400 hover:border-slate-400 hover:bg-slate-50 focus:border-slate-500"
                  placeholder="Valentina Alvarez"
                  value={nombre}
                  onChange={(event) => setNombre(event.target.value)}
                />
              </TextField>

              <TextField className="grid gap-2">
                <Label className="text-sm font-medium text-slate-700">Cedula</Label>
                <Input
                  required
                  className="mt-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] outline-none transition-all placeholder:text-slate-400 hover:border-slate-400 hover:bg-slate-50 focus:border-slate-500"
                  placeholder="1098123456"
                  value={cc}
                  onChange={(event) => setCc(event.target.value)}
                />
              </TextField>

              <TextField className="grid gap-2">
                <Label className="text-sm font-medium text-slate-700">Email</Label>
                <Input
                  required
                  className="mt-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] outline-none transition-all placeholder:text-slate-400 hover:border-slate-400 hover:bg-slate-50 focus:border-slate-500"
                  placeholder="usuario@empresa.com"
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
                  placeholder="Minimo 6 caracteres"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </TextField>

              {error ? <div className="message-error">{error}</div> : null}
              <Button
                className="mt-2 h-14 rounded-2xl border border-slate-900 bg-slate-900 text-base text-white transition-all hover:border-slate-800 hover:bg-slate-800"
                isDisabled={loading}
                type="submit"
              >
                {loading ? "Creando..." : "Crear cuenta"}
              </Button>
            </form>
          </Card.Content>
          <Card.Footer className="justify-center px-6 pb-8 pt-0 sm:px-8">
            <div className="flex flex-col items-center gap-3 text-center">
              <p className="text-sm text-slate-500">
                Si ya tienes una cuenta, puedes entrar directamente al login.
              </p>
              <Link className="text-sm font-medium text-slate-700 underline-offset-4 hover:underline" href="/login">
                Volver al login
              </Link>
            </div>
          </Card.Footer>
        </Card>
      </div>
    </main>
  );
}
