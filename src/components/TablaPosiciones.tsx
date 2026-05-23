'use client';
import { useMemo } from 'react';

// Tipado estricto para que TypeScript no se queje
interface Partido {
  id: string;
  local: string;
  visitante: string;
}

interface TablaPosicionesProps {
  partidos: Partido[];
  prodes: Record<string, { local: string | number; visitante: string | number }>;
}

export default function TablaPosiciones({ partidos, prodes }: TablaPosicionesProps) {
  
  // useMemo obliga a React a recalcular la tabla SOLO cuando cambian los goles o los partidos
  const tabla = useMemo(() => {
    // 1. Preparamos los contadores en cero para cada equipo
    const equipos: Record<string, any> = {};
    partidos.forEach((p) => {
      if (!equipos[p.local]) equipos[p.local] = { nombre: p.local, pts: 0, pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0 };
      if (!equipos[p.visitante]) equipos[p.visitante] = { nombre: p.visitante, pts: 0, pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0 };
    });

    // 2. Revisamos cada partido para ver si el usuario le puso goles
    partidos.forEach((p) => {
      const prediccion = prodes[p.id];
      
      // Nos aseguramos de que haya algo escrito y no esté vacío
      if (prediccion && prediccion.local !== '' && prediccion.visitante !== '') {
        // Forzamos a que sean números enteros para no concatenar strings
        const golesL = parseInt(prediccion.local as string, 10);
        const golesV = parseInt(prediccion.visitante as string, 10);

        // Si son números válidos, hacemos la matemática
        if (!isNaN(golesL) && !isNaN(golesV)) {
          equipos[p.local].pj += 1;
          equipos[p.visitante].pj += 1;
          
          equipos[p.local].gf += golesL;
          equipos[p.visitante].gf += golesV;
          
          equipos[p.local].gc += golesV;
          equipos[p.visitante].gc += golesL;

          if (golesL > golesV) {
            equipos[p.local].pts += 3;
            equipos[p.local].pg += 1;
            equipos[p.visitante].pp += 1;
          } else if (golesL < golesV) {
            equipos[p.visitante].pts += 3;
            equipos[p.visitante].pg += 1;
            equipos[p.local].pp += 1;
          } else {
            equipos[p.local].pts += 1;
            equipos[p.visitante].pts += 1;
            equipos[p.local].pe += 1;
            equipos[p.visitante].pe += 1;
          }
        }
      }
    });

    // 3. Calculamos la Diferencia de Gol y ordenamos (Mayor Puntos -> Mayor DG -> Mayor GF)
    const listaEquipos = Object.values(equipos).map(e => ({ ...e, dg: e.gf - e.gc }));
    
    listaEquipos.sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts; // Prioridad 1: Puntos
      if (b.dg !== a.dg) return b.dg - a.dg;     // Prioridad 2: Diferencia de gol
      return b.gf - a.gf;                        // Prioridad 3: Goles a favor
    });

    return listaEquipos;
  }, [partidos, prodes]); // Esta es la línea mágica: "Recalculate cuando cambie 'prodes'"

  return (
    <div style={{ overflowX: 'auto', backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '14px', color: 'var(--text-color)' }}>
        <thead>
          <tr style={{ backgroundColor: 'var(--bg-color)', borderBottom: '2px solid var(--border-color)' }}>
            <th style={{ padding: '12px', textAlign: 'left' }}>Equipo</th>
            <th style={{ padding: '12px', width: '40px' }} title="Puntos">Pts</th>
            <th style={{ padding: '12px', width: '40px', opacity: 0.7 }} title="Partidos Jugados">PJ</th>
            <th style={{ padding: '12px', width: '40px', opacity: 0.7 }} title="Partidos Ganados">PG</th>
            <th style={{ padding: '12px', width: '40px', opacity: 0.7 }} title="Partidos Empatados">PE</th>
            <th style={{ padding: '12px', width: '40px', opacity: 0.7 }} title="Partidos Perdidos">PP</th>
            <th style={{ padding: '12px', width: '40px', opacity: 0.7 }} title="Goles a Favor">GF</th>
            <th style={{ padding: '12px', width: '40px', opacity: 0.7 }} title="Goles en Contra">GC</th>
            <th style={{ padding: '12px', width: '40px' }} title="Diferencia de Gol">DG</th>
          </tr>
        </thead>
        <tbody>
          {tabla.map((equipo, index) => (
            <tr key={equipo.nombre} style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: index < 2 ? 'rgba(16, 185, 129, 0.1)' : 'transparent' }}>
              <td style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>
                <span style={{ marginRight: '8px', opacity: 0.5, fontSize: '12px' }}>{index + 1}</span>
                {equipo.nombre}
              </td>
              <td style={{ padding: '12px', fontWeight: 'bold', color: '#10b981' }}>{equipo.pts}</td>
              <td style={{ padding: '12px', opacity: 0.8 }}>{equipo.pj}</td>
              <td style={{ padding: '12px', opacity: 0.8 }}>{equipo.pg}</td>
              <td style={{ padding: '12px', opacity: 0.8 }}>{equipo.pe}</td>
              <td style={{ padding: '12px', opacity: 0.8 }}>{equipo.pp}</td>
              <td style={{ padding: '12px', opacity: 0.8 }}>{equipo.gf}</td>
              <td style={{ padding: '12px', opacity: 0.8 }}>{equipo.gc}</td>
              <td style={{ padding: '12px', fontWeight: 'bold' }}>{equipo.dg > 0 ? `+${equipo.dg}` : equipo.dg}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}