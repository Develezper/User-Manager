"use client";

import { useEffect, useState } from "react";
import { Button, Input, Select, SelectItem } from "@heroui/react";
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
      <Input
        isRequired
        label="Nombre"
        labelPlacement="outside"
        placeholder="Ej. Valentina Alvarez"
        value={form.nombre}
        variant="bordered"
        onValueChange={(value) => updateField("nombre", value)}
      />
      <Input
        isRequired
        label="Cedula"
        labelPlacement="outside"
        placeholder="Ej. 1098123456"
        value={form.cc}
        variant="bordered"
        onValueChange={(value) => updateField("cc", value)}
      />
      <Input
        isRequired
        label="Email"
        labelPlacement="outside"
        placeholder="Ej. valentina@empresa.com"
        type="email"
        value={form.email}
        variant="bordered"
        onValueChange={(value) => updateField("email", value)}
      />
      <Input
        isRequired={!editingUser}
        label={editingUser ? "Nueva password" : "Password"}
        labelPlacement="outside"
        placeholder={editingUser ? "Dejar vacio para conservar la actual" : "Minimo 6 caracteres"}
        type="password"
        value={form.password}
        variant="bordered"
        onValueChange={(value) => updateField("password", value)}
      />
      <Select
        disallowEmptySelection
        label="Rol"
        labelPlacement="outside"
        selectedKeys={[form.role]}
        variant="bordered"
        onSelectionChange={(keys) => {
          const role = Array.from(keys)[0] as Role;
          updateField("role", role);
        }}
      >
        <SelectItem key="user">user</SelectItem>
        <SelectItem key="admin">admin</SelectItem>
      </Select>

      <div className="flex flex-wrap gap-3 pt-2">
        <Button
          className="bg-[var(--accent)] text-black"
          isLoading={busy}
          radius="full"
          type="submit"
        >
          {editingUser ? "Guardar cambios" : "Crear usuario"}
        </Button>
        {editingUser ? (
          <Button
            className="border border-black/10 bg-white text-black"
            radius="full"
            type="button"
            variant="flat"
            onPress={onCancel}
          >
            Cancelar edicion
          </Button>
        ) : null}
      </div>
    </form>
  );
}
