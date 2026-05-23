'use client';
import { useMemo, use, useEffect } from 'react';
import { generarPartidos } from '../../../data/mundial';
import TablaPosiciones from '../../../src/components/TablaPosiciones';
import { useProde } from '../../../src/context/ProdeContext';

export default function PaginaGrupo({ params }: { params: Promise<any> }) {
  const resolvedParams = use(params);
  const idGrupo = resolvedParams.id.toLowerCase();
  
  const { prodeActivo, guardarPrediccion, inicializarProde, cargandoProde } = useProde();
  
  useEffect(() => {
    if (!prodeActivo) {
      inicializarProde();
    }
  }, []);
  
  const partidos = useMemo(() => generarPartidos(idGrupo), [idGrupo]);
  const prodesDelGrupo = prodeActivo?.datos_prediccion?.[idGrupo] || {};

  if (cargandoProde) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', color: 'var(--text-color)' }}>
        <h2>Recuperando datos... ⚽</h2>
      </div>
    );
  }

  if (partidos.length === 0) return <div style={{ padding: '20px' }}>Grupo no encontrado</div>;

  const actualizarProde = (partidoId: string, equipo: 'local' | 'visitante', goles: string) => {
    const golesLocalActual = equipo === 'local' ? goles : (prodesDelGrupo[partidoId]?.local ?? '');
    const golesVisitanteActual = equipo === 'visitante' ? goles : (prodesDelGrupo[partidoId]?.visitante ?? '');

    guardarPrediccion(idGrupo, partidoId, golesLocalActual, golesVisitanteActual);
  };

  // Función mágica para separar el emoji de la bandera del nombre del país
  const separarBandera = (texto: string) => {
    const partes = texto.split(' ');
    const bandera = partes[0];
    const nombre = partes.slice(1).join(' '); // Vuelve a unir el nombre por si tiene más de una palabra
    return { bandera, nombre };
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto', fontFamily: 'sans-serif' }}>
      
      <TablaPosiciones partidos={partidos} prodes={prodesDelGrupo} />

      <div style={{ backgroundColor: 'var(--bg-card)', padding: '20px', borderRadius: '12px', marginTop: '20px', border: '1px solid var(--border-color)' }}>
        <h2 style={{ marginTop: 0, color: 'var(--text-color)' }}>Cargar Resultados</h2>
        
        {partidos.map((partido: any) => {
          // Separamos la info de cada equipo antes de mostrarla
          const local = separarBandera(partido.local);
          const visitante = separarBandera(partido.visitante);

          return (
            <div key={partido.id} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: '15px', 
              marginBottom: '15px',
              backgroundColor: 'var(--bg-color)',
              padding: '12px',
              borderRadius: '16px',
              border: '1px solid var(--border-color)'
            }}>
              
              {/* EQUIPO LOCAL: Nombre a la izquierda - Bandera a la derecha */}
              <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: '500', textAlign: 'right' }}>{local.nombre}</span>
                <span style={{ fontSize: '20px', lineHeight: '1' }}>{local.bandera}</span>
              </div>
              
              <input 
                type="number" min="0" 
                style={{ width: '50px', padding: '8px', textAlign: 'center', borderRadius: '16px', border: '1px solid var(--border-color)' }}
                value={prodesDelGrupo[partido.id]?.local ?? ''}
                onChange={(e) => actualizarProde(partido.id, 'local', e.target.value)}
              />
              
              <span style={{ fontWeight: 'bold', color: 'var(--text-color)', opacity: 0.5 }}>-</span>
              
              <input 
                type="number" min="0" 
                style={{ width: '50px', padding: '8px', textAlign: 'center', borderRadius: '16px', border: '1px solid var(--border-color)' }}
                value={prodesDelGrupo[partido.id]?.visitante ?? ''}
                onChange={(e) => actualizarProde(partido.id, 'visitante', e.target.value)}
              />
              
              {/* EQUIPO VISITANTE: Bandera a la izquierda - Nombre a la derecha */}
              <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-start', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px', lineHeight: '1' }}>{visitante.bandera}</span>
                <span style={{ fontWeight: '500', textAlign: 'left' }}>{visitante.nombre}</span>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}