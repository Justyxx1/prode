'use client';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProde } from '../../src/context/ProdeContext';

export default function NuevoProde() {
  const router = useRouter();
  // Traemos finalizarProde del contexto
  const { prodeActivo, cargandoProde, inicializarProde, finalizarProde } = useProde();

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
    { id: 'i', paises: ['🇫🇷 FRANCIA', '🇸🇳 SENEGAL', '🇮尋 IRAK', '🇳🇴 NORUEGA'] },
    { id: 'j', paises: ['🇦🇷 ARGENTINA', '🇩🇿 ARGELIA', '🇦🇹 AUSTRIA', '🇯🇴 JORDANIA'] },
    { id: 'k', paises: ['🇵🇹 PORTUGAL', '🇨🇩 RD CONGO', '🇺🇿 UZBEKISTÁN', '🇨🇴 COLOMBIA'] },
    { id: 'l', paises: ['🏴󠁧󠁢󠁥󠁮󠁧󠁿 INGLATERRA', '🇭🇷 CROACIA', '🇬🇭 GHANA', '🇵🇦 PANAMÁ'] },
  ];

  const obtenerEstadoGrupo = (grupoId: string) => {
    if (!prodeActivo || !prodeActivo.datos_prediccion) return null;
    
    const prediccionesGrupo = prodeActivo.datos_prediccion[grupoId] || {};
    const partidos = Object.values(prediccionesGrupo) as { local: any; visitante: any }[];
    const totalPartidos = 6;
    
    const partidosCompletos = partidos.filter(
      p => p.local !== undefined && p.local !== '' && p.visitante !== undefined && p.visitante !== ''
    ).length;

    const tieneProgreso = partidos.some(
      p => (p.local !== undefined && p.local !== '') || (p.visitante !== undefined && p.visitante !== '')
    );

    if (partidosCompletos === totalPartidos) {
      return '✅';
    } else if (tieneProgreso) {
      return '⏳';
    }
    return null;
  };

  // CONTROL DE CONTROL: Verifica si ABSOLUTAMENTE TODOS los grupos están terminados con éxito
  const todoCompleto = estructuraMundial.every(grupo => obtenerEstadoGrupo(grupo.id) === '✅');

  if (cargandoProde) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', color: 'var(--text-color)' }}>
        <h2>Cargando tu prode... ⚽</h2>
      </div>
    );
  }

  if (!prodeActivo) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', gap: '20px' }}>
        <h2 style={{ color: 'var(--text-color)' }}>No tenés ningún prode en curso.</h2>
        <Link href="/panel" style={{ backgroundColor: '#0070f3', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
          Volver al Menú Principal
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: 'auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
      
      {/* BOTÓN PARA VOLVER AL PANEL PRINCIPAL */}
      <div style={{ marginBottom: '20px', textAlign: 'left' }}>
        <Link href="/panel" style={{ color: 'var(--text-color)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '15px', opacity: 0.8 }}>
          ← Volver al Menú Principal
        </Link>
      </div>

      {/* PANEL DE CONTROL DEL BORRADOR CON EL NUEVO BOTÓN INTEGRADO */}
      <div style={{ 
        backgroundColor: 'var(--bg-card)', 
        padding: '15px 25px', 
        borderRadius: '12px', 
        border: '1px solid var(--border-color)', 
        marginBottom: '30px', 
        display: 'flex', 
        justifyContent: 'space-between', // Separa la info del botón
        alignItems: 'center',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
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

        {/* BOTÓN INTELIGENTE DE FINALIZAR */}
        <button
          disabled={!todoCompleto}
          onClick={async () => {
            if (window.confirm('¿Estás seguro de que querés guardar este prode definitivo? Una vez enviado ya no vas a poder editar tus predicciones.')) {
              await finalizarProde();
              router.push('/panel'); // Nos manda al panel donde veremos el fixture completado
            }
          }}
          style={{
            backgroundColor: todoCompleto ? '#10b981' : 'var(--border-color)',
            color: todoCompleto ? 'white' : 'var(--text-color)',
            padding: '10px 20px',
            borderRadius: '8px',
            fontWeight: 'bold',
            border: 'none',
            fontSize: '14px',
            cursor: todoCompleto ? 'pointer' : 'not-allowed',
            opacity: todoCompleto ? 1 : 0.5,
            transition: 'all 0.2s'
          }}
        >
          🚀 Guardar Prode Definitivo
        </button>
      </div>

      {/* GRILLA BANDERAS */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
        {estructuraMundial.map((datosGrupo) => (
          <Link 
            key={datosGrupo.id} 
            href={`/grupo/${datosGrupo.id}`}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', backgroundColor: '#0070f3', color: 'white', textDecoration: 'none', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', transition: 'transform 0.2s, box-shadow 0.2s', minHeight: '200px', flex: '1 1 250px', maxWidth: '100%' }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 8px 15px rgba(0,0,0,0.2)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'; }}
          >
            <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '24px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: '3px', width: '100%' }}>
              <span>Grupo {datosGrupo.id}</span>
              <span style={{ fontSize: '22px' }}>{obtenerEstadoGrupo(datosGrupo.id)}</span>
            </span>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', margin: 'auto' }}>
              {datosGrupo.paises.map((pais, index) => (
                <span key={index} style={{ fontSize: '48px', lineHeight: '1' }}>{pais.split(' ')[0]}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}