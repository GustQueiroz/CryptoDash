import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/app/lib/prisma";
import { headers } from "next/headers";

interface JwtPayload {
  userId: string;
}

export async function GET() {
  try {
    const headersList = headers();
    const authorization = (await headersList).get("authorization");

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Token não fornecido" },
        { status: 401 }
      );
    }

    const token = authorization.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret_not_for_production"
    ) as JwtPayload;

    if (!decoded.userId) {
      return NextResponse.json({ message: "Token inválido" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user,
      token,
    });
  } catch (error) {
    console.error("Erro ao verificar token:", error);
    return NextResponse.json(
      { message: "Token inválido ou expirado" },
      { status: 401 }
    );
  }
}
