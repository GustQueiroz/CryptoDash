import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import jwt from "jsonwebtoken";

// Schema de validação para o registro
const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar dados de entrada
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

    // Verificar se o email já está em uso
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Este email já está registrado" },
        { status: 400 }
      );
    }

    // Hash da senha
    const passwordHash = await bcrypt.hash(password, 10);

    // Criar usuário
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
                  // Criar saldo inicial em BRL (assumindo que BRL é um asset existente)
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
                  // Criar saldo inicial em USDT
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

    // Gerar token JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || "fallback_secret_not_for_production",
      { expiresIn: "7d" }
    );

    // Retornar resposta de sucesso
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
