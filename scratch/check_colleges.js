
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing env vars')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkColleges() {
  const { data, error } = await supabase
    .from('colleges')
    .select('id, name, status, slug, domain, city')
  
  if (error) {
    console.error(error)
    return
  }
  
  console.log(JSON.stringify(data, null, 2))
}

checkColleges()
