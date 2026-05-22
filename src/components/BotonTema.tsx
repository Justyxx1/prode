'use client';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BotonTema() {
  const { theme, setTheme } = useTheme();
  const [montado, setMontado] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMontado(true);
  }, []);

  // Extraemos solo el ID del grupo si estamos en una página de grupo
  let grupoId = null;
  if (pathname && pathname.startsWith('/grupo/')) {
    grupoId = pathname.split('/').pop()?.toUpperCase();
  }

  if (!montado) return null;

  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '15px 40px',
      borderBottom: '1px solid var(--border-color)',
      backgroundColor: 'var(--bg-card)',
      marginBottom: '20px',
      position: 'relative' // Fundamental para centrar el título de forma absoluta
    }}>
      
      {/* 1. IZQUIERDA: Siempre "Prode Mundial" como enlace al inicio */}
      <Link href="/" style={{ 
        fontWeight: 'bold', 
        fontSize: '24px', 
        textDecoration: 'none',
        color: 'var(--text-color)',
      }}>
        🏆 Prode Mundial
      </Link>

      {/* 2. CENTRO: Solo aparece si estamos dentro de un grupo */}
      {grupoId && (
        <div style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)', // Centrado matemático perfecto
          fontSize: '24px',
          fontWeight: 'bold',
          color: 'var(--text-color)',
          letterSpacing: '1px' // Un poquito de espacio para que se vea más elegante
        }}>
          GRUPO {grupoId}
        </div>
      )}

      {/* 3. DERECHA: Botón de cambio de tema */}
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        style={{
          padding: '8px 16px',
          borderRadius: '8px',
          border: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-color)',
          color: 'var(--text-color)',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '18px'
        }}
        title="Cambiar tema"
      >
        {theme === 'dark' ? '🌙' : '☀️'}
      </button>
    </nav>
  );
}