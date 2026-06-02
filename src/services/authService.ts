import { LoginPayload, RegisterPayload, SessionUser } from "@/types/user";
import { getValidationMessage, loginSchema, registerSchema } from "@/lib/validators/user";
import { ZodError } from "zod";

export async function login(payload: LoginPayload): Promise<SessionUser> {
  try {
    payload = loginSchema.parse(payload);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(getValidationMessage(error));
    }

    throw error;
  }

  const response = await fetch("/api/auth/login", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "No fue posible iniciar sesion.");
  }

  return data.user;
}

export async function register(payload: RegisterPayload): Promise<SessionUser> {
  try {
    payload = registerSchema.parse(payload);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(getValidationMessage(error));
    }

    throw error;
  }

  const response = await fetch("/api/auth/register", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "No fue posible crear la cuenta.");
  }

  return data.user;
}

export async function getCurrentSession(): Promise<SessionUser | null> {
  const response = await fetch("/api/auth/session", {
    cache: "no-store",
    credentials: "include"
  });

  if (!response.ok) {
    throw new Error("No fue posible consultar la sesion.");
  }

  const data = (await response.json()) as { user: SessionUser | null };

  return data.user;
}

export async function logout(): Promise<void> {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include"
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message || "No fue posible cerrar sesion.");
  }
}
