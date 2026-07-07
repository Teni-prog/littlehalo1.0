import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter(line => line.includes('='))
    .map(line => line.split('=').map(s => s.trim()))
)

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
)

const UNSPLASH_ACCESS_KEY = 'qEat8qlX9fuJh0ooUeaC9GphwK6NGxsiIXr5eNraNEU'

async function searchUnsplash(query) {
  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
    { headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` } }
  )
  const data = await res.json()
  return data.results?.[0]?.urls?.regular || null
}

async function run() {
  const { data: activities, error } = await supabase
    .from('micro_adventures')
    .select('id, name')
    .is('image_url', null)

  if (error) { console.error(error); return }

  for (const activity of activities) {
   const fallbacks = {
  'Bilingual Word Wall': 'child learning two languages drawing words',
  'Recipe Inventor': 'child writing drawing recipe kitchen',
  'Flag and Symbol Art': 'child drawing painting flag art',
  'Feelings Faces Gallery': 'child drawing emotions faces paper',
}

const query = fallbacks[activity.name] || `child ${activity.name} activity`
    const imageUrl = await searchUnsplash(query)

    if (imageUrl) {
      const { error: updateError } = await supabase
        .from('micro_adventures')
        .update({ image_url: imageUrl })
        .eq('id', activity.id)

      if (updateError) {
        console.error(`Failed to update ${activity.name}:`, updateError)
      } else {
        console.log(`✓ ${activity.name}`)
      }
    } else {
      console.log(`✗ No image found for ${activity.name}`)
    }

    // Respect Unsplash rate limit
    await new Promise(r => setTimeout(r, 500))
  }

  console.log('Done.')
}

run()