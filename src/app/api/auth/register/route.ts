import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import jwt from "jsonwebtoken";

const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          message: "Dados inválidos",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, password } = result.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Este email já está registrado" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash,
        wallets: {
          create: {
            balances: {
              create: [
                {
                  asset: {
                    connectOrCreate: {
                      where: { symbol: "BRL" },
                      create: {
                        symbol: "BRL",
                        name: "Real Brasileiro",
                        type: "FIAT",
                      },
                    },
                  },
                  amount: 0,
                },
                {
                  asset: {
                    connectOrCreate: {
                      where: { symbol: "USDT" },
                      create: {
                        symbol: "USDT",
                        name: "Tether",
                        type: "CRYPTOCURRENCY",
                      },
                    },
                  },
                  amount: 0,
                },
              ],
            },
          },
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || "fallback_secret_not_for_production",
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      message: "Usuário registrado com sucesso",
      token,
      user,
    });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    return NextResponse.json(
      { message: "Erro ao processar o registro" },
      { status: 500 }
    );
  }
}
