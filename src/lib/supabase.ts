import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Creamos el cliente de Supabase forzándolo a usar memoria aislada por pestaña
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Si estamos en el navegador, usamos sessionStorage (aislado). 
    // Si estamos en el servidor de Next.js, lo dejamos indefinido.
    storage: typeof window !== 'undefined' ? window.sessionStorage : undefined
  }
});