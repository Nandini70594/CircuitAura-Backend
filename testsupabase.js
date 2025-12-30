require('dotenv').config()
const supabase = require('./config/supabase')

async function test() {
  const { data, error } = await supabase.from('kits').select('*')
  if (error) {
    console.error('❌ Supabase error:', error.message)
  } else {
    console.log('✅ Supabase connected. All data:', data)
  }
}

test()
