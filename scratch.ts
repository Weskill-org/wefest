import { supabase } from './src/integrations/supabase/client';

async function test() {
  const { data, error } = await supabase.from('sponsor_booth_visits').select('*, profiles(*)').limit(1);
  console.log('Error:', error);
  console.log('Data:', data);
  
  const { data: d2, error: e2 } = await supabase.from('sponsor_booth_visits').select('*, student_profiles(*)').limit(1);
  console.log('Error2:', e2);
}
test();
