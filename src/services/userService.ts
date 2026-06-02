import { User, UserFormPayload } from "@/types/user";
import { createUserSchema, getValidationMessage, updateUserSchema } from "@/lib/validators/user";
import { ZodError } from "zod";

export async function getUsers(): Promise<User[]> {
  const response = await fetch("/api/users", {
    cache: "no-store",
    credentials: "include"
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "No fue posible consultar los usuarios.");
  }

  return data.users;
}

export async function createUser(payload: UserFormPayload): Promise<User> {
  let validatedPayload: ReturnType<typeof createUserSchema.parse>;

  try {
    validatedPayload = createUserSchema.parse(payload);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(getValidationMessage(error));
    }

    throw error;
  }

  const response = await fetch("/api/users", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(validatedPayload)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "No fue posible crear el usuario.");
  }

  return data.user;
}

export async function updateUser(id: string, payload: UserFormPayload): Promise<User> {
  let validatedPayload: ReturnType<typeof updateUserSchema.parse>;

  try {
    validatedPayload = updateUserSchema.parse(payload);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(getValidationMessage(error));
    }

    throw error;
  }

  const response = await fetch(`/api/users/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(validatedPayload)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "No fue posible actualizar el usuario.");
  }

  return data.user;
}

export async function deleteUser(id: string): Promise<void> {
  const response = await fetch(`/api/users/${id}`, {
    method: "DELETE",
    credentials: "include"
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "No fue posible eliminar el usuario.");
  }
}
