import { supabase } from './supabaseClient'

export type UserRegistrationData = {
  email: string
  password: string
  fullName: string
  avatarUrl?: string
}

export async function registerUser(userData: UserRegistrationData) {
  try {
    // 1. Register the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    })

    if (authError) throw authError

    // 2. Update the user's profile with additional information
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        full_name: userData.fullName,
        avatar_url: userData.avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', authData.user?.id)

    if (profileError) throw profileError

    return { data: authData, error: null }
  } catch (error) {
    console.error('Registration error:', error)
    return { data: null, error }
  }
}

// Function to check if user is logged in
export async function checkAuthStatus() {
  const { data: { session }, error } = await supabase.auth.getSession()
  return { session, error }
}

// Function to handle login
export async function loginUser(email: string, password: string) {
  try {
    // Check if email and password are provided
    if (!email || !password) {
      throw new Error('Email and password are required')
    }

    // Attempt to sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw error
    }

    return { data, error: null }
  } catch (error) {
    console.error('Login error:', error)
    return { 
      data: null, 
      error: error.message || 'An error occurred during login'
    }
  }
} 