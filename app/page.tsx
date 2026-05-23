'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../src/lib/supabase';
import { cambiarPassword } from '../src/lib/actions';

export default function Login() {
  const router = useRouter();
  
  // Estados para Login/Registro
  const [isRegistro, setIsRegistro] = useState(false);
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  
  // Estados para Recuperación
  const [isRecuperando, setIsRecuperando] = useState(false);
  const [codigoIngresado, setCodigoIngresado] = useState('');
  const [usuarioRecuperado, setUsuarioRecuperado] = useState<{id: string, nickname: string} | null>(null);
  const [nuevaPassword, setNuevaPassword] = useState('');

  // Estados generales
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [codigoGenerado, setCodigoGenerado] = useState('');

  // --- 1. LOGIN Y REGISTRO NORMAL ---
  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(''); setExito('');

    if (nickname.length < 3) { setError('El nickname debe tener al menos 3 letras.'); setLoading(false); return; }
    if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres.'); setLoading(false); return; }

    const emailFalso = `${nickname.toLowerCase().replace(/\s+/g, '')}@prodemundial.local`;

    try {
      if (isRegistro) {
        const { data, error: signUpError } = await supabase.auth.signUp({ email: emailFalso, password });
        if (signUpError) {
          if (signUpError.message.includes('already registered')) throw new Error('Ese nickname ya está en uso.');
          throw signUpError;
        }

        if (data.user) {
          // Generamos un código más largo y bonito (ej: ABC-DEF-GHI) para usuarios nuevos
          const rawCode = Math.random().toString(36).substring(2, 11).toUpperCase();
          const codigoSecreto = rawCode.match(/.{1,3}/g)?.join('-') || rawCode;
          
          const { error: dbError } = await supabase.from('perfiles').insert({
            id: data.user.id, nickname, codigo_recuperacion: codigoSecreto
          });
          if (dbError) throw dbError;

          setCodigoGenerado(codigoSecreto);
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email: emailFalso, password });
        if (signInError) throw new Error('Nickname o contraseña incorrectos.');
        router.push('/panel');
      }
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  // --- 2. BUSCAR USUARIO POR CÓDIGO ---
  const verificarCodigo = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(''); setExito('');

    try {
      const { data, error: searchError } = await supabase
        .from('perfiles')
        .select('id, nickname')
        .eq('codigo_recuperacion', codigoIngresado.trim().toUpperCase())
        .single();

      if (searchError || !data) throw new Error('Código no válido o no encontrado.');
      
      setUsuarioRecuperado(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- 3. CAMBIAR LA CONTRASEÑA ---
  const confirmarNuevaPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(''); setExito('');

    if (nuevaPassword.length < 6) { setError('La contraseña debe tener al menos 6 caracteres.'); setLoading(false); return; }

    try {
      // Llamamos a nuestro Server Action seguro
      await cambiarPassword(usuarioRecuperado!.id, nuevaPassword);
      
      setExito('¡Contraseña cambiada con éxito! Ya podés iniciar sesión.');
      setTimeout(() => {
        setIsRecuperando(false);
        setUsuarioRecuperado(null);
        setNickname(usuarioRecuperado!.nickname); // Le precargamos el nombre
        setExito('');
      }, 3000);

    } catch (err: any) {
      setError('Hubo un error al cambiar la contraseña. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // VISTA: Registro Exitoso (Muestra el código)
  if (codigoGenerado) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
        <div style={{ backgroundColor: 'var(--bg-card)', padding: '40px', borderRadius: '16px', border: '1px solid var(--border-color)', textAlign: 'center', width: '100%', maxWidth: '500px' }}>
          <h2 style={{ fontSize: '28px', color: '#10b981', marginBottom: '15px' }}>¡Cuenta creada! 🎉</h2>
          <p style={{ color: 'var(--text-color)', marginBottom: '20px' }}>Tu usuario es <strong>{nickname}</strong>.</p>
          <div style={{ backgroundColor: 'var(--bg-color)', padding: '20px', borderRadius: '12px', border: '2px dashed var(--border-color)', marginBottom: '25px' }}>
            <p style={{ fontSize: '14px', opacity: 0.8, marginBottom: '10px' }}>⚠️ GUARDÁ ESTE CÓDIGO ⚠️<br/>Es la única forma de recuperar tu cuenta.</p>
            <span style={{ fontSize: '32px', fontWeight: 'bold', letterSpacing: '2px', color: '#0070f3' }}>{codigoGenerado}</span>
          </div>
          <button onClick={() => router.push('/panel')} style={{ backgroundColor: '#0070f3', color: 'white', padding: '14px', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer', width: '100%' }}>Ir a mi panel</button>
        </div>
      </div>
    );
  }

  // VISTA: Recuperar Contraseña
  if (isRecuperando) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
        <div style={{ backgroundColor: 'var(--bg-card)', padding: '40px', borderRadius: '16px', border: '1px solid var(--border-color)', width: '100%', maxWidth: '400px' }}>
          <h1 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '24px' }}>🛡️ Recuperar Cuenta</h1>
          
          {error && <div style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', textAlign: 'center', fontWeight: 'bold' }}>{error}</div>}
          {exito && <div style={{ backgroundColor: '#d1fae5', color: '#10b981', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', textAlign: 'center', fontWeight: 'bold' }}>{exito}</div>}

          {!usuarioRecuperado ? (
            <form onSubmit={verificarCodigo} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <p style={{ fontSize: '14px', opacity: 0.8, textAlign: 'center' }}>Ingresá tu código secreto para buscar tu perfil.</p>
              <input type="text" value={codigoIngresado} onChange={(e) => setCodigoIngresado(e.target.value)} placeholder="Ej: ABC-DEF-GHI" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', textAlign: 'center', fontWeight: 'bold', letterSpacing: '2px' }} />
              <button type="submit" disabled={loading} style={{ backgroundColor: '#0070f3', color: 'white', padding: '14px', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>{loading ? 'Buscando...' : 'Verificar Código'}</button>
            </form>
          ) : (
            <form onSubmit={confirmarNuevaPassword} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ backgroundColor: 'var(--bg-color)', padding: '15px', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '14px', opacity: 0.8 }}>Hola de nuevo,</span><br/>
                <strong style={{ fontSize: '20px', color: '#10b981' }}>{usuarioRecuperado.nickname}</strong>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>Nueva Contraseña</label>
                <input type="password" value={nuevaPassword} onChange={(e) => setNuevaPassword(e.target.value)} placeholder="••••••••" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }} />
              </div>
              <button type="submit" disabled={loading} style={{ backgroundColor: '#10b981', color: 'white', padding: '14px', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>{loading ? 'Guardando...' : 'Cambiar Contraseña'}</button>
            </form>
          )}

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button onClick={() => { setIsRecuperando(false); setUsuarioRecuperado(null); setError(''); }} style={{ background: 'none', border: 'none', color: 'var(--text-color)', opacity: 0.8, textDecoration: 'underline', cursor: 'pointer' }}>Volver al Inicio</button>
          </div>
        </div>
      </div>
    );
  }

  // VISTA: Normal (Login/Registro)
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
      <div style={{ backgroundColor: 'var(--bg-card)', padding: '40px', borderRadius: '16px', border: '1px solid var(--border-color)', width: '100%', maxWidth: '400px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '28px' }}>⚽ {isRegistro ? 'Crear Cuenta' : 'Iniciar Sesión'}</h1>
        
        {error && <div style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', textAlign: 'center', fontWeight: 'bold' }}>{error}</div>}

        <form onSubmit={manejarSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>Nickname</label>
            <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="Ej: eldiego10" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }} />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Contraseña</label>
              {!isRegistro && (
                <button type="button" onClick={() => setIsRecuperando(true)} style={{ background: 'none', border: 'none', color: '#0070f3', fontSize: '13px', cursor: 'pointer' }}>¿Olvidaste tu clave?</button>
              )}
            </div>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }} />
          </div>
          <button type="submit" disabled={loading} style={{ backgroundColor: '#0070f3', color: 'white', padding: '14px', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer', marginTop: '10px' }}>{loading ? 'Cargando...' : (isRegistro ? 'Registrarme' : 'Entrar')}</button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '25px' }}>
          <button onClick={() => { setIsRegistro(!isRegistro); setError(''); }} style={{ background: 'none', border: 'none', color: 'var(--text-color)', opacity: 0.8, textDecoration: 'underline', cursor: 'pointer', fontSize: '14px' }}>{isRegistro ? '¿Ya tenés cuenta? Iniciá sesión' : '¿No tenés cuenta? Creá una acá'}</button>
        </div>
      </div>
    </div>
  );
}