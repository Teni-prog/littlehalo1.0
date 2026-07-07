import { readFileSync } from 'fs'

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter(line => line.includes('='))
    .map(line => line.split('=').map(s => s.trim()))
)

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
)

const ANTHROPIC_API_KEY = env.ANTHROPIC_API_KEY

async function generateActivityData(name, description) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `You are helping populate a childcare platform called Little Halo with structured activity data. Given this activity name and description, return a JSON object with exactly these fields:

- category: one of "Empathy", "Creativity", "Problem Solving", "Language", "Physical", "Nature", "Social Skills"
- learning_goals: array of 3 short learning goal strings (e.g. "Name 6+ basic emotions")
- materials: array of 3-5 material strings (e.g. "Paper", "Crayons")
- steps: array of 4-6 step strings, each a single clear instruction
- accessibility_tags: array of applicable tags from: "Autism-Friendly", "Sensory-Safe", "ADHD-Suitable", "Non-Verbal OK", "Low-Stimulation"
- is_featured: true if this is a particularly engaging, well-rounded activity, otherwise false. Set true for roughly 5 out of 27 activities.

Return only valid JSON, no markdown, no explanation.

Activity name: ${name}
Description: ${description}`
      }]
    })
  })

  const data = await res.json()
  const text = data.content[0].text.trim()
  return JSON.parse(text)
}

async function run() {
  const { data: activities, error } = await supabase
    .from('micro_adventures')
    .select('id, name, description')

  if (error) { console.error(error); return }

  for (const activity of activities) {
    try {
      const generated = await generateActivityData(activity.name, activity.description)

      const { error: updateError } = await supabase
        .from('micro_adventures')
        .update({
          category: generated.category,
          learning_goals: generated.learning_goals,
          materials: generated.materials,
          steps: generated.steps,
          accessibility_tags: generated.accessibility_tags,
          is_featured: generated.is_featured
        })
        .eq('id', activity.id)

      if (updateError) {
        console.error(`Failed to update ${activity.name}:`, updateError)
      } else {
        console.log(`✓ ${activity.name} — ${generated.category}`)
      }
    } catch (err) {
      console.error(`✗ Error on ${activity.name}:`, err.message)
    }

    await new Promise(r => setTimeout(r, 500))
  }

  console.log('Done.')
}

run()