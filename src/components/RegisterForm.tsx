import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { toast } from './ui/use-toast' // Assuming you're using this for notifications

export function RegisterForm() {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        throw error
      }

      toast({
        title: "Registration successful",
        description: "Please check your email for verification link",
      })
      
    } catch (error) {
      console.error('Registration error:', error)
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message || "An error occurred during registration",
      })
    } finally {
      setLoading(false)
    }
  }

  // ... rest of your component JSX
} 