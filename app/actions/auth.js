'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function loginParent(prevState, formData) {
  const supabase = await createClient()

  const email = formData.get('email')
  const password = formData.get('password')

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/profile/Parents')
}

export async function loginSitter(prevState, formData) {
  const supabase = await createClient()

  const email = formData.get('email')
  const password = formData.get('password')

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/profile/Sitter')
}

export async function signupParent(prevState, formData) {
  const supabase = await createClient()

  const email = formData.get('email')
  const password = formData.get('password')
  const name = formData.get('name')
  const phone = formData.get('phone')
  const location = formData.get('location')
  const familyBio = formData.get('family_bio')
  const maxBudget = parseInt(formData.get('max_budget')) || 25
  const languages = formData.getAll('languages')
  const childCount = parseInt(formData.get('child_count')) || 1

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name, user_type: 'parent' } },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.user) {
    const { error: insertError } = await supabase.from('users').insert({
      id: data.user.id,
      email,
      name,
      user_type: 'parent',
      phone,
      preferred_location: location,
      family_bio: familyBio,
      max_budget: maxBudget,
      preferred_languages: languages,
    })

    if (insertError) {
      return { error: insertError.message }
    }

    for (let i = 0; i < childCount; i++) {
      const childName = formData.get(`child_name_${i}`)
      const childAge = parseInt(formData.get(`child_age_${i}`))
      const childNeeds = formData.getAll(`child_needs_${i}`)

      if (!childName) continue

      const { error: childError } = await supabase.from('children').insert({
        parent_id: data.user.id,
        name: childName,
        age: childAge,
        special_needs: childNeeds,
      })

      if (childError) {
        return { error: childError.message }
      }
    }
  }

  revalidatePath('/', 'layout')
  redirect('/profile/Parents')
}

export async function signupSitter(prevState, formData) {
  const supabase = await createClient()

  const email = formData.get('email')
  const password = formData.get('password')
  const name = formData.get('name')
  const phone = formData.get('phone')
  const bio = formData.get('bio')
  const hourlyRate = parseInt(formData.get('hourly_rate')) || 20
  const location = formData.get('location')
  const experience = parseInt(formData.get('experience')) || 0
  const languages = formData.get('languages')?.split(',').map(l => l.trim()).filter(Boolean) || ['English']
  const ageGroups = formData.getAll('age_groups')
  const specialNeedsExperience = formData.getAll('special_needs_experience')

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name, user_type: 'sitter' } },
  })

  if (error) return { error: error.message }

  if (data.user) {
    const { error: userError } = await supabase.from('users').insert({
      id: data.user.id,
      email,
      name,
      phone,
      user_type: 'sitter',
    })

    if (userError) return { error: userError.message }

    const { error: profileError } = await supabase.from('sitter_profiles').insert({
      user_id: data.user.id,
      bio,
      hourly_rate: hourlyRate,
      location,
      languages,
      experience,
      age_groups: ageGroups,
      special_needs_experience: specialNeedsExperience,
      background_check_status: 'pending',
    })

    if (profileError) return { error: profileError.message }
  }

  revalidatePath('/', 'layout')
  redirect('/profile/Sitter')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
