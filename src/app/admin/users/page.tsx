"use client";

import { useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Header,
  Spinner
} from "@heroui/react";
import { ProtectedView } from "@/components/ProtectedView";
import { UserCard } from "@/components/UserCard";
import { UserForm } from "@/components/UserForm";
import { useUsers } from "@/hooks/useUsers";
import type { User, UserFormPayload } from "@/types/user";

export default function AdminUsersPage() {
  return (
    <ProtectedView requiresAdmin>
      {({ user, clearSession }) => (
        <AdminUsersContent userName={user?.nombre ?? ""} onLogout={clearSession} />
      )}
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
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  async function handleSubmit(payload: UserFormPayload) {
    try {
      setBusy(true);
      setFeedback(null);

      if (editingUser) {
        await updateUser(editingUser._id, payload);
        setFeedback("Usuario actualizado correctamente.");
      } else {
        await createUser(payload);
        setFeedback("Usuario creado correctamente.");
      }

      setEditingUser(null);
      setIsFormOpen(false);
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : "Ocurrio un error inesperado.");
    } finally {
      setBusy(false);
    }
  }

  function handleCreate() {
    setEditingUser(null);
    setFeedback(null);
    setIsFormOpen(true);
  }

  function handleEdit(user: User) {
    setFeedback(null);
    setEditingUser(user);
    setIsFormOpen(true);
  }

  function handleDeleteRequest(user: User) {
    setUserToDelete(user);
    setFeedback(null);
    setIsDeleteOpen(true);
  }

  function handleCloseForm() {
    setEditingUser(null);
    setIsFormOpen(false);
  }

  async function handleConfirmDelete() {
    if (!userToDelete) {
      return;
    }

    try {
      setBusy(true);
      await deleteUser(userToDelete._id);
      setFeedback("Usuario eliminado correctamente.");

      if (editingUser?._id === userToDelete._id) {
        setEditingUser(null);
      }

      setUserToDelete(null);
      setIsDeleteOpen(false);
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : "No fue posible eliminar el usuario.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <main className="app-shell">
        <div className="app-frame space-y-6">
          <Card className="surface-card rounded-[20px] shadow-none">
            <Card.Content className="p-3 sm:p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-[14px] bg-slate-900 text-white shadow-[0_10px_24px_rgba(15,23,42,0.12)]">
                    <Avatar.Fallback className="flex h-full w-full items-center justify-center text-sm font-semibold leading-none">
                      {getInitials(userName)}
                    </Avatar.Fallback>
                  </Avatar>
                  <Header className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-900">User Manager</span>
                    <span className="text-sm text-slate-500">Centro de gestion</span>
                  </Header>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm font-medium text-slate-600">
                    Acceso administrador
                  </span>
                  <Button className="rounded-md bg-slate-900 px-5 text-white" onPress={handleCreate}>
                    Nuevo usuario
                  </Button>
                  <Button
                    className="rounded-md border border-slate-200 bg-white/90 text-slate-800"
                    variant="outline"
                    onPress={onLogout}
                  >
                    Cerrar sesion
                  </Button>
                </div>
              </div>
            </Card.Content>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <SummaryCard label="Administrador" value={userName} />
            <SummaryCard label="Usuarios" value={String(users.length)} />
            <Card className="surface-card rounded-[18px] shadow-none">
              <Card.Content className="gap-2 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Estado
                </p>
                <p className="text-lg font-semibold text-slate-900">
                  {loading ? "Sincronizando" : "Actualizado"}
                </p>
              </Card.Content>
            </Card>
          </div>

          <Card className="surface-card rounded-[22px] shadow-none">
            <Card.Header className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div>
                <p className="eyebrow">Usuarios</p>
                <Card.Title className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-900 sm:text-3xl">
                  Gestion de usuarios
                </Card.Title>
                <Card.Description className="mt-2 text-sm text-slate-500">
                  Crea, edita y elimina usuarios desde un solo panel.
                </Card.Description>
              </div>
              <span className="text-sm font-medium text-slate-600">
                {users.length} registros
              </span>
            </Card.Header>

            <Card.Content className="grid gap-5 p-6 pt-0 sm:p-8 sm:pt-0">
              {feedback ? <div className="message-muted">{feedback}</div> : null}

              {loading ? (
                <div className="flex min-h-40 items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <Spinner />
                    <p className="text-sm text-slate-500">Cargando usuarios...</p>
                  </div>
                </div>
              ) : null}

              {!loading && error ? <div className="message-error">{error}</div> : null}

              {!loading && !error && users.length === 0 ? (
                <Card className="surface-card shadow-none">
                  <Card.Content className="px-6 py-10 text-center text-sm text-slate-500">
                    No hay usuarios registrados. ¡Crea el primero!
                  </Card.Content>
                </Card>
              ) : null}

              {!loading && users.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {users.map((listedUser) => (
                    <UserCard
                      key={listedUser._id}
                      cc={listedUser.cc}
                      email={listedUser.email}
                      nombre={listedUser.nombre}
                      role={listedUser.role}
                      user={listedUser}
                      onDelete={handleDeleteRequest}
                      onEdit={handleEdit}
                    />
                  ))}
                </div>
              ) : null}
            </Card.Content>
          </Card>
        </div>
      </main>

      {isFormOpen ? (
        <DialogShell>
          <div className="relative mx-auto w-full max-w-lg rounded-[20px] border border-slate-200 bg-white shadow-[0_28px_90px_rgba(15,23,42,0.14)]">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {editingUser ? "Editar usuario" : "Nuevo usuario"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Completa la informacion del usuario.
                </p>
              </div>
              <span className={`text-sm font-medium ${editingUser ? "text-blue-700" : "text-slate-600"}`}>
                {editingUser ? "Edicion" : "Crear"}
              </span>
            </div>
            <div className="px-6 py-6">
              <UserForm
                busy={busy}
                editingUser={editingUser}
                onCancel={handleCloseForm}
                onSubmit={handleSubmit}
              />
            </div>
          </div>
        </DialogShell>
      ) : null}

      {isDeleteOpen ? (
        <DialogShell>
          <div className="relative mx-auto w-full max-w-md rounded-[20px] border border-slate-200 bg-white shadow-[0_28px_90px_rgba(15,23,42,0.14)]">
            <div className="border-b border-slate-200 px-6 py-5">
              <h2 className="text-xl font-semibold text-slate-900">
                Eliminar usuario
              </h2>
            </div>
            <div className="px-6 py-6">
              <p className="text-sm leading-6 text-slate-500">
                {userToDelete
                  ? `Confirma si deseas eliminar a ${userToDelete.nombre}.`
                  : "Confirma esta accion para continuar."}
              </p>
            </div>
            <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-5">
              <Button
                className="rounded-md border border-slate-300 bg-white text-slate-800 transition-all hover:border-slate-400 hover:bg-slate-50"
                variant="outline"
                onPress={() => {
                  setUserToDelete(null);
                  setIsDeleteOpen(false);
                }}
              >
                Cancelar
              </Button>
              <Button className="rounded-md bg-slate-900 px-5 text-white transition-all hover:bg-slate-800" isDisabled={busy} onPress={handleConfirmDelete}>
                {busy ? "Eliminando..." : "Eliminar"}
              </Button>
            </div>
          </div>
        </DialogShell>
      ) : null}
    </>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="surface-card shadow-none">
      <Card.Content className="gap-2 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
        <p className="text-lg font-semibold text-slate-900">{value}</p>
      </Card.Content>
    </Card>
  );
}

function getInitials(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function DialogShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[rgba(241,245,249,0.62)] backdrop-blur-sm" />
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
