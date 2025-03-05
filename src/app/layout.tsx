import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ThemeRegistry from "./mui/ThemeRegistry";
import AuthProvider from "./components/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CryptoDash - Gerenciador de Criptomoedas",
  description:
    "Plataforma para gerenciar suas criptomoedas, visualizar carteira, e acompanhar transações",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ThemeRegistry>
          <AuthProvider>{children}</AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
