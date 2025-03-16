
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Video, Award, BarChart4 } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="container px-4 mx-auto">
          <div className="flex flex-wrap items-center -mx-4">
            <div className="w-full lg:w-1/2 px-4 mb-16 lg:mb-0">
              <h1 className="max-w-xl mb-6 text-4xl md:text-5xl font-bold leading-tight tracking-tighter">
                Exchange Skills, <br /> 
                <span className="text-primary">Grow Together</span>
              </h1>
              <p className="max-w-xl mb-8 text-lg text-muted-foreground">
                Join our community where people exchange skills and knowledge without money. 
                Learn from others, teach what you know, and build connections along the way.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" asChild>
                  <Link to="/register">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
              </div>
            </div>
            <div className="w-full lg:w-1/2 px-4">
              <div className="relative mx-auto md:mr-0 max-w-max">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1742&q=80"
                  alt="People collaborating"
                  className="rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container px-4 mx-auto">
          <div className="max-w-xl mx-auto text-center mb-16">
            <h2 className="mb-4 text-3xl font-bold">How It Works</h2>
            <p className="text-muted-foreground">
              Our platform makes it easy to exchange skills and knowledge with others in your community
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-6 bg-muted/30 rounded-lg shadow-sm">
              <div className="w-12 h-12 mb-4 flex items-center justify-center bg-primary/10 text-primary rounded-lg">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">Create Your Profile</h3>
              <p className="text-muted-foreground">
                Sign up and add skills you can teach and skills you want to learn
              </p>
            </div>
            <div className="p-6 bg-muted/30 rounded-lg shadow-sm">
              <div className="w-12 h-12 mb-4 flex items-center justify-center bg-primary/10 text-primary rounded-lg">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">Find Matches</h3>
              <p className="text-muted-foreground">
                Our system connects you with people who have complementary skills
              </p>
            </div>
            <div className="p-6 bg-muted/30 rounded-lg shadow-sm">
              <div className="w-12 h-12 mb-4 flex items-center justify-center bg-primary/10 text-primary rounded-lg">
                <Video className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">Schedule Sessions</h3>
              <p className="text-muted-foreground">
                Arrange to meet in person or virtually to exchange skills
              </p>
            </div>
            <div className="p-6 bg-muted/30 rounded-lg shadow-sm">
              <div className="w-12 h-12 mb-4 flex items-center justify-center bg-primary/10 text-primary rounded-lg">
                <BarChart4 className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">Earn Points</h3>
              <p className="text-muted-foreground">
                Get rewarded for sharing your knowledge with the community
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container px-4 mx-auto text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to Start Swapping Skills?</h2>
          <p className="max-w-lg mx-auto mb-8">
            Join thousands of people who are already sharing skills and learning new things without spending money
          </p>
          <Button size="lg" variant="secondary" className="font-semibold" asChild>
            <Link to="/register">
              Create Your Free Account <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
