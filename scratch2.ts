import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function test() {
  const { data, error } = await supabase.from('sponsor_booth_visits').select('*, profiles(full_name, email)').limit(1);
  console.log('Error profiles:', error);
  console.log('Data:', data);
  
  const { data: d2, error: e2 } = await supabase.from('sponsor_booth_visits').select('*, profiles!sponsor_booth_visits_student_user_id_fkey(full_name, email)').limit(1);
  console.log('Error profiles!fkey:', e2);
}
test();
