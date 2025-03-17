import { useState, useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus, X } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters')
});

type FormValues = z.infer<typeof formSchema>;

const ProfileEditor = () => {
  const { profile, loading, updateProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [offeredSkill, setOfferedSkill] = useState('');
  const [wantedSkill, setWantedSkill] = useState('');
  const [skills, setSkills] = useState({
    offered: [] as string[],
    wanted: [] as string[]
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: ''
    }
  });

  useEffect(() => {
    if (profile) {
      console.log('Setting form values from profile:', profile);
      form.reset({
        firstName: profile.firstName || '',
        lastName: profile.lastName || ''
      });
      setSkills({
        offered: profile.skills_offered || [],
        wanted: profile.skills_wanted || []
      });
    }
  }, [profile, form]);

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      await updateProfile({
        firstName: values.firstName,
        lastName: values.lastName,
        skills_offered: skills.offered,
        skills_wanted: skills.wanted
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addOfferedSkill = () => {
    if (offeredSkill.trim() && !skills.offered.includes(offeredSkill.trim())) {
      setSkills(prev => ({
        ...prev,
        offered: [...prev.offered, offeredSkill.trim()]
      }));
      setOfferedSkill('');
    }
  };

  const addWantedSkill = () => {
    if (wantedSkill.trim() && !skills.wanted.includes(wantedSkill.trim())) {
      setSkills(prev => ({
        ...prev,
        wanted: [...prev.wanted, wantedSkill.trim()]
      }));
      setWantedSkill('');
    }
  };

  const removeOfferedSkill = (skill: string) => {
    setSkills(prev => ({
      ...prev,
      offered: prev.offered.filter(s => s !== skill)
    }));
  };

  const removeWantedSkill = (skill: string) => {
    setSkills(prev => ({
      ...prev,
      wanted: prev.wanted.filter(s => s !== skill)
    }));
  };

  if (loading || !profile) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Your Profile</CardTitle>
        <CardDescription>
          Update your personal information and manage your skills
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <FormLabel htmlFor="skills-offered">Skills I Can Offer</FormLabel>
                <div className="flex mt-1.5">
                  <Input
                    id="skills-offered"
                    value={offeredSkill}
                    onChange={(e) => setOfferedSkill(e.target.value)}
                    placeholder="Add a skill you can teach others"
                    className="rounded-r-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addOfferedSkill();
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    onClick={addOfferedSkill}
                    className="rounded-l-none"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {skills.offered.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {skills.offered.map((skill) => (
                      <Badge key={skill} variant="secondary" className="gap-1">
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeOfferedSkill(skill)}
                          className="rounded-full hover:bg-secondary/80 ml-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mt-2">
                    No skills added yet
                  </p>
                )}
              </div>
              
              <div>
                <FormLabel htmlFor="skills-wanted">Skills I Want to Learn</FormLabel>
                <div className="flex mt-1.5">
                  <Input
                    id="skills-wanted"
                    value={wantedSkill}
                    onChange={(e) => setWantedSkill(e.target.value)}
                    placeholder="Add a skill you want to learn"
                    className="rounded-r-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addWantedSkill();
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    onClick={addWantedSkill}
                    className="rounded-l-none"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {skills.wanted.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {skills.wanted.map((skill) => (
                      <Badge key={skill} variant="secondary" className="gap-1">
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeWantedSkill(skill)}
                          className="rounded-full hover:bg-secondary/80 ml-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mt-2">
                    No skills added yet
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProfileEditor;
