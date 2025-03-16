
import { User } from '@supabase/supabase-js';

export type Profile = {
  id: string;
  firstName: string;
  lastName: string;
  skills_offered: string[];
  skills_wanted: string[];
  points: number;
};

export type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
};
