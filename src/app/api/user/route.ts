import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { verifyAuth } from "@/app/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const userId = authResult.userId;

    // Buscar dados do usuário
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        wallet: {
          include: {
            assets: true,
          },
        },
        favorites: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // Remover dados sensíveis
    const { passwordHash, ...userData } = user;

    return NextResponse.json(userData);
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
