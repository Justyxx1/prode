import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import BotonTema from "../src/components/BotonTema";
import { ProdeProvider } from "../src/context/ProdeContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Prode Mundial",
  description: "App para gestionar tu prode del mundial",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Agregamos suppressHydrationWarning para evitar errores con next-themes
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ProdeProvider>
            <BotonTema />
            {children}
          </ProdeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}