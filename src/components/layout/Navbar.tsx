
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { LogOut, Menu, User, X } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const Navbar = () => {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getInitials = () => {
    if (profile?.firstName && profile?.lastName) {
      return `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">
          SkillSwap
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/">
                  <NavigationMenuLink className={cn(
                    "inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  )}>
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link to="/explore">
                  <NavigationMenuLink className={cn(
                    "inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  )}>
                    Explore
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              {user && (
                <>
                  <NavigationMenuItem>
                    <Link to="/dashboard">
                      <NavigationMenuLink className={cn(
                        "inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      )}>
                        Dashboard
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                </>
              )}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="ml-4 flex items-center space-x-2">
            {user ? (
              <>
                <Button variant="ghost" onClick={() => navigate('/profile')} className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                  <span>{profile?.firstName || user.email}</span>
                </Button>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/login')}>Login</Button>
                <Button onClick={() => navigate('/register')}>Sign Up</Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-600"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X size={24} />
          ) : (
            <Menu size={24} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden container mx-auto px-4 py-4 bg-background border-t">
          <div className="flex flex-col space-y-4">
            <Link to="/" onClick={closeMenu} className="px-4 py-2 hover:bg-accent rounded-md">
              Home
            </Link>
            <Link to="/explore" onClick={closeMenu} className="px-4 py-2 hover:bg-accent rounded-md">
              Explore
            </Link>
            
            {user && (
              <>
                <Link to="/dashboard" onClick={closeMenu} className="px-4 py-2 hover:bg-accent rounded-md">
                  Dashboard
                </Link>
                <Link to="/profile" onClick={closeMenu} className="px-4 py-2 hover:bg-accent rounded-md">
                  My Profile
                </Link>
              </>
            )}
            
            <div className="pt-4 border-t">
              {user ? (
                <>
                  <div className="flex items-center px-4 py-2">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarFallback>{getInitials()}</AvatarFallback>
                    </Avatar>
                    <span>{profile?.firstName} {profile?.lastName}</span>
                  </div>
                  <Button variant="outline" onClick={handleLogout} className="w-full mt-2">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Button variant="outline" onClick={() => { navigate('/login'); closeMenu(); }}>
                    Login
                  </Button>
                  <Button onClick={() => { navigate('/register'); closeMenu(); }}>
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
