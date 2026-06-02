"use client";

import { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Chip,
  Header,
  Modal,
  Spinner,
  useOverlayState
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
  const formModal = useOverlayState();
  const deleteModal = useOverlayState();

  useEffect(() => {
    if (editingUser) {
      formModal.open();
    }
  }, [editingUser, formModal]);

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
      formModal.close();
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : "Ocurrio un error inesperado.");
    } finally {
      setBusy(false);
    }
  }

  function handleCreate() {
    setEditingUser(null);
    setFeedback(null);
    formModal.open();
  }

  function handleEdit(user: User) {
    setFeedback(null);
    setEditingUser(user);
  }

  function handleDeleteRequest(user: User) {
    setUserToDelete(user);
    setFeedback(null);
    deleteModal.open();
  }

  function handleCloseForm() {
    setEditingUser(null);
    formModal.close();
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
      deleteModal.close();
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
          <Card className="border border-slate-200/80 bg-white/80 shadow-none backdrop-blur">
            <Card.Content className="p-3 sm:p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="bg-blue-600 text-white">
                    <Avatar.Fallback>{getInitials(userName)}</Avatar.Fallback>
                  </Avatar>
                  <Header className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-900">User Manager</span>
                    <span className="text-sm text-slate-500">Administracion de usuarios</span>
                  </Header>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Chip className="bg-blue-100 text-blue-700" size="sm" variant="soft">
                    Admin
                  </Chip>
                  <Button className="bg-slate-900 text-white" onPress={handleCreate}>
                    Nuevo usuario
                  </Button>
                  <Button
                    className="border border-slate-200 bg-white text-slate-800"
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
            <Card className="border border-slate-200 bg-slate-50 shadow-none">
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

          <Card className="border border-slate-200/80 bg-white/88 shadow-none">
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
              <Chip className="bg-slate-100 text-slate-700" size="sm" variant="soft">
                {users.length} registros
              </Chip>
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
                <Card className="border border-dashed border-slate-200 bg-slate-50 shadow-none">
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

      <Modal state={formModal}>
        <Modal.Backdrop className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm" isDismissable={false} />
        <Modal.Container className="fixed inset-0 flex items-center justify-center px-4" placement="center" size="lg">
          <Modal.Dialog className="relative w-full max-w-lg rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
            <Modal.Header className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
              <div>
                <Modal.Heading className="text-xl font-semibold text-slate-900">
                  {editingUser ? "Editar usuario" : "Nuevo usuario"}
                </Modal.Heading>
                <p className="mt-1 text-sm text-slate-500">
                  Completa la informacion del usuario.
                </p>
              </div>
              <Chip
                className={editingUser ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-700"}
                size="sm"
                variant="soft"
              >
                {editingUser ? "Edicion" : "Crear"}
              </Chip>
            </Modal.Header>
            <Modal.Body className="px-6 py-6">
              <UserForm
                busy={busy}
                editingUser={editingUser}
                onCancel={handleCloseForm}
                onSubmit={handleSubmit}
              />
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal>

      <Modal state={deleteModal}>
        <Modal.Backdrop className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm" isDismissable={false} />
        <Modal.Container className="fixed inset-0 flex items-center justify-center px-4" placement="center" size="md">
          <Modal.Dialog className="relative w-full max-w-md rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
            <Modal.Header className="border-b border-slate-100 px-6 py-5">
              <Modal.Heading className="text-xl font-semibold text-slate-900">
                Eliminar usuario
              </Modal.Heading>
            </Modal.Header>
            <Modal.Body className="px-6 py-6">
              <p className="text-sm leading-6 text-slate-500">
                {userToDelete
                  ? `Confirma si deseas eliminar a ${userToDelete.nombre}.`
                  : "Confirma esta accion para continuar."}
              </p>
            </Modal.Body>
            <Modal.Footer className="flex justify-end gap-3 border-t border-slate-100 px-6 py-5">
              <Button
                className="border border-slate-200 bg-white text-slate-800"
                variant="outline"
                onPress={() => {
                  setUserToDelete(null);
                  deleteModal.close();
                }}
              >
                Cancelar
              </Button>
              <Button className="bg-slate-900 text-white" isDisabled={busy} onPress={handleConfirmDelete}>
                {busy ? "Eliminando..." : "Eliminar"}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal>
    </>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="border border-slate-200 bg-slate-50 shadow-none">
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
