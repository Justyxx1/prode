import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// FIJATE ACÁ: Ahora importamos NUESTRO ThemeProvider, no el de "next-themes"
import { ThemeProvider } from "../src/components/ThemeProvider"; 
import { ProdeProvider } from "../src/context/ProdeContext";
import Header from "../src/components/Header";

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
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ProdeProvider>
            
            <Header />

            <main style={{ minHeight: 'calc(100vh - 70px)' }}>
              {children}
            </main>

          </ProdeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}