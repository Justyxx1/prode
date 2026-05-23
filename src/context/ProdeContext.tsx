'use client';
import { createContext, useContext, useState, useRef, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

type Prode = {
  id: string;
  nombre: string;
  estado: string;
  datos_prediccion: any;
};

type ProdeContextType = {
  prodeActivo: Prode | null;
  cargandoProde: boolean;
  inicializarProde: () => Promise<void>;
  crearProdeNuevo: () => Promise<void>;
  guardarPrediccion: (grupoId: string, partidoId: string, golesLocal: number | string, golesVisitante: number | string) => Promise<void>;
  descartarProde: () => Promise<void>;
};

const ProdeContext = createContext<ProdeContextType | undefined>(undefined);

export function ProdeProvider({ children }: { children: ReactNode }) {
  const [prodeActivo, setProdeActivo] = useState<Prode | null>(null);
  const [cargandoProde, setCargandoProde] = useState(true);
  
  // Referencia para el Guardián de Supabase (evita que se abra dos veces)
  const guardianRealtime = useRef<any>(null);

  const inicializarProde = async () => {
    setCargandoProde(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setCargandoProde(false);
        return;
      }

      const userId = session.user.id;

      // --- NUEVO: GUARDIÁN CROSS-BROWSER EN TIEMPO REAL ---
      if (!guardianRealtime.current) {
        const miTokenLocal = sessionStorage.getItem('prode_session_token');
        
        guardianRealtime.current = supabase.channel(`sesion_${userId}`)
          .on('postgres_changes', { 
            event: 'UPDATE', 
            schema: 'public', 
            table: 'perfiles', 
            filter: `id=eq.${userId}` 
          }, async (payload) => {
            // Si el token en la BD cambió y ya no coincide con el mío, me patearon
            if (payload.new.session_token && payload.new.session_token !== miTokenLocal) {
              await supabase.auth.signOut();
              sessionStorage.removeItem('prode_session_token');
              window.location.replace('/?kicked=true');
            }
          })
          .subscribe();
      }
      // ---------------------------------------------------

      const { data: borradores, error: fetchError } = await supabase
        .from('prodes')
        .select('*')
        .eq('user_id', userId)
        .eq('estado', 'borrador')
        .limit(1);

      if (fetchError) throw fetchError;

      if (borradores && borradores.length > 0) {
        setProdeActivo(borradores[0]);
      } else {
        setProdeActivo(null);
      }
    } catch (error) {
      console.error("Error inicializando prode:", error);
    } finally {
      setCargandoProde(false);
    }
  };

  const crearProdeNuevo = async () => {
    setCargandoProde(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const userId = session.user.id;

      const { data: nuevoProde, error: insertError } = await supabase
        .from('prodes')
        .insert({
          user_id: userId,
          nombre: 'Mi Prode',
          estado: 'borrador',
          datos_prediccion: {}
        })
        .select()
        .single();

      if (insertError) throw insertError;
      setProdeActivo(nuevoProde);
    } catch (error) {
      console.error("Error creando prode:", error);
    } finally {
      setCargandoProde(false);
    }
  };

  const guardarPrediccion = async (grupoId: string, partidoId: string, golesLocal: number | string, golesVisitante: number | string) => {
    if (!prodeActivo) return;

    const nuevasPredicciones = {
      ...prodeActivo.datos_prediccion,
      [grupoId]: {
        ...(prodeActivo.datos_prediccion[grupoId] || {}),
        [partidoId]: { local: golesLocal, visitante: golesVisitante }
      }
    };

    setProdeActivo({ ...prodeActivo, datos_prediccion: nuevasPredicciones });

    const { error } = await supabase
      .from('prodes')
      .update({ datos_prediccion: nuevasPredicciones })
      .eq('id', prodeActivo.id);
      
    if (error) console.error("Error autoguardando en la nube:", error);
  };

  const descartarProde = async () => {
    if (!prodeActivo) return;
    setCargandoProde(true);
    await supabase.from('prodes').delete().eq('id', prodeActivo.id);
    setProdeActivo(null);
    setCargandoProde(false);
  };

  return (
    <ProdeContext.Provider value={{ prodeActivo, cargandoProde, inicializarProde, crearProdeNuevo, guardarPrediccion, descartarProde }}>
      {children}
    </ProdeContext.Provider>
  );
}

export const useProde = () => {
  const context = useContext(ProdeContext);
  if (context === undefined) {
    throw new Error('useProde debe usarse dentro de un ProdeProvider');
  }
  return context;
};