export default function TablaPosiciones({ partidos, prodes }: { partidos: any[], prodes: any }) {
  // 1. Preparamos un objeto para guardar las estadísticas de cada equipo
  const estadisticas: any = {};

  // 2. Inicializamos todos los equipos del grupo en cero
  partidos.forEach(p => {
    if (!estadisticas[p.local]) estadisticas[p.local] = { nombre: p.local, pts: 0, pj: 0, gf: 0, gc: 0, dif: 0 };
    if (!estadisticas[p.visitante]) estadisticas[p.visitante] = { nombre: p.visitante, pts: 0, pj: 0, gf: 0, gc: 0, dif: 0 };
  });

  // 3. Calculamos los puntos en base a los prodes que están llenos
  partidos.forEach(partido => {
    const prode = prodes[partido.id];
    
    // Solo calculamos si el usuario ingresó ambos goles
    if (prode && typeof prode.local === 'number' && typeof prode.visitante === 'number') {
      const gL = Number(prode.local);
      const gV = Number(prode.visitante);

      // Partidos jugados y goles a favor/contra
      estadisticas[partido.local].pj += 1;
      estadisticas[partido.visitante].pj += 1;
      estadisticas[partido.local].gf += gL;
      estadisticas[partido.local].gc += gV;
      estadisticas[partido.visitante].gf += gV;
      estadisticas[partido.visitante].gc += gL;

      // Cálculo de puntos
      if (gL > gV) {
        estadisticas[partido.local].pts += 3; // Gana local
      } else if (gV > gL) {
        estadisticas[partido.visitante].pts += 3; // Gana visitante
      } else {
        estadisticas[partido.local].pts += 1; // Empate
        estadisticas[partido.visitante].pts += 1;
      }
    }
  });

  // 4. Transformamos el objeto en una lista y la ordenamos
  const tablaOrdenada = Object.values(estadisticas).sort((a: any, b: any) => {
    if (b.pts !== a.pts) return b.pts - a.pts; // Mayor puntaje primero
    
    const difA = a.gf - a.gc;
    const difB = b.gf - b.gc;
    if (difB !== difA) return difB - difA; // Si empatan en puntos, mayor diferencia de gol
    
    return b.gf - a.gf; // Si empatan en diferencia, mayor cantidad de goles a favor
  });

  // 5. Dibujamos la tabla
  return (
    <div style={{ overflowX: 'auto', marginBottom: '30px' }}>
      {/* CAMBIO 1: backgroundColor usa var(--bg-card) */}
      <table style={{ 
        width: '100%', 
        borderCollapse: 'collapse', 
        backgroundColor: 'var(--bg-card)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        <thead>
          <tr style={{ backgroundColor: '#0070f3', color: 'white' }}>
            <th style={{ padding: '12px', textAlign: 'left' }}>Equipo</th>
            <th style={{ padding: '12px', textAlign: 'center' }}>PJ</th>
            <th style={{ padding: '12px', textAlign: 'center' }}>Pts</th>
            <th style={{ padding: '12px', textAlign: 'center' }}>GF</th>
            <th style={{ padding: '12px', textAlign: 'center' }}>GC</th>
            <th style={{ padding: '12px', textAlign: 'center' }}>DIF</th>
          </tr>
        </thead>
        <tbody>
          {tablaOrdenada.map((equipo: any, index: number) => {
            const diferencia = equipo.gf - equipo.gc;
            return (
                <tr 
                  key={equipo.nombre} 
                  className={index < 2 ? 'fila-clasificada' : ''}
                  style={{ borderBottom: '1px solid var(--border-color)' }}
                >
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>{equipo.nombre}</td>
                  <td style={{ padding: '12px', textAlign: 'center', color: 'var(--text-color)', opacity: 0.8 }}>{equipo.pj}</td>
                  <td style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', fontSize: '1.1em' }}>{equipo.pts}</td>
                  <td style={{ padding: '12px', textAlign: 'center', color: 'var(--text-color)', opacity: 0.8 }}>{equipo.gf}</td>
                  <td style={{ padding: '12px', textAlign: 'center', color: 'var(--text-color)', opacity: 0.8 }}>{equipo.gc}</td>
                  <td style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', color: diferencia > 0 ? '#10b981' : diferencia < 0 ? '#ef4444' : 'var(--text-color)' }}>
                    {diferencia > 0 ? `+${diferencia}` : diferencia}
                  </td>
                </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}