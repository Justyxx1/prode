'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../src/lib/supabase';
import { useProde } from '../../src/context/ProdeContext';

export default function PanelPrincipal() {
  const router = useRouter();
  const { prodeActivo, cargandoProde, inicializarProde, crearProdeNuevo } = useProde();
  const [prodesCompletados, setProdesCompletados] = useState<any[]>([]);

  useEffect(() => {
    // 1. CAMBIO ACÁ: Chequeamos que el usuario realmente exista antes de cargar nada
    const chequearUsuario = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.replace('/'); // Si no hay sesión, al login directo
        return;
      }
      // Si todo está bien, cargamos los datos
      inicializarProde();
      cargarProdesCompletados();
    };

    chequearUsuario();
  }, []);

  const cargarProdesCompletados = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data, error } = await supabase
        .from('prodes')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('estado', 'completado')
        .order('creado_en', { ascending: false });
      
      if (!error && data) {
        setProdesCompletados(data);
      }
    }
  };

  const manejarCerrarSesion = async () => {
    if (window.confirm('¿Seguro que querés cerrar sesión?')) {
      await supabase.auth.signOut();
      // 2. CAMBIO ACÁ: Rompemos la caché del navegador para limpiar la sesión
      window.location.replace('/');
    }
  };

  const tieneBorrador = prodeActivo !== null;

  if (cargandoProde) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', color: 'var(--text-color)' }}>
        <h2>Cargando Menú... ⚽</h2>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '5px', color: 'var(--text-color)', textAlign: 'center' }}>¡Bienvenido al Prode! ⚽</h1>
      <p style={{ opacity: 0.7, marginBottom: '40px', textAlign: 'center' }}>Gestioná tus predicciones del torneo y revisá tus puntajes.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', alignItems: 'start' }}>
        
        {/* COLUMNA IZQUIERDA: ACCIONES DEL FIXTURE */}
        <div style={{ backgroundColor: 'var(--bg-card)', padding: '30px', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
          <h2 style={{ marginTop: 0, fontSize: '20px', marginBottom: '20px' }}>Acciones</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            
            {/* BOTÓN 1: INICIAR NUEVO PRODE */}
            <button
              onClick={async () => {
                await crearProdeNuevo();
                router.push('/nuevo-prode');
              }}
              disabled={tieneBorrador}
              style={{
                width: '100%',
                backgroundColor: tieneBorrador ? 'var(--border-color)' : '#0070f3',
                color: tieneBorrador ? 'var(--text-color)' : 'white',
                padding: '14px',
                borderRadius: '10px',
                fontWeight: 'bold',
                border: 'none',
                fontSize: '16px',
                cursor: tieneBorrador ? 'not-allowed' : 'pointer',
                opacity: tieneBorrador ? 0.5 : 1,
                transition: 'all 0.2s'
              }}
            >
              ➕ Iniciar Nuevo Prode
            </button>

            {/* BOTÓN 2: CONTINUAR PRODE */}
            <button
              onClick={() => router.push('/nuevo-prode')}
              disabled={!tieneBorrador}
              style={{
                width: '100%',
                backgroundColor: !tieneBorrador ? 'var(--border-color)' : '#10b981',
                color: !tieneBorrador ? 'var(--text-color)' : 'white',
                padding: '14px',
                borderRadius: '10px',
                fontWeight: 'bold',
                border: 'none',
                fontSize: '16px',
                cursor: !tieneBorrador ? 'not-allowed' : 'pointer',
                opacity: !tieneBorrador ? 0.5 : 1,
                transition: 'all 0.2s'
              }}
            >
              📝 Continuar Prode en Curso
            </button>

          </div>
        </div>

        {/* COLUMNA DERECHA: HISTORIAL DE PRODES COMPLETADOS */}
        <div style={{ backgroundColor: 'var(--bg-card)', padding: '30px', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
          <h2 style={{ marginTop: 0, fontSize: '20px', marginBottom: '20px' }}>Mis Prodes Completados</h2>
          
          {prodesCompletados.length === 0 ? (
            <p style={{ opacity: 0.6, fontSize: '14px', fontStyle: 'italic' }}>Todavía no guardaste ningún prode definitivo.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {prodesCompletados.map((prode) => (
                <div key={prode.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-color)', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{prode.nombre}</div>
                    <div style={{ fontSize: '12px', opacity: 0.5 }}>{new Date(prode.creado_en).toLocaleDateString()}</div>
                  </div>
                  <Link href={`/prode/${prode.id}`} style={{ color: '#0070f3', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}>
                    Ver respuestas →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* BOTÓN DE CIERRE DE SESIÓN AL FINAL */}
      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <button 
          onClick={manejarCerrarSesion}
          style={{ backgroundColor: 'transparent', color: '#ef4444', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', border: '2px solid #ef4444', cursor: 'pointer', fontSize: '14px', transition: 'all 0.2s' }}
          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#ef4444'; e.currentTarget.style.color = 'white'; }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#ef4444'; }}
        >
          🚪 Cerrar Sesión
        </button>
      </div>
    </div>
  );
}