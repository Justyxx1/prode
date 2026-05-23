'use server'; // Esto le dice a Next.js que este código NUNCA va al navegador, es 100% backend y seguro.

import { createClient } from '@supabase/supabase-js';

export async function cambiarPassword(userId: string, nuevaPassword: string) {
  // Usamos la llave maestra (service_role) en lugar de la pública
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  // Forzamos el cambio de contraseña directamente por ID
  const { error } = await supabaseAdmin.auth.admin.updateUserById(
    userId,
    { password: nuevaPassword }
  );

  if (error) {
    throw new Error(error.message);
  }
  
  return { success: true };
}