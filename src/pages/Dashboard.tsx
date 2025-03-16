
import { useAuth } from '@/hooks/use-auth';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VideoUploader from '@/components/video/VideoUploader';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, ArrowRight, UserPlus, Video } from 'lucide-react';
import VideoGallery from '@/components/video/VideoGallery';

const Dashboard = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [showVideoUploader, setShowVideoUploader] = useState(false);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  const isProfileComplete = profile && profile.firstName && profile.lastName &&
    (profile.skills_offered?.length > 0 || profile.skills_wanted?.length > 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome, {profile?.firstName || user.email}!</h1>
        <p className="text-muted-foreground">Manage your skills and connections from your dashboard</p>
      </header>

      <Tabs defaultValue="overview">
        <TabsList className="mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="skills">My Skills</TabsTrigger>
          <TabsTrigger value="videos">Skill Videos</TabsTrigger>
          <TabsTrigger value="connections">Connections</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Quick Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary/10 p-4 rounded-md">
                  <div className="text-2xl font-bold">{profile?.skills_offered?.length || 0}</div>
                  <div className="text-sm text-muted-foreground">Skills Offered</div>
                </div>
                <div className="bg-primary/10 p-4 rounded-md">
                  <div className="text-2xl font-bold">{profile?.skills_wanted?.length || 0}</div>
                  <div className="text-sm text-muted-foreground">Skills Wanted</div>
                </div>
                <div className="bg-primary/10 p-4 rounded-md">
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-muted-foreground">Connections</div>
                </div>
                <div className="bg-primary/10 p-4 rounded-md">
                  <div className="text-2xl font-bold">{profile?.points || 0}</div>
                  <div className="text-sm text-muted-foreground">Skill Points</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Get Started</h2>
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-between" onClick={() => navigate('/profile')}>
                  <div className="flex items-center">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Complete Your Profile
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between" onClick={() => setShowVideoUploader(true)}>
                  <div className="flex items-center">
                    <Video className="h-4 w-4 mr-2" />
                    Upload a Skill Video
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between" onClick={() => navigate('/explore')}>
                  <div className="flex items-center">
                    <Video className="h-4 w-4 mr-2" />
                    Explore Skills
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {!isProfileComplete && (
            <Alert className="mt-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Your profile is incomplete</AlertTitle>
              <AlertDescription>
                Complete your profile to increase your chances of finding skill swap partners.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
        
        <TabsContent value="skills">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">My Skills</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Skills I Offer</h3>
                {profile?.skills_offered && profile.skills_offered.length > 0 ? (
                  <ul className="space-y-2">
                    {profile.skills_offered.map((skill, index) => (
                      <li key={index} className="p-3 bg-muted rounded-md">{skill}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No skills added yet</p>
                )}
                <Button className="mt-4" onClick={() => navigate('/profile')}>Manage Skills</Button>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Skills I Want to Learn</h3>
                {profile?.skills_wanted && profile.skills_wanted.length > 0 ? (
                  <ul className="space-y-2">
                    {profile.skills_wanted.map((skill, index) => (
                      <li key={index} className="p-3 bg-muted rounded-md">{skill}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No skills added yet</p>
                )}
                <Button className="mt-4" onClick={() => navigate('/profile')}>Manage Skills</Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="videos">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">My Skill Videos</h2>
              <Button onClick={() => setShowVideoUploader(true)}>Upload Video</Button>
            </div>
            
            {showVideoUploader ? (
              <VideoUploader 
                onUploadComplete={() => setShowVideoUploader(false)}
              />
            ) : (
              <VideoGallery userId={user.id} />
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="connections">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">My Connections</h2>
            <div className="text-center py-12">
              <UserPlus className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No Connections Yet</h3>
              <p className="mt-2 text-muted-foreground">
                Connect with others to start swapping skills
              </p>
              <Button className="mt-4" onClick={() => navigate('/explore')}>Find People</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
