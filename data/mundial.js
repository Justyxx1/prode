// src/data/mundial.js

export const gruposData = {
  a: ['🇲🇽 MÉXICO', '🇿🇦 SUDÁFRICA', '🇰🇷 COREA DEL SUR', '🇨🇿 REP. CHECA'],
  b: ['🇨🇦 CANADÁ', '🇧🇦 BOSNIA', '🇶🇦 QATAR', '🇨🇭 SUIZA'],
  c: ['🇧🇷 BRASIL', '🇲🇦 MARRUECOS', '🇭🇹 HAITÍ', '🏴󠁧󠁢󠁳󠁣󠁴󠁿 ESCOCIA'],
  d: ['🇺🇸 EE.UU.', '🇵🇾 PARAGUAY', '🇦🇺 AUSTRALIA', '🇹🇷 TURQUÍA'],
  e: ['🇩🇪 ALEMANIA', '🇨🇼 CURAZAO', '🇨🇮 C. DE MARFIL', '🇪🇨 ECUADOR'],
  f: ['🇳🇱 PAÍSES BAJOS', '🇯🇵 JAPÓN', '🇸🇪 SUECIA', '🇹🇳 TÚNEZ'],
  g: ['🇧🇪 BÉLGICA', '🇪🇬 EGIPTO', '🇮🇷 IRÁN', '🇳🇿 N. ZELANDA'],
  h: ['🇪🇸 ESPAÑA', '🇨🇻 CABO VERDE', '🇸🇦 ARABIA S.', '🇺🇾 URUGUAY'],
  i: ['🇫🇷 FRANCIA', '🇸🇳 SENEGAL', '🇮🇶 IRAK', '🇳🇴 NORUEGA'],
  j: ['🇦🇷 ARGENTINA', '🇩🇿 ARGELIA', '🇦🇹 AUSTRIA', '🇯🇴 JORDANIA'],
  k: ['🇵🇹 PORTUGAL', '🇨🇩 RD CONGO', '🇺🇿 UZBEKISTÁN', '🇨🇴 COLOMBIA'],
  l: ['🏴󠁧󠁢󠁥󠁮󠁧󠁿 INGLATERRA', '🇭🇷 CROACIA', '🇬🇭 GHANA', '🇵🇦 PANAMÁ'],
};

// Función auxiliar para generar los 6 partidos de un grupo de 4 equipos
export function generarPartidos(idGrupo) {
  const equipos = gruposData[idGrupo];
  if (!equipos) return [];

  // En un grupo de 4, todos juegan contra todos: son 6 partidos
  // Cruces estándar: 1-2, 3-4, 1-3, 4-2, 4-1, 2-3
  const cruces = [
    [0, 1], [2, 3], // Fecha 1
    [0, 2], [3, 1], // Fecha 2
    [3, 0], [1, 2]  // Fecha 3
  ];

  return cruces.map((indices, i) => ({
    id: `${idGrupo}-${i}`,
    local: equipos[indices[0]],
    visitante: equipos[indices[1]]
  }));
}