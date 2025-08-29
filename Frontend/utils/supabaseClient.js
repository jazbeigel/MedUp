import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://qhtjlctnsoajgouinjaq.supabase.co' // la URL real
// Usamos la clave completa en una sola cadena para evitar errores de concatenación
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFodGpsY3Ruc29hamdvdWluamFxIiwiY3JvbGUiOiJhbm9uIiwiaWF0IjoxNzQ5MDM1NjYzLCJleHAiOjIwNjQ2MTE2NjN9.AVpXetLCSZLG_hg0W4wSJGVvXuwaIiwo983QZZAshI8' // tu clave pública real

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

