import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hgbnpyqcagzuejuhcmwm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnYm5weXFjYWd6dWVqdWhjbXdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyOTg5MTgsImV4cCI6MjA1Njg3NDkxOH0.UZm2Mt3hFzhOoGazLJXwAlmnJu9jWK359NbsAXdRBGQ'

export const supabase = createClient(supabaseUrl, supabaseKey)
