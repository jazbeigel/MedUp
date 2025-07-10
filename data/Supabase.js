import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://qhtjlctnsoajgouinjaq.supabase.co' // la URL real
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFodGpsY3Ruc29hamdvdWluamFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwMzU2NjMsImV4cCI6MjA2NDYxMTY2M30.AVpXetLCSZLG_hg0W4wSJGVvXuwaIiwo983QZZAshI8'   // tu clave pública real

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
