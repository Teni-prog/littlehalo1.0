'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getTranslations, getLocale } from 'next-intl/server'

export async function loginParent(_prevState, formData) {
  const t = await getTranslations('authErrors')
  const supabase = await createClient()

  const email = formData.get('email')
  const password = formData.get('password')

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: error.message }
  }

  if (data.user?.user_metadata?.user_type !== 'parent') {
    await supabase.auth.signOut()
    return { error: t('noParentAccount') }
  }

  revalidatePath('/', 'layout')
  redirect({ href: '/profile/Parents', locale: await getLocale() })
}

export async function loginSitter(_prevState, formData) {
  const t = await getTranslations('authErrors')
  const supabase = await createClient()

  const email = formData.get('email')
  const password = formData.get('password')

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: error.message }
  }

  if (data.user?.user_metadata?.user_type !== 'sitter') {
    await supabase.auth.signOut()
    return { error: t('noSitterAccount') }
  }

  revalidatePath('/', 'layout')
  redirect({ href: '/profile/Sitter', locale: await getLocale() })
}

export async function signupParent(_prevState, formData) {
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
  const neighbourhood = formData.get('neighbourhood') || null
  const latitude     = formData.get('latitude')  ? parseFloat(formData.get('latitude'))  : null
  const longitude    = formData.get('longitude') ? parseFloat(formData.get('longitude')) : null

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name, user_type: 'parent' } },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.user) {
    // Use admin client so the insert works even before email confirmation
    const db = createAdminClient()
    const { error: insertError } = await db.from('users').insert({
      id: data.user.id,
      email,
      name,
      user_type: 'parent',
      phone,
      preferred_location: location,
      family_bio: familyBio,
      max_budget: maxBudget,
      preferred_languages: languages,
      neighbourhood,
      latitude,
      longitude,
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
  redirect({ href: '/profile/Parents', locale: await getLocale() })
}

export async function signupSitter(_prevState, formData) {
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
  redirect({ href: '/profile/Sitter', locale: await getLocale() })
}

export async function completeSitterSignup(_prevState, formData) {
  const t = await getTranslations('authErrors')
  try {
    const supabase = await createClient()

    const email    = formData.get('email')
    const password = formData.get('password')

    // Pre-check: catch duplicate emails before creating an auth user
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (existing) {
      return { error: t('accountAlreadyExists'), step: 1 }
    }

    // Create the auth user only now — nothing was created during the multi-step flow
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name: formData.get('name'), user_type: 'sitter' } },
    })

    if (signUpError) return { error: signUpError.message, step: 1 }
    if (!authData.user) return { error: t('accountCreationFailed'), step: 1 }

    const userId = authData.user.id

    const name           = formData.get('name')
    const phone          = formData.get('phone')
    const bio            = formData.get('bio')
    const country        = formData.get('country')
    const neighbourhood  = formData.get('neighbourhood') || null
    const latitude       = formData.get('latitude')  ? parseFloat(formData.get('latitude'))  : null
    const longitude      = formData.get('longitude') ? parseFloat(formData.get('longitude')) : null
    const experience     = parseInt(formData.get('experience'))  || 0
    const hourlyRate     = parseInt(formData.get('hourly_rate')) || 20
    const availability   = JSON.parse(formData.get('availability') || '{}')
    const languages      = formData.getAll('languages')
    const ageGroups      = formData.getAll('age_groups')
    const specialNeeds   = formData.getAll('special_needs')
    const certifications = formData.getAll('certifications')

    // Upload photo if provided (now we have the real user ID for the path)
    let avatarUrl = null
    const photoFile = formData.get('photo')
    if (photoFile && photoFile.size > 0) {
      try {
        const ext  = photoFile.name.split('.').pop()
        const path = `${userId}.${ext}`
        const bytes = await photoFile.arrayBuffer()
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(path, bytes, { contentType: photoFile.type, upsert: true })
        if (!uploadError) {
          const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path)
          avatarUrl = urlData.publicUrl
        }
      } catch { /* photo upload is non-critical — proceed without it */ }
    }

    // Insert users row
    const { error: userError } = await supabase.from('users').insert({
      id:        userId,
      email,
      name,
      phone,
      user_type: 'sitter',
      ...(avatarUrl ? { avatar: avatarUrl } : {}),
    })

    if (userError) {
      const msg = userError.code === '23505'
        ? t('accountAlreadyExists')
        : t('failedToSaveAccount', { message: userError.message })
      return { error: msg, step: 1 }
    }

    // Insert sitter_profiles row; on retry (unique violation), update instead
    const profileData = {
      user_id:                  userId,
      bio,
      hourly_rate:              hourlyRate,
      location:                 country,
      neighbourhood,
      latitude,
      longitude,
      languages,
      experience,
      age_groups:               ageGroups,
      special_needs_experience: specialNeeds,
      certifications,
      availability,
      background_check_status:  'pending',
    }

    const { error: profileError } = await supabase.from('sitter_profiles').insert(profileData)

    if (profileError) {
      if (profileError.code === '23505') {
        const { error: updateError } = await supabase
          .from('sitter_profiles')
          .update(profileData)
          .eq('user_id', userId)
        if (updateError) return { error: t('failedToSaveProfile', { message: updateError.message }), step: 4 }
      } else {
        return { error: t('failedToSaveProfile', { message: profileError.message }), step: 4 }
      }
    }

    revalidatePath('/', 'layout')
    return { success: true }
  } catch (e) {
    return { error: e?.message || t('unexpectedError') }
  }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect({ href: '/login', locale: await getLocale() })
}
