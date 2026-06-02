"use client";

import { useState } from "react";
import { Button, Card, CardBody, Chip, Spinner } from "@heroui/react";
import { ProtectedView } from "@/components/ProtectedView";
import { UserCard } from "@/components/UserCard";
import { UserForm } from "@/components/UserForm";
import { useUsers } from "@/hooks/useUsers";
import type { User, UserFormPayload } from "@/types/user";

export default function AdminUsersPage() {
  return (
    <ProtectedView requiresAdmin>
      {({ user, clearSession }) => <AdminUsersContent userName={user?.nombre ?? ""} onLogout={clearSession} />}
    </ProtectedView>
  );
}

function AdminUsersContent({
  userName,
  onLogout
}: {
  userName: string;
  onLogout: () => void;
}) {
  const { users, loading, error, createUser, updateUser, deleteUser } = useUsers();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  async function handleSubmit(payload: UserFormPayload) {
    try {
      setBusy(true);
      setFeedback(null);

      if (editingUser) {
        await updateUser(editingUser._id, payload);
        setEditingUser(null);
        setFeedback("Usuario actualizado correctamente.");
        return;
      }

      await createUser(payload);
      setFeedback("Usuario creado correctamente.");
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : "Ocurrio un error inesperado.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(user: User) {
    const shouldDelete = window.confirm(`¿Eliminar a ${user.nombre}?`);

    if (!shouldDelete) {
      return;
    }

    try {
      await deleteUser(user._id);
      setFeedback("Usuario eliminado correctamente.");
      if (editingUser?._id === user._id) {
        setEditingUser(null);
      }
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : "No fue posible eliminar el usuario.");
    }
  }

  return (
    <main className="shell">
      <div className="noise" />
      <div className="frame grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <section className="panel shadow-cut p-8 lg:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-black/45">Admin control</p>
              <h1 className="editorial-title mt-3 text-5xl">Cabina de usuarios</h1>
            </div>
            <Button className="bg-black text-white" radius="full" onPress={onLogout}>
              Cerrar sesion
            </Button>
          </div>

          <p className="mt-6 text-lg leading-8 text-black/68">
            Bienvenido, {userName}. Desde aqui puedes crear, editar y eliminar usuarios con una
            composicion visual menos plana y mas marcada.
          </p>

          <Card className="mt-8 rounded-[28px] border border-black/5 bg-white/82">
            <CardBody className="gap-6 p-7">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-black/40">Formulario</p>
                  <h2 className="editorial-title mt-2 text-3xl">
                    {editingUser ? "Editar usuario" : "Crear usuario"}
                  </h2>
                </div>
                {editingUser ? (
                  <Chip className="bg-blue-100 text-blue-800" radius="full">
                    Editando
                  </Chip>
                ) : (
                  <Chip className="bg-zinc-100 text-zinc-800" radius="full">
                    Nuevo
                  </Chip>
                )}
              </div>

              <UserForm
                busy={busy}
                editingUser={editingUser}
                onCancel={() => setEditingUser(null)}
                onSubmit={handleSubmit}
              />

              {feedback ? (
                <div className="rounded-[22px] border border-black/7 bg-[var(--accent-soft)] px-4 py-3 text-sm text-black/80">
                  {feedback}
                </div>
              ) : null}

              <div className="rounded-[24px] bg-zinc-950 px-5 py-4 text-sm leading-7 text-white/75">
                <p className="font-semibold text-white">Detalles tecnicos</p>
                <p>
                  El hook <span className="font-mono">useUsers</span> centraliza carga y mutacion
                  del CRUD para mantener la vista enfocada en la experiencia.
                </p>
              </div>
            </CardBody>
          </Card>
        </section>

        <section className="grid gap-6">
          <Card className="panel rounded-[32px] border border-black/5 bg-white/80">
            <CardBody className="gap-5 p-7">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-black/40">Listado</p>
                  <h2 className="editorial-title mt-2 text-4xl">Usuarios registrados</h2>
                </div>
                <Chip className="bg-black text-white" radius="full">
                  {users.length} perfiles
                </Chip>
              </div>

              {loading ? (
                <div className="flex min-h-40 items-center justify-center">
                  <Spinner color="warning" label="Cargando usuarios..." />
                </div>
              ) : null}

              {!loading && error ? (
                <div className="rounded-[22px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              {!loading && !error && users.length === 0 ? (
                <div className="rounded-[28px] border border-dashed border-black/12 bg-zinc-50 px-6 py-10 text-center text-black/60">
                  No hay usuarios registrados. ¡Crea el primero!
                </div>
              ) : null}

              {!loading && users.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {users.map((listedUser) => (
                    <UserCard
                      key={listedUser._id}
                      user={listedUser}
                      onDelete={handleDelete}
                      onEdit={setEditingUser}
                    />
                  ))}
                </div>
              ) : null}
            </CardBody>
          </Card>
        </section>
      </div>
    </main>
  );
}
