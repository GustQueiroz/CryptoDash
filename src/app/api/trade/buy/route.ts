import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { verifyAuth } from "@/app/lib/auth";
import { z } from "zod";
import { getCryptoPrice } from "@/app/lib/crypto";

const buySchema = z.object({
  cryptoId: z.string().min(1, "ID da criptomoeda é obrigatório"),
  symbol: z.string().min(1, "Símbolo da criptomoeda é obrigatório"),
  name: z.string().min(1, "Nome da criptomoeda é obrigatório"),
  amount: z.number().positive("Quantidade deve ser positiva"),
  price: z.number().positive("Preço deve ser positivo"),
});

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

    const validation = buySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: validation.error.format() },
        { status: 400 }
      );
    }

    const { cryptoId, symbol, name, amount, price } = validation.data;
    const totalValue = price * amount;

    const currentPrice = await getCryptoPrice(cryptoId);

    if (Math.abs((currentPrice - price) / price) > 0.01) {
      return NextResponse.json(
        { error: "Preço alterado. Atualize a página e tente novamente." },
        { status: 400 }
      );
    }

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

    const usdt = wallet.assets.find((asset) => asset.symbol === "USDT");
    if (!usdt || usdt.amount < totalValue) {
      return NextResponse.json(
        { error: "Saldo insuficiente em USDT" },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      await tx.asset.update({
        where: { id: usdt.id },
        data: {
          amount: { decrement: totalValue },
          totalValue: { decrement: totalValue },
        },
      });

      const existingAsset = wallet.assets.find(
        (asset) => asset.symbol === symbol
      );

      if (existingAsset) {
        const newTotalAmount = existingAsset.amount + amount;
        const newAveragePrice =
          (existingAsset.amount * existingAsset.purchasePrice +
            amount * price) /
          newTotalAmount;

        await tx.asset.update({
          where: { id: existingAsset.id },
          data: {
            amount: newTotalAmount,
            purchasePrice: newAveragePrice,
            currentPrice: price,
            totalValue: newTotalAmount * price,
          },
        });
      } else {
        await tx.asset.create({
          data: {
            walletId: wallet.id,
            cryptoId,
            symbol,
            name,
            amount,
            purchasePrice: price,
            currentPrice: price,
            totalValue: amount * price,
          },
        });
      }

      await tx.transaction.create({
        data: {
          userId,
          cryptoId,
          symbol,
          type: "BUY",
          amount,
          price,
          totalValue,
        },
      });

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

      return await tx.wallet.findUnique({
        where: { id: wallet.id },
        include: {
          assets: true,
        },
      });
    });

    return NextResponse.json({
      message: "Compra realizada com sucesso",
      wallet: result,
    });
  } catch (error) {
    console.error("Erro ao realizar compra:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
