
import { useState, useEffect, createContext, useContext } from 'react';
import { toast } from '@/hooks/use-toast';

type User = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  skills_offered?: string[];
  skills_wanted?: string[];
  points?: number;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('skillswap_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error parsing stored user:', err);
      }
    }
    setLoading(false);
  }, []);

  // In a real app, this would interact with Supabase
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock login process - in production, this would call Supabase auth
      // const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      // For demo purposes, creating a mock user
      const mockUser: User = {
        id: 'user-' + Math.random().toString(36).substr(2, 9),
        email: email,
        firstName: 'Demo',
        lastName: 'User',
        skills_offered: ['Programming', 'Design'],
        skills_wanted: ['Cooking', 'Photography'],
        points: 100
      };
      
      setUser(mockUser);
      localStorage.setItem('skillswap_user', JSON.stringify(mockUser));
      toast({
        title: "Login successful",
        description: "Welcome back to Skill Swap!",
      });
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to login. Please check your credentials.');
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
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
      
      // Mock registration process - in production, this would call Supabase auth
      // const { data, error } = await supabase.auth.signUp({ email, password });
      
      // For demo purposes, creating a mock user
      const mockUser: User = {
        id: 'user-' + Math.random().toString(36).substr(2, 9),
        email: email,
        firstName: firstName,
        lastName: lastName,
        skills_offered: [],
        skills_wanted: [],
        points: 0
      };
      
      setUser(mockUser);
      localStorage.setItem('skillswap_user', JSON.stringify(mockUser));
      toast({
        title: "Registration successful",
        description: "Welcome to Skill Swap!",
      });
    } catch (err) {
      console.error('Registration error:', err);
      setError('Failed to register. Please try again.');
      toast({
        title: "Registration failed",
        description: "Please try again with different credentials.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Mock logout process
      // await supabase.auth.signOut();
      setUser(null);
      localStorage.removeItem('skillswap_user');
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (err) {
      console.error('Logout error:', err);
      toast({
        title: "Logout failed",
        description: "There was an issue logging you out.",
        variant: "destructive"
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
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
