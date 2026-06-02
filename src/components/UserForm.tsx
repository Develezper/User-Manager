"use client";

import { useEffect, useState } from "react";
import { Button, Input, Label, ListBox, Select, TextField } from "@heroui/react";
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
        <Input
          required
          className="mt-2"
          placeholder="Ej. Valentina Alvarez"
          value={form.nombre}
          onChange={(event) => updateField("nombre", event.target.value)}
        />
      </Field>
      <Field label="Cedula">
        <Input
          required
          className="mt-2"
          placeholder="Ej. 1098123456"
          value={form.cc}
          onChange={(event) => updateField("cc", event.target.value)}
        />
      </Field>
      <Field label="Email">
        <Input
          required
          className="mt-2"
          placeholder="Ej. valentina@empresa.com"
          type="email"
          value={form.email}
          onChange={(event) => updateField("email", event.target.value)}
        />
      </Field>
      <Field label={editingUser ? "Nueva password" : "Password"}>
        <Input
          required={!editingUser}
          className="mt-2"
          placeholder={editingUser ? "Dejar vacio para conservar la actual" : "Minimo 6 caracteres"}
          type="password"
          value={form.password}
          onChange={(event) => updateField("password", event.target.value)}
        />
      </Field>
      <div className="grid gap-2">
        <Label className="text-sm font-medium text-slate-700">Rol</Label>
        <Select
          aria-label="Rol"
          className="mt-2"
          selectedKey={form.role}
          onSelectionChange={(key) => updateField("role", String(key) as Role)}
        >
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox aria-label="Opciones de rol">
              <ListBox.Item id="user">Usuario</ListBox.Item>
              <ListBox.Item id="admin">Administrador</ListBox.Item>
            </ListBox>
          </Select.Popover>
        </Select>
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <Button className="min-w-40 rounded-full bg-slate-900 text-white" isDisabled={busy} type="submit">
          {busy ? "Guardando..." : editingUser ? "Guardar cambios" : "Crear usuario"}
        </Button>
        <Button
          className="rounded-full border border-slate-200 bg-white text-slate-800"
          type="button"
          variant="outline"
          onPress={onCancel}
        >
          {editingUser ? "Cancelar edicion" : "Cerrar"}
        </Button>
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
    <TextField className="grid gap-2">
      <Label className="text-sm font-medium text-slate-700">{label}</Label>
      {children}
    </TextField>
  );
}
