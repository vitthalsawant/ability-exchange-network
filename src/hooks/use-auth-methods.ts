import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { fetchProfile } from './use-profile';

export const loginUser = async (email: string, password: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error('Login error:', error);
      
      // Check specifically for email confirmation error
      if (error.message.includes('Email not confirmed')) {
        toast({
          title: "Email not confirmed",
          description: "Please check your inbox and confirm your email before logging in.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Login failed",
          description: error.message || "Please check your credentials and try again.",
          variant: "destructive"
        });
      }
      
      throw error;
    }
    
    if (data.user) {
      toast({
        title: "Login successful",
        description: "Welcome back to Skill Swap!",
      });
      return data.user;
    }
    return null;
  } catch (err: any) {
    console.error('Login error:', err);
    throw err;
  }
};

export const registerUser = async (
  email: string, 
  password: string, 
  firstName: string, 
  lastName: string
): Promise<User | null> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName
        }
      }
    });
    
    if (error) {
      throw error;
    }
    
    if (data.user) {
      // Update profile with first and last name
      await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName
        })
        .eq('id', data.user.id);
      
      await fetchProfile(data.user.id);
      
      toast({
        title: "Registration successful",
        description: "Welcome to Skill Swap!",
      });
      
      return data.user;
    }
    return null;
  } catch (err: any) {
    console.error('Registration error:', err);
    toast({
      title: "Registration failed",
      description: err.message || "Please try again with different credentials.",
      variant: "destructive"
    });
    throw err;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  } catch (err: any) {
    console.error('Logout error:', err);
    toast({
      title: "Logout failed",
      description: "There was an issue logging you out.",
      variant: "destructive"
    });
  }
};
