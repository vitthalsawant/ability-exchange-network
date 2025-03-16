
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

type UploadState = {
  progress: number;
  isUploading: boolean;
  error: string | null;
  videoUrl: string | null;
};

export const useVideoUpload = () => {
  const [uploadState, setUploadState] = useState<UploadState>({
    progress: 0,
    isUploading: false,
    error: null,
    videoUrl: null
  });

  const uploadVideo = async (file: File) => {
    if (!file) return;
    
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
        videoUrl: null
      });

      // Mock upload progress updates
      const mockUpload = () => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setUploadState(prev => ({ ...prev, progress }));
          
          if (progress >= 100) {
            clearInterval(interval);
            
            // Mock successful upload
            const mockVideoUrl = URL.createObjectURL(file);
            setUploadState({
              progress: 100,
              isUploading: false,
              error: null,
              videoUrl: mockVideoUrl
            });
            
            toast({
              title: "Upload Complete",
              description: "Your video has been uploaded successfully!",
            });
          }
        }, 500);
      };

      mockUpload();

      // In a real app with Supabase, it would look something like:
      /*
      const fileName = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('videos')
        .upload(fileName, file, {
          onUploadProgress: (progress) => {
            const percentage = Math.round((progress.loaded / progress.total) * 100);
            setUploadState(prev => ({ ...prev, progress: percentage }));
          }
        });

      if (error) throw error;
      
      const { data: urlData } = supabase.storage
        .from('videos')
        .getPublicUrl(data.path);
        
      setUploadState({
        progress: 100,
        isUploading: false,
        error: null,
        videoUrl: urlData.publicUrl
      });
      */

    } catch (error) {
      console.error('Upload error:', error);
      setUploadState(prev => ({
        ...prev,
        isUploading: false,
        error: 'Failed to upload video',
        progress: 0
      }));
      
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your video. Please try again.",
        variant: "destructive"
      });
    }
  };

  const resetUploadState = () => {
    setUploadState({
      progress: 0,
      isUploading: false,
      error: null,
      videoUrl: null
    });
  };

  return {
    ...uploadState,
    uploadVideo,
    resetUploadState
  };
};
