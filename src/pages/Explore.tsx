
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import VideoGallery from '@/components/video/VideoGallery';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Explore Skills</h1>
        <p className="text-muted-foreground">Discover videos and find people to learn from</p>
      </header>
      
      <div className="flex mb-8">
        <Input
          placeholder="Search for skills or topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md rounded-r-none"
        />
        <Button className="rounded-l-none">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>

      <Tabs defaultValue="videos">
        <TabsList className="mb-8">
          <TabsTrigger value="videos">All Videos</TabsTrigger>
          <TabsTrigger value="categories">Popular Categories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="videos">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-6">Skill Videos</h2>
            <VideoGallery />
          </div>
        </TabsContent>
        
        <TabsContent value="categories">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {['Programming', 'Design', 'Music', 'Cooking', 'Languages', 'Fitness', 'Photography', 'Art', 'Crafts'].map((category) => (
              <Card key={category} className="cursor-pointer hover:bg-muted/20 transition-colors">
                <CardHeader>
                  <CardTitle>{category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Find people sharing their {category.toLowerCase()} skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                      <Badge key={level} variant="outline">
                        {level}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Explore;
