import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { verifyAuth } from "@/app/lib/auth";

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

    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const page = parseInt(url.searchParams.get("page") || "1");
    const type = url.searchParams.get("type") || undefined;
    const symbol = url.searchParams.get("symbol") || undefined;

    const validLimit = Math.min(Math.max(1, limit), 100);
    const validPage = Math.max(1, page);
    const skip = (validPage - 1) * validLimit;

    const filter: any = { userId };
    if (type) {
      filter.type = type;
    }
    if (symbol) {
      filter.symbol = symbol;
    }

    const transactions = await prisma.transaction.findMany({
      where: filter,
      orderBy: {
        date: "desc",
      },
      skip,
      take: validLimit,
    });

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
