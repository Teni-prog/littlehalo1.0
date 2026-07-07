'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'

export async function updateChild(prevState, formData) {
  const t = await getTranslations('authErrors')
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: t('notAuthenticated') }

  const childId = formData.get('child_id')
  const name = formData.get('name')
  const age = parseInt(formData.get('age'))
  const specialNeeds = formData.getAll('special_needs')

  const { error } = await supabase
    .from('children')
    .update({ name, age, special_needs: specialNeeds })
    .eq('id', childId)
    .eq('parent_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/profile/Parents')
  return { success: true }
}

export async function updateParentPreferences(prevState, formData) {
  const t = await getTranslations('authErrors')
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: t('notAuthenticated') }

  const location = formData.get('location')
  const maxBudget = parseInt(formData.get('max_budget')) || 25
  const languages = formData.getAll('languages')

  const { error } = await supabase
    .from('users')
    .update({
      preferred_location: location,
      max_budget: maxBudget,
      preferred_languages: languages,
    })
    .eq('id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/profile/Parents')
  return { success: true }
}
