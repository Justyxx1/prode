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
  guardarPrediccion: (grupoId: string, partidoId: string, golesLocal: number | string, golesVisitante: number | string) => Promise<void>;
  descartarProde: () => Promise<void>;
};

const ProdeContext = createContext<ProdeContextType | undefined>(undefined);

export function ProdeProvider({ children }: { children: ReactNode }) {
  const [prodeActivo, setProdeActivo] = useState<Prode | null>(null);
  const [cargandoProde, setCargandoProde] = useState(true);

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
      }
    } catch (error) {
      console.error("Error inicializando prode:", error);
    } finally {
      setCargandoProde(false);
    }
  };

  const guardarPrediccion = async (grupoId: string, partidoId: string, golesLocal: number | string, golesVisitante: number | string) => {
    if (!prodeActivo) return;

    // FIJATE ACÁ: Ahora clonamos tanto el objeto principal como el sub-objeto del grupo
    // Esto genera una nueva referencia en memoria que React detecta perfectamente
    const nuevasPredicciones = {
      ...prodeActivo.datos_prediccion,
      [grupoId]: {
        ...(prodeActivo.datos_prediccion[grupoId] || {}),
        [partidoId]: { local: golesLocal, visitante: golesVisitante }
      }
    };

    // 1. Actualizamos el estado visual inmediatamente
    setProdeActivo({ ...prodeActivo, datos_prediccion: nuevasPredicciones });

    // 2. Guardamos en la base de datos en segundo plano
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
    await inicializarProde(); 
  };

  return (
    <ProdeContext.Provider value={{ prodeActivo, cargandoProde, inicializarProde, guardarPrediccion, descartarProde }}>
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