'use client';
import Link from 'next/link';

export default function Inicio() {
  // Datos oficiales transcribidos de image_0.png con emojis agregados
  const estructuraMundial = [
    { id: 'a', paises: ['🇲🇽 MÉXICO', '🇿🇦 SUDÁFRICA', '🇰🇷 COREA', '🇨🇿 REP. CHECA'] },
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

  return (
    <div style={{ padding: '0px', maxWidth: '1200px', margin: 'auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <p style={{ marginBottom: '30px', fontSize: '18px', color: '#666' }}>
        Elegí un grupo para cargar tus predicciones:
      </p>
      
      {/* Grilla principal de 4 columnas (a b c d / e f g h / i j k l) */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '20px' 
      }}>
        {estructuraMundial.map((datosGrupo) => (
          <Link 
            key={datosGrupo.id} 
            href={`/grupo/${datosGrupo.id}`}
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
              minHeight: '160px' // Altura mínima para que todas queden parejas
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            }}
          >
            {/* Título del Grupo */}
            <span style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              textTransform: 'uppercase',
              marginBottom: '10px',
              borderBottom: '1px solid rgba(255,255,255,0.3)',
              paddingBottom: '3px',
              width: '100%'
            }}>
              Grupo {datosGrupo.id}
            </span>

            {/* GRUPO DE BANDERAS 2x2 (EL CAMBIO PRINCIPAL) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)', /* 2 columnas */
              gridTemplateRows: 'repeat(2, 1fr)',    /* 2 filas */
              gap: '12px', /* Espacio entre banderas */
              margin: 'auto 0' // Centrar verticalmente en el espacio sobrante
            }}>
              {datosGrupo.paises.map((pais, index) => {
                // Extraemos solo el emoji de la bandera (lo que está antes del espacio)
                const banderaOnly = pais.split(' ')[0];
                
                return (
                  <span key={index} style={{ 
                    fontSize: '32px', // Banderas más grandes
                    lineHeight: '1' // Evitar problemas de altura con emojis
                  }}>
                    {banderaOnly}
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