import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check .env.local')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function getUserProfile(userId: number) {
  console.log('🔍 Fetching profile for userId:', userId)
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error('❌ Error fetching user profile:', { userId, error })
    return null
  }

  console.log('✅ Profile loaded:', data?.first_name)
  return data
}

export async function getTodayCalories(userId: number) {
  const today = new Date().toISOString().split('T')[0]
  console.log('🔍 Fetching calories for userId:', userId, 'date:', today)

  const { data, error } = await supabase
    .from('calories')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today)

  if (error) {
    console.error('❌ Error fetching calories:', { userId, date: today, error })
    return []
  }

  console.log('✅ Calories loaded:', data?.length, 'records')
  return data || []
}

export async function getStatsForPeriod(userId: number, days: number) {
  const now = new Date()
  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
  const startDateStr = startDate.toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('calories')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDateStr)
    .order('date', { ascending: false })

  if (error) {
    console.error('Error fetching stats:', error)
    return []
  }

  return data || []
}
