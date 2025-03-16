import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';

type UploadState = {
  progress: number;
  isUploading: boolean;
  error: string | null;
  videoUrl: string | null;
  thumbnailUrl: string | null;
};

export const useVideoUpload = () => {
  const { user } = useAuth();
  const [uploadState, setUploadState] = useState<UploadState>({
    progress: 0,
    isUploading: false,
    error: null,
    videoUrl: null,
    thumbnailUrl: null
  });

  const uploadVideo = async (file: File) => {
    if (!file || !user) return;
    
    // Validate file is video
    if (!file.type.startsWith('video/')) {
      setUploadState(prev => ({ ...prev, error: 'Please upload a video file' }));
      toast({
        title: "Upload Error",
        description: "Please upload a video file",
        variant: "destructive"
      });
      return;
    }

    try {
      setUploadState({
        progress: 0,
        isUploading: true,
        error: null,
        videoUrl: null,
        thumbnailUrl: null
      });

      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      console.log('Starting video upload:', fileName);
      
      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('skill_videos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;
      
      console.log('Video upload completed:', data);
      
      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('skill_videos')
        .getPublicUrl(fileName);
      
      if (publicUrlData) {
        setUploadState({
          progress: 100,
          isUploading: false,
          error: null,
          videoUrl: publicUrlData.publicUrl,
          thumbnailUrl: null // In a production app, you'd generate a thumbnail
        });
        
        toast({
          title: "Upload Complete",
          description: "Your video has been uploaded successfully!",
        });

        console.log('Video URL generated:', publicUrlData.publicUrl);
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadState(prev => ({
        ...prev,
        isUploading: false,
        error: error.message || 'Failed to upload video',
        progress: 0
      }));
      
      toast({
        title: "Upload Failed",
        description: error.message || "There was an error uploading your video. Please try again.",
        variant: "destructive"
      });
    }
  };

  const saveVideoDetails = async (title: string, description: string) => {
    if (!user || !uploadState.videoUrl) return;
    
    try {
      const { data, error } = await supabase
        .from('skill_videos')
        .insert([
          {
            user_id: user.id,
            title,
            description,
            video_url: uploadState.videoUrl,
            thumbnail_url: uploadState.thumbnailUrl
          }
        ]);
      
      if (error) throw error;
      
      return true;
    } catch (error: any) {
      console.error('Error saving video details:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save video details.",
        variant: "destructive"
      });
      return false;
    }
  };

  const resetUploadState = () => {
    setUploadState({
      progress: 0,
      isUploading: false,
      error: null,
      videoUrl: null,
      thumbnailUrl: null
    });
  };

  return {
    ...uploadState,
    uploadVideo,
    saveVideoDetails,
    resetUploadState
  };
};
