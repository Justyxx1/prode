'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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

  // --- NUEVO: GUARDIÁN DE PESTAÑAS (Walkie-Talkie) ---
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const canal = new BroadcastChannel('prode_auth_channel');

    canal.onmessage = async (event) => {
      // Si otra pestaña está intentando iniciar sesión...
      if (event.data.type === 'CHECK_LOGIN_ATTEMPT') {
        const { data: { session } } = await supabase.auth.getSession();
        
        // Si ESTA pestaña tiene el mismo usuario logueado, mandamos la alerta de bloqueo
        if (session && session.user.email === event.data.email) {
          canal.postMessage({ type: 'LOGIN_DENIED', email: event.data.email });
        }
      }
    };

    return () => canal.close();
  }, []);
  // --------------------------------------------------

  const inicializarProde = async () => {
    setCargandoProde(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setCargandoProde(false);
        return;
      }

      const userId = session.user.id;

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