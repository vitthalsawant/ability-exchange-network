import { useState, useEffect, createContext, useContext } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

type Profile = {
  id: string;
  firstName: string;
  lastName: string;
  skills_offered: string[];
  skills_wanted: string[];
  points: number;
};

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session
    const initAuth = async () => {
      setLoading(true);
      
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          
          // Fetch user profile
          await fetchProfile(session.user.id);
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        setError('Failed to initialize authentication');
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      }
    );

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }

      if (data) {
        const profileData: Profile = {
          id: data.id,
          firstName: data.first_name || '',
          lastName: data.last_name || '',
          skills_offered: data.skills_offered || [],
          skills_wanted: data.skills_wanted || [],
          points: data.points || 0
        };
        console.log('Profile data fetched:', profileData);
        setProfile(profileData);
      }
    } catch (err) {
      console.error('Error in fetchProfile:', err);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive"
      });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        setUser(data.user);
        await fetchProfile(data.user.id);
        
        toast({
          title: "Login successful",
          description: "Welcome back to Skill Swap!",
        });
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login');
      toast({
        title: "Login failed",
        description: err.message || "Please check your credentials and try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      setLoading(true);
      setError(null);
      
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
        setUser(data.user);
        
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
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to register');
      toast({
        title: "Registration failed",
        description: err.message || "Please try again with different credentials.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
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

  const updateProfile = async (data: Partial<Profile>) => {
    if (!user) return;
    
    try {
      setLoading(true);
      console.log('Updating profile with data:', data);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: data.firstName,
          last_name: data.lastName,
          skills_offered: data.skills_offered,
          skills_wanted: data.skills_wanted
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Refresh profile data
      await fetchProfile(user.id);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (err: any) {
      console.error('Error updating profile:', err);
      toast({
        title: "Update failed",
        description: err.message || "Failed to update your profile.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      loading, 
      error, 
      login, 
      register, 
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
