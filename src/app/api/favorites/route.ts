import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { verifyAuth } from "@/app/lib/auth";
import { z } from "zod";

const favoriteSchema = z.object({
  cryptoId: z.string().min(1, "ID da criptomoeda é obrigatório"),
  symbol: z.string().min(1, "Símbolo da criptomoeda é obrigatório"),
  name: z.string().min(1, "Nome da criptomoeda é obrigatório"),
});

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const userId = authResult.userId;

    const favorites = await prisma.favorite.findMany({
      where: { userId },
    });

    return NextResponse.json(favorites);
  } catch (error) {
    console.error("Erro ao buscar favoritos:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const userId = authResult.userId;
    const body = await request.json();

    const validation = favoriteSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: validation.error.format() },
        { status: 400 }
      );
    }

    const { cryptoId, symbol, name } = validation.data;

    const existingFavorite = await prisma.favorite.findFirst({
      where: {
        userId,
        cryptoId,
      },
    });

    if (existingFavorite) {
      return NextResponse.json(
        { error: "Criptomoeda já está nos favoritos" },
        { status: 400 }
      );
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId,
        cryptoId,
        symbol,
        name,
      },
    });

    return NextResponse.json(favorite);
  } catch (error) {
    console.error("Erro ao adicionar favorito:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const userId = authResult.userId;

    const url = new URL(request.url);
    const cryptoId = url.searchParams.get("cryptoId");

    if (!cryptoId) {
      return NextResponse.json(
        { error: "ID da criptomoeda é obrigatório" },
        { status: 400 }
      );
    }

    const favorite = await prisma.favorite.findFirst({
      where: {
        userId,
        cryptoId,
      },
    });

    if (!favorite) {
      return NextResponse.json(
        { error: "Favorito não encontrado" },
        { status: 404 }
      );
    }

    await prisma.favorite.delete({
      where: {
        id: favorite.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao remover favorito:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
