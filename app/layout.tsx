import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// Importamos el proveedor de temas
import { ThemeProvider } from "next-themes";
import BotonTema from "../src/components/BotonTema";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prode Mundial",
  description: "Carga tus prodes del mundial",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning es vital acá para que next-themes funcione bien
    <html lang="es" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Envolvemos la app con el ThemeProvider */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <BotonTema />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}