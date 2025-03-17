
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/auth-types';
import { toast } from '@/hooks/use-toast';

export const fetchProfile = async (userId: string): Promise<Profile | null> => {
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
      return profileData;
    }
    return null;
  } catch (err) {
    console.error('Error in fetchProfile:', err);
    toast({
      title: "Error",
      description: "Failed to load profile data",
      variant: "destructive"
    });
    return null;
  }
};

export const updateUserProfile = async (userId: string, data: Partial<Profile>): Promise<boolean> => {
  try {
    console.log('Updating profile with data:', data);
    
    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: data.firstName,
        last_name: data.lastName,
        skills_offered: data.skills_offered,
        skills_wanted: data.skills_wanted
      })
      .eq('id', userId);
    
    if (error) throw error;
    
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    });
    
    return true;
  } catch (err: any) {
    console.error('Error updating profile:', err);
    toast({
      title: "Update failed",
      description: err.message || "Failed to update your profile.",
      variant: "destructive"
    });
    return false;
  }
};
