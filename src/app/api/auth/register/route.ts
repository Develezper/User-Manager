import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { sendWelcomeEmail } from "@/lib/mailer";
import { User } from "@/models/User";

export async function POST(request: Request) {
  try {
    const { nombre, cc, email, password } = await request.json();

    if (!nombre || !cc || !email || !password) {
      return NextResponse.json(
        { message: "Nombre, cedula, email y password son obligatorios." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const normalizedEmail = email.toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });

    if (existing) {
      return NextResponse.json(
        { message: "Ya existe un usuario con ese email." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const created = await User.create({
      nombre,
      cc,
      email: normalizedEmail,
      password: hashedPassword,
      role: "user"
    });

    await sendWelcomeEmail({
      nombre,
      email: normalizedEmail,
      password,
      role: "user"
    });

    return NextResponse.json(
      {
        user: {
          _id: created._id.toString(),
          nombre: created.nombre,
          email: created.email,
          role: created.role
        }
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "No fue posible crear la cuenta.",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
