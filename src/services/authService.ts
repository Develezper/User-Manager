import { LoginPayload, RegisterPayload, SessionUser } from "@/types/user";

export async function login(payload: LoginPayload): Promise<SessionUser> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
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
  const response = await fetch("/api/auth/register", {
    method: "POST",
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
