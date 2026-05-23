'use client';
import Link from 'next/link';
import { useEffect } from 'react';
import { useProde } from '../../src/context/ProdeContext';

export default function NuevoProde() {
  const { prodeActivo, cargandoProde, inicializarProde, descartarProde } = useProde();

  useEffect(() => {
    inicializarProde();
  }, []);

  const estructuraMundial = [
    { id: 'a', paises: ['🇲🇽 MÉXICO', '🇿🇦 SUDÁFRICA', '🇰🇷 COREA', '🇨🇿 CHEQUIA'] },
    { id: 'b', paises: ['🇨🇦 CANADÁ', '🇧🇦 BOSNIA', '🇶🇦 QATAR', '🇨🇭 SUIZA'] },
    { id: 'c', paises: ['🇧🇷 BRASIL', '🇲🇦 MARRUECOS', '🇭🇹 HAITÍ', '🏴󠁧󠁢󠁳󠁣󠁴󠁿 ESCOCIA'] },
    { id: 'd', paises: ['🇺🇸 EE.UU.', '🇵🇾 PARAGUAY', '🇦🇺 AUSTRALIA', '🇹🇷 TURQUÍA'] },
    { id: 'e', paises: ['🇩🇪 ALEMANIA', '🇨🇼 CURAZAO', '🇨🇮 C. DE MARFIL', '🇪🇨 ECUADOR'] },
    { id: 'f', paises: ['🇳🇱 PAÍSES BAJOS', '🇯🇵 JAPÓN', '🇸🇪 SUECIA', '🇹🇳 TÚNEZ'] },
    { id: 'g', paises: ['🇧🇪 BÉLGICA', '🇪🇬 EGIPTO', '🇮🇷 IRÁN', '🇳🇿 N. ZELANDA'] },
    { id: 'h', paises: ['🇪🇸 ESPAÑA', '🇨🇻 CABO VERDE', '🇸🇦 ARABIA S.', '🇺🇾 URUGUAY'] },
    { id: 'i', paises: ['🇫🇷 FRANCIA', '🇸🇳 SENEGAL', '🇮🇶 IRAK', '🇳🇴 NORUEGA'] },
    { id: 'j', paises: ['🇦🇷 ARGENTINA', '🇩🇿 ARGELIA', '🇦🇹 AUSTRIA', '🇯🇴 JORDANIA'] },
    { id: 'k', paises: ['🇵🇹 PORTUGAL', '🇨🇩 RD CONGO', '🇺🇿 UZBEKISTÁN', '🇨🇴 COLOMBIA'] },
    { id: 'l', paises: ['🏴󠁧󠁢󠁥󠁮󠁧󠁿 INGLATERRA', '🇭🇷 CROACIA', '🇬🇭 GHANA', '🇵🇦 PANAMÁ'] },
  ];

  if (cargandoProde) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', color: 'var(--text-color)' }}>
        <h2>Cargando tu prode... ⚽</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: 'auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
      
      {/* PANEL DE CONTROL DEL BORRADOR */}
      <div style={{ 
        backgroundColor: 'var(--bg-card)', 
        padding: '15px 25px', 
        borderRadius: '12px', 
        border: '1px solid var(--border-color)', 
        marginBottom: '30px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>📝</span>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: 'bold', color: 'var(--text-color)', fontSize: '18px' }}>
              {prodeActivo?.nombre || 'Borrador sin nombre'}
            </div>
            <div style={{ fontSize: '13px', color: '#10b981', fontWeight: 'bold' }}>
              Autoguardado en la nube activado
            </div>
          </div>
        </div>
        
        <button 
          onClick={async () => {
            if(window.confirm('¿Estás seguro de descartar todo este prode y empezar de cero?')) {
              await descartarProde();
            }
          }} 
          style={{ 
            backgroundColor: '#ef4444', 
            color: 'white', 
            padding: '10px 20px', 
            borderRadius: '8px', 
            border: 'none', 
            cursor: 'pointer', 
            fontWeight: 'bold',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
        >
          Descartar y empezar de nuevo
        </button>
      </div>

      {/* LA GRILLA INTERACTIVA CON BANDERAS 2x2 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
        {estructuraMundial.map((datosGrupo) => (
          <Link 
            key={datosGrupo.id} 
            href={`/grupo/${datosGrupo.id}`}
            className="group"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '20px',
              backgroundColor: '#0070f3',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              minHeight: '200px',
              flex: '1 1 250px',
              maxWidth: '100%' 
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 15px rgba(0,0,0,0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            }}
          >
            <span style={{ fontSize: '24px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: '3px', width: '100%' }}>
              Grupo {datosGrupo.id}
            </span>

            {/* CONTENEDOR 2x2 CLÁSICO */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', margin: 'auto' }}>
              {datosGrupo.paises.map((pais, index) => {
                const bandera = pais.split(' ')[0]; // Extraemos solo el emoji de la bandera
                return (
                  <span key={index} style={{ fontSize: '48px', lineHeight: '1' }}>
                    {bandera}
                  </span>
                );
              })}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}