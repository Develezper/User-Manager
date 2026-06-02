import { User, UserFormPayload } from "@/types/user";

export async function getUsers(): Promise<User[]> {
  const response = await fetch("/api/users", { cache: "no-store" });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "No fue posible consultar los usuarios.");
  }

  return data.users;
}

export async function createUser(payload: UserFormPayload): Promise<User> {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "No fue posible crear el usuario.");
  }

  return data.user;
}

export async function updateUser(id: string, payload: UserFormPayload): Promise<User> {
  const response = await fetch(`/api/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "No fue posible actualizar el usuario.");
  }

  return data.user;
}

export async function deleteUser(id: string): Promise<void> {
  const response = await fetch(`/api/users/${id}`, {
    method: "DELETE"
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "No fue posible eliminar el usuario.");
  }
}
