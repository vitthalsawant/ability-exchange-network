
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';
import { Navigate } from 'react-router-dom';
import ProfileEditor from '@/components/profile/ProfileEditor';
import VideoGallery from '@/components/video/VideoGallery';

const Profile = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-muted-foreground">Manage your personal information and skills</p>
      </header>

      <Tabs defaultValue="profile">
        <TabsList className="mb-8">
          <TabsTrigger value="profile">Edit Profile</TabsTrigger>
          <TabsTrigger value="videos">My Videos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <ProfileEditor />
        </TabsContent>
        
        <TabsContent value="videos">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-6">My Videos</h2>
            <VideoGallery userId={user.id} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
