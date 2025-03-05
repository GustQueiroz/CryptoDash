import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { verifyAuth } from "@/app/lib/auth";
import { z } from "zod";
import { getCryptoPrice } from "@/app/lib/crypto";

// Schema de validação para venda
const sellSchema = z.object({
  cryptoId: z.string().min(1, "ID da criptomoeda é obrigatório"),
  symbol: z.string().min(1, "Símbolo da criptomoeda é obrigatório"),
  amount: z.number().positive("Quantidade deve ser positiva"),
  price: z.number().positive("Preço deve ser positivo"),
});

export async function POST(request: NextRequest) {
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
    const body = await request.json();

    // Validar dados de entrada
    const validation = sellSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: validation.error.format() },
        { status: 400 }
      );
    }

    const { cryptoId, symbol, amount, price } = validation.data;
    const totalValue = price * amount;

    // Verificar preço atual para garantir que não houve mudança significativa
    const currentPrice = await getCryptoPrice(cryptoId);

    if (Math.abs((currentPrice - price) / price) > 0.01) {
      return NextResponse.json(
        { error: "Preço alterado. Atualize a página e tente novamente." },
        { status: 400 }
      );
    }

    // Buscar carteira do usuário
    const wallet = await prisma.wallet.findUnique({
      where: { userId },
      include: {
        assets: true,
      },
    });

    if (!wallet) {
      return NextResponse.json(
        { error: "Carteira não encontrada" },
        { status: 404 }
      );
    }

    // Verificar se possui o ativo
    const asset = wallet.assets.find((a) => a.symbol === symbol);
    if (!asset || asset.amount < amount) {
      return NextResponse.json(
        { error: "Saldo insuficiente de " + symbol },
        { status: 400 }
      );
    }

    // Buscar USDT
    const usdt = wallet.assets.find((a) => a.symbol === "USDT");

    // Executar a transação
    const result = await prisma.$transaction(async (tx) => {
      // Atualizar ativo vendido
      const remainingAmount = asset.amount - amount;

      if (remainingAmount > 0) {
        // Atualizar ativo com quantidade reduzida
        await tx.asset.update({
          where: { id: asset.id },
          data: {
            amount: remainingAmount,
            currentPrice: price,
            totalValue: remainingAmount * price,
          },
        });
      } else {
        // Remover ativo completamente
        await tx.asset.delete({
          where: { id: asset.id },
        });
      }

      // Atualizar USDT
      if (usdt) {
        // Adicionar valor à USDT existente
        await tx.asset.update({
          where: { id: usdt.id },
          data: {
            amount: { increment: totalValue },
            totalValue: { increment: totalValue },
          },
        });
      } else {
        // Criar USDT se não existir
        await tx.asset.create({
          data: {
            walletId: wallet.id,
            cryptoId: "tether",
            symbol: "USDT",
            name: "Tether",
            amount: totalValue,
            purchasePrice: 1,
            currentPrice: 1,
            totalValue: totalValue,
          },
        });
      }

      // Registrar transação
      await tx.transaction.create({
        data: {
          userId,
          cryptoId,
          symbol,
          type: "SELL",
          amount,
          price,
          totalValue,
        },
      });

      // Atualizar saldo total da carteira
      const newBalance = await tx.asset.aggregate({
        where: { walletId: wallet.id },
        _sum: { totalValue: true },
      });

      await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          totalBalance: newBalance._sum.totalValue || 0,
        },
      });

      // Buscar carteira atualizada
      return await tx.wallet.findUnique({
        where: { id: wallet.id },
        include: {
          assets: true,
        },
      });
    });

    return NextResponse.json({
      message: "Venda realizada com sucesso",
      wallet: result,
    });
  } catch (error) {
    console.error("Erro ao realizar venda:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
