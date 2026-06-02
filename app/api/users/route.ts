import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { sendWelcomeEmail } from "@/lib/mailer";
import { User } from "@/models/User";

export async function GET() {
  try {
    await connectToDatabase();
    const users = await User.find().sort({ createdAt: -1 });

    return NextResponse.json({
      users: users.map((user) => ({
        _id: user._id.toString(),
        nombre: user.nombre,
        cc: user.cc,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }))
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "No fue posible consultar usuarios.",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { nombre, cc, email, password, role } = await request.json();

    if (!nombre || !cc || !email || !password || !role) {
      return NextResponse.json(
        { message: "Todos los campos son obligatorios." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const existing = await User.findOne({ email: email.toLowerCase() });

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
      email: email.toLowerCase(),
      password: hashedPassword,
      role
    });

    await sendWelcomeEmail({ nombre, email, password, role });

    return NextResponse.json(
      {
        user: {
          _id: created._id.toString(),
          nombre: created.nombre,
          cc: created.cc,
          email: created.email,
          role: created.role,
          createdAt: created.createdAt,
          updatedAt: created.updatedAt
        }
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "No fue posible crear el usuario.",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
