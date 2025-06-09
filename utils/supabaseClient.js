import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qhjtlctnsoajgosuifnjaq.supabase.co' 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoanRsY3Ruc29hamdvc3VpZm5qYXEifQ.l0EzYhRkJkhKnOIMpwhRpBeEFSStMnePPYIPijXah9E'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
