'use client';
import { useState, useMemo, use } from 'react';
import { generarPartidos } from '../../../data/mundial';
import TablaPosiciones from '../../../src/components/TablaPosiciones';
import Link from 'next/link';

// Usamos any temporalmente para los params para evitar errores estrictos de tipos en la prueba
export default function PaginaGrupo({ params }: { params: Promise<any> }) {
  const resolvedParams = use(params);
  const idGrupo = resolvedParams.id.toLowerCase();
  
  // Generamos los partidos del grupo de forma dinámica según la URL
  const partidos = useMemo(() => generarPartidos(idGrupo), [idGrupo]);
  
  // Estado para guardar los prodes tipeados
  const [prodes, setProdes] = useState<any>({});

  if (partidos.length === 0) return <div style={{ padding: '20px' }}>Grupo no encontrado</div>;

  const actualizarProde = (partidoId: string, equipo: 'local' | 'visitante', goles: string) => {
    setProdes({
      ...prodes,
      [partidoId]: {
        ...prodes[partidoId],
        [equipo]: goles === '' ? '' : Number(goles)
      }
    });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto', fontFamily: 'sans-serif' }}>
      
      {/* ELIMINAMOS el <Link> de "Volver al inicio" y el <h1> porque ya están en la barra */}

      <TablaPosiciones partidos={partidos} prodes={prodes} />

      {/* Actualizamos los fondos a dinámicos */}
      <div style={{ backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '12px', marginTop: '20px', border: '1px solid var(--border-color)' }}>
        <h2 style={{ marginTop: 0, color: 'var(--text-color)' }}>Cargar Resultados</h2>
        
        {partidos.map((partido: any) => (
          <div key={partido.id} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: '15px', 
            marginBottom: '15px',
            backgroundColor: 'var(--bg-color)', // Fondo dinámico oscuro/claro
            padding: '12px',
            borderRadius: '16px',
            border: '1px solid var(--border-color)'
          }}>
            <span style={{ flex: 1, textAlign: 'right', fontWeight: '500' }}>{partido.local}</span>
            
            <input 
              type="number" min="0" 
              style={{ width: '50px', padding: '8px', textAlign: 'center', borderRadius: '16px', border: '1px solid var(--border-color)' }}
              value={prodes[partido.id]?.local ?? ''}
              onChange={(e) => actualizarProde(partido.id, 'local', e.target.value)}
            />
            <span style={{ fontWeight: 'bold', color: 'var(--text-color)', opacity: 0.5 }}>-</span>
            <input 
              type="number" min="0" 
              style={{ width: '50px', padding: '8px', textAlign: 'center', borderRadius: '16px', border: '1px solid var(--border-color)' }}
              value={prodes[partido.id]?.visitante ?? ''}
              onChange={(e) => actualizarProde(partido.id, 'visitante', e.target.value)}
            />
            
            <span style={{ flex: 1, textAlign: 'left', fontWeight: '500' }}>{partido.visitante}</span>
          </div>
        ))}
      </div>
    </div>
  );
}