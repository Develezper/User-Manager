"use client";

import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import type { Role, User, UserFormPayload } from "@/types/user";

const initialState: UserFormPayload = {
  nombre: "",
  cc: "",
  email: "",
  password: "",
  role: "user"
};

type UserFormProps = {
  editingUser: User | null;
  busy: boolean;
  onCancel: () => void;
  onSubmit: (payload: UserFormPayload) => Promise<void>;
};

export function UserForm({ editingUser, busy, onCancel, onSubmit }: UserFormProps) {
  const [form, setForm] = useState<UserFormPayload>(initialState);

  useEffect(() => {
    if (!editingUser) {
      setForm(initialState);
      return;
    }

    setForm({
      nombre: editingUser.nombre,
      cc: editingUser.cc,
      email: editingUser.email,
      password: "",
      role: editingUser.role
    });
  }, [editingUser]);

  function updateField<K extends keyof UserFormPayload>(key: K, value: UserFormPayload[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit(form);

    if (!editingUser) {
      setForm(initialState);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <Field label="Nombre">
        <input
          required
          className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-black/30"
          placeholder="Ej. Valentina Alvarez"
          value={form.nombre}
          onChange={(event) => updateField("nombre", event.target.value)}
        />
      </Field>
      <Field label="Cedula">
        <input
          required
          className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-black/30"
          placeholder="Ej. 1098123456"
          value={form.cc}
          onChange={(event) => updateField("cc", event.target.value)}
        />
      </Field>
      <Field label="Email">
        <input
          required
          className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-black/30"
          placeholder="Ej. valentina@empresa.com"
          type="email"
          value={form.email}
          onChange={(event) => updateField("email", event.target.value)}
        />
      </Field>
      <Field label={editingUser ? "Nueva password" : "Password"}>
        <input
          required={!editingUser}
          className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-black/30"
          placeholder={editingUser ? "Dejar vacio para conservar la actual" : "Minimo 6 caracteres"}
          type="password"
          value={form.password}
          onChange={(event) => updateField("password", event.target.value)}
        />
      </Field>
      <Field label="Rol">
        <div className="grid gap-3 sm:grid-cols-2">
          {(["user", "admin"] as Role[]).map((role) => (
            <label
              key={role}
              className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition ${
                form.role === role
                  ? "border-black bg-black text-white"
                  : "border-black/10 bg-white text-black"
              }`}
            >
              <input
                checked={form.role === role}
                className="sr-only"
                name="role"
                type="radio"
                value={role}
                onChange={() => updateField("role", role)}
              />
              <span className="text-sm font-medium capitalize">{role}</span>
            </label>
          ))}
        </div>
      </Field>

      <div className="flex flex-wrap gap-3 pt-2">
        <Button
          className="bg-[var(--accent)] text-black"
          isDisabled={busy}
          type="submit"
        >
          {busy ? "Guardando..." : editingUser ? "Guardar cambios" : "Crear usuario"}
        </Button>
        {editingUser ? (
          <Button
            className="border border-black/10 bg-white text-black"
            type="button"
            variant="outline"
            onPress={onCancel}
          >
            Cancelar edicion
          </Button>
        ) : null}
      </div>
    </form>
  );
}

function Field({
  label,
  children
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-black/80">{label}</span>
      {children}
    </label>
  );
}
