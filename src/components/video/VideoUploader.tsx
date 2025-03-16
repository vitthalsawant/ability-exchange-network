
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useVideoUpload } from '@/hooks/use-video-upload';
import { Upload, Video, X } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';

type VideoUploaderProps = {
  onUploadComplete?: (videoUrl: string) => void;
};

const VideoUploader = ({ onUploadComplete }: VideoUploaderProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    isUploading, 
    progress, 
    error, 
    videoUrl, 
    uploadVideo, 
    saveVideoDetails,
    resetUploadState 
  } = useVideoUpload();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) {
    return (
      <div className="text-center py-12 bg-white p-6 rounded-lg shadow-md">
        <Video className="h-12 w-12 mx-auto text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">Authentication Required</h3>
        <p className="mt-2 text-muted-foreground">
          You need to be logged in to upload videos
        </p>
        <Button className="mt-4" onClick={() => navigate('/login')}>
          Sign In
        </Button>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadVideo(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      uploadVideo(file);
    }
  };

  const preventDefaults = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleCancel = () => {
    resetUploadState();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (videoUrl) {
      const saved = await saveVideoDetails(title, description);
      
      if (saved) {
        if (onUploadComplete) {
          onUploadComplete(videoUrl);
        }
        
        // Reset form
        resetUploadState();
        setTitle('');
        setDescription('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-6 bg-white rounded-lg shadow-md">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Upload a Skill Video</h2>
        <p className="text-muted-foreground">
          Share your skills with the community by uploading a demonstration or tutorial video
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Video Title
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title for your video"
            disabled={isUploading}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what you're teaching in this video"
            disabled={isUploading}
            required
          />
        </div>

        {!videoUrl ? (
          <div
            onDrop={handleDrop}
            onDragOver={preventDefaults}
            onDragEnter={preventDefaults}
            onDragLeave={preventDefaults}
            className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center hover:border-primary/50 transition-colors"
          >
            <div className="flex flex-col items-center space-y-4">
              <Upload className="h-12 w-12 text-muted-foreground" />
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Drag and drop your video here</h3>
                <p className="text-sm text-muted-foreground">
                  Or click to browse from your device
                </p>
              </div>
              <Input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
                id="video-upload"
                disabled={isUploading}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                <Video className="mr-2 h-4 w-4" />
                Select Video
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-lg overflow-hidden border">
            <video 
              src={videoUrl} 
              controls 
              className="w-full h-auto" 
              style={{ maxHeight: '300px' }}
            />
            <div className="p-3 bg-muted/20 flex justify-between items-center">
              <span className="text-sm font-medium truncate">Video uploaded successfully</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCancel}
              >
                <X className="h-4 w-4 mr-1" />
                Remove
              </Button>
            </div>
          </div>
        )}

        {isUploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Uploading...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        <div className="flex justify-end space-x-3">
          {isUploading && (
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={isUploading || !videoUrl || !title || !description}
          >
            {isUploading ? 'Uploading...' : 'Save Video'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default VideoUploader;
