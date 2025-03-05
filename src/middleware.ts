import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/api/auth/login",
  "/api/auth/register",
];

const isPublicRoute = (path: string) => {
  return publicRoutes.some(
    (route) =>
      path === route ||
      path.startsWith("/api/auth/") ||
      path.startsWith("/_next/") ||
      path.startsWith("/favicon") ||
      path.includes(".")
  );
};

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (isPublicRoute(path)) {
    return NextResponse.next();
  }

  const token =
    request.cookies.get("auth-token")?.value ||
    request.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    if (path.startsWith("/api/")) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "fallback_secret_not_for_production"
    );

    await jwtVerify(token, secret);

    return NextResponse.next();
  } catch (error) {
    if (path.startsWith("/api/")) {
      return NextResponse.json(
        { message: "Não autorizado - token inválido" },
        { status: 401 }
      );
    }

    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
