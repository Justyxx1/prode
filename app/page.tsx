'use client';
import Link from 'next/link';

export default function Login() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '70vh',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ 
        backgroundColor: 'var(--bg-card)', 
        padding: '40px', 
        borderRadius: '16px', 
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)', 
        width: '100%', 
        maxWidth: '400px', 
        border: '1px solid var(--border-color)' 
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '28px', color: 'var(--text-color)' }}>
          ⚽ Iniciar Sesión
        </h1>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px', color: 'var(--text-color)' }}>
              Correo electrónico
            </label>
            <input 
              type="email" 
              placeholder="tu@email.com" 
              style={{ 
                width: '100%', padding: '12px', borderRadius: '8px', 
                border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' 
              }} 
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px', color: 'var(--text-color)' }}>
              Contraseña
            </label>
            <input 
              type="password" 
              placeholder="••••••••" 
              style={{ 
                width: '100%', padding: '12px', borderRadius: '8px', 
                border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' 
              }} 
            />
          </div>

          <Link 
            href="/panel" 
            style={{ 
              backgroundColor: '#0070f3', 
              color: 'white', 
              padding: '14px', 
              borderRadius: '8px', 
              textAlign: 'center', 
              fontWeight: 'bold', 
              textDecoration: 'none', 
              display: 'block',
              marginTop: '10px',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#005bb5'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0070f3'}
          >
            Entrar
          </Link>
        </div>

        <p style={{ textAlign: 'center', marginTop: '25px', fontSize: '13px', color: 'var(--text-color)', opacity: 0.6 }}>
          (Por ahora es un login de prueba, podés hacer clic en "Entrar" directamente)
        </p>
      </div>
    </div>
  );
}