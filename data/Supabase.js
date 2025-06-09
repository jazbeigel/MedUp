import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://tu-supabase-url.supabase.co' // reemplaza con tu URL
const SUPABASE_ANON_KEY = 'tu-anon-key' // reemplaza con tu anon key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
