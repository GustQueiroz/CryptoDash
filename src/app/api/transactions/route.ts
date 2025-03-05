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

    // Obter parâmetros de paginação e filtro
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const page = parseInt(url.searchParams.get("page") || "1");
    const type = url.searchParams.get("type") || undefined;
    const symbol = url.searchParams.get("symbol") || undefined;

    // Validar limites
    const validLimit = Math.min(Math.max(1, limit), 100);
    const validPage = Math.max(1, page);
    const skip = (validPage - 1) * validLimit;

    // Construir filtro
    const filter: any = { userId };
    if (type) {
      filter.type = type;
    }
    if (symbol) {
      filter.symbol = symbol;
    }

    // Buscar transações
    const transactions = await prisma.transaction.findMany({
      where: filter,
      orderBy: {
        date: "desc",
      },
      skip,
      take: validLimit,
    });

    // Contar total de transações para paginação
    const total = await prisma.transaction.count({
      where: filter,
    });

    return NextResponse.json({
      data: transactions,
      pagination: {
        total,
        page: validPage,
        limit: validLimit,
        pages: Math.ceil(total / validLimit),
      },
    });
  } catch (error) {
    console.error("Erro ao buscar transações:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
