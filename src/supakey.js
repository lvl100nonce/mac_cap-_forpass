import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const SUPABASE_READY = Boolean(supabaseUrl && supabaseKey)

if (!SUPABASE_READY) {
	console.warn('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables')
}

export const supabase = SUPABASE_READY ? createClient(supabaseUrl, supabaseKey) : null
