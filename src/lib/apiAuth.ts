import { NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/session";

export function requireAdminSession(request: Request) {
  const session = getSessionFromRequest(request);

  if (!session) {
    return NextResponse.json({ message: "Debes iniciar sesion." }, { status: 401 });
  }

  if (session.role !== "admin") {
    return NextResponse.json(
      { message: "No tienes permisos para realizar esta accion." },
      { status: 403 }
    );
  }

  return null;
}
