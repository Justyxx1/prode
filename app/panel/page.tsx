'use client';
import Link from 'next/link';

export default function Panel() {
  return (
    <div style={{ padding: '40px', maxWidth: '900px', margin: 'auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
      
      <h1 style={{ fontSize: '36px', marginBottom: '15px', color: 'var(--text-color)' }}>
        Hola, Jugador 👋
      </h1>
      
      <p style={{ fontSize: '18px', color: 'var(--text-color)', opacity: 0.8, marginBottom: '50px' }}>
        Bienvenido a tu panel de control. Acá vas a poder gestionar todos tus prodes.
      </p>

      {/* Contenedor de las tarjetas de acción */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '30px', 
        flexWrap: 'wrap' 
      }}>
        
        {/* BOTÓN GIGANTE PARA CREAR PRODE */}
        <Link 
          href="/nuevo-prode" 
          style={{
            backgroundColor: '#10b981', // Un verde esmeralda muy lindo
            color: 'white',
            padding: '40px 30px',
            borderRadius: '16px',
            textDecoration: 'none',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            flex: '1 1 300px',
            maxWidth: '400px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '15px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.1)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)';
          }}
        >
          <span style={{ fontSize: '48px' }}>➕</span>
          <span style={{ fontSize: '24px', fontWeight: 'bold' }}>Crear nuevo prode</span>
        </Link>
        
        {/* ESPACIO RESERVADO PARA PRODES GUARDADOS */}
        <div style={{
          backgroundColor: 'transparent',
          color: 'var(--text-color)',
          padding: '40px 30px',
          borderRadius: '16px',
          border: '3px dashed var(--border-color)',
          opacity: 0.6,
          flex: '1 1 300px',
          maxWidth: '400px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '15px'
        }}>
          <span style={{ fontSize: '48px' }}>📁</span>
          <span style={{ fontSize: '20px', fontWeight: 'bold' }}>Tus prodes guardados</span>
          <span style={{ fontSize: '14px' }}>Aparecerán acá próximamente</span>
        </div>

      </div>
    </div>
  );
}