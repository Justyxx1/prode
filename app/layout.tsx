'use client';
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { useRouter } from "next/navigation";
import BotonTema from "../src/components/BotonTema";
import { ProdeProvider } from "../src/context/ProdeContext";
import { supabase } from "../src/lib/supabase";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  const manejarClickLogo = async (e: React.MouseEvent) => {
    e.preventDefault();
    // Verificamos en tiempo real si hay una sesión activa
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      router.push('/panel');
    } else {
      router.push('/');
    }
  };

  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ProdeProvider>
            
            {/* ENCABEZADO INTELIGENTE */}
            <header style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '15px 30px', 
              backgroundColor: 'var(--bg-card)', 
              borderBottom: '1px solid var(--border-color)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}>
              <a 
                href="/" 
                onClick={manejarClickLogo} 
                style={{ textDecoration: 'none', color: 'var(--text-color)', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                🏆 Prode Mundial
              </a>
              
              <BotonTema />
            </header>

            <main style={{ minHeight: 'calc(100vh - 70px)' }}>
              {children}
            </main>

          </ProdeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}