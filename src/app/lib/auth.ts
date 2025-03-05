import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

// Chave secreta para verificação do JWT
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

type AuthResult =
  | { success: true; userId: string }
  | { success: false; error: string; status: number };

export async function verifyAuth(request: NextRequest): Promise<AuthResult> {
  // Obter o token do cabeçalho Authorization
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      success: false,
      error: "Token de autenticação não fornecido",
      status: 401,
    };
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verificar e decodificar o token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    return {
      success: true,
      userId: decoded.userId,
    };
  } catch (error) {
    console.error("Erro ao verificar token:", error);

    return {
      success: false,
      error: "Token inválido ou expirado",
      status: 401,
    };
  }
}
