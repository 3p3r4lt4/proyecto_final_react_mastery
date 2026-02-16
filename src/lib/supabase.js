/**
 * Supabase Client Configuration
 * @description Cliente de Supabase configurado para autenticación
 */

import { createClient } from '@supabase/supabase-js'

// Variables de entorno - En producción usar .env

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Opciones de configuración del cliente
const options = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
}

// Crear y exportar cliente
export const supabase = createClient(supabaseUrl, supabaseAnonKey, options)

// Helper para verificar conexión
export const checkConnection = async () => {
  try {
    const { error } = await supabase.auth.getSession()
    return !error
  } catch {
    return false
  }
}
