
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { Loader2, Video } from 'lucide-react';

type SkillVideo = {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string | null;
  created_at: string;
};

type VideoGalleryProps = {
  userId?: string; // If provided, show only videos from this user
};

const VideoGallery = ({ userId }: VideoGalleryProps) => {
  const { user } = useAuth();
  const [videos, setVideos] = useState<SkillVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        
        let query = supabase
          .from('skill_videos')
          .select('*')
          .order('created_at', { ascending: false });
        
        // If userId is provided, filter by that user
        if (userId) {
          query = query.eq('user_id', userId);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        setVideos(data as SkillVideo[]);
      } catch (err: any) {
        console.error('Error fetching videos:', err);
        setError(err.message || 'Failed to load videos');
      } finally {
        setLoading(false);
      }
    };
    
    fetchVideos();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Error: {error}</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <Video className="h-12 w-12 mx-auto text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">No Videos Found</h3>
        <p className="mt-2 text-muted-foreground">
          {userId && userId === user?.id
            ? "You haven't uploaded any videos yet."
            : "No videos available to display."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video) => (
        <Card key={video.id} className="overflow-hidden flex flex-col">
          <div className="relative aspect-video">
            <video 
              src={video.video_url} 
              className="w-full h-full object-cover"
              poster={video.thumbnail_url || undefined}
            />
          </div>
          <CardHeader className="p-4">
            <CardTitle className="text-lg line-clamp-2">{video.title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {video.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 flex-grow">
            <p className="text-sm text-muted-foreground">
              {new Date(video.created_at).toLocaleDateString()}
            </p>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button variant="outline" className="w-full" onClick={() => window.open(video.video_url, '_blank')}>
              Watch Video
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default VideoGallery;
