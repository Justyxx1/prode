'use client';
import { useRouter } from "next/navigation";
import BotonTema from "./BotonTema";
import { supabase } from "../lib/supabase";

export default function Header() {
  const router = useRouter();

  const manejarClickLogo = async (e: React.MouseEvent) => {
    e.preventDefault();
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      router.push('/panel');
    } else {
      router.push('/');
    }
  };

  return (
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
  );
}