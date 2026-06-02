import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email y contrasena son obligatorios." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        { message: "Email o contrasena incorrectos." },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { message: "Email o contrasena incorrectos." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user: {
        _id: user._id.toString(),
        nombre: user.nombre,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "No fue posible iniciar sesion.",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
