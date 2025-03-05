import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Rotas que não precisam de autenticação
const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/api/auth/login",
  "/api/auth/register",
];

// Verificar se uma rota é pública
const isPublicRoute = (path: string) => {
  return publicRoutes.some(
    (route) =>
      path === route ||
      path.startsWith("/api/auth/") ||
      path.startsWith("/_next/") ||
      path.startsWith("/favicon") ||
      path.includes(".") // arquivos estáticos
  );
};

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Se for uma rota pública, não precisa verificar autenticação
  if (isPublicRoute(path)) {
    return NextResponse.next();
  }

  // Checar o token no cookie ou header
  const token =
    request.cookies.get("auth-token")?.value ||
    request.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    // Se for uma rota de API, retorna erro 401
    if (path.startsWith("/api/")) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    // Se for uma rota de página, redireciona para login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // Verificar o token
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "fallback_secret_not_for_production"
    );

    await jwtVerify(token, secret);

    // Token válido, permitir acesso
    return NextResponse.next();
  } catch (error) {
    // Token inválido ou expirado
    if (path.startsWith("/api/")) {
      return NextResponse.json(
        { message: "Não autorizado - token inválido" },
        { status: 401 }
      );
    }

    // Redirecionar para página de login
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

// Configurar quais rotas o middleware deve processar
export const config = {
  // Aplicar a todas as rotas exceto as de recursos estáticos
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
