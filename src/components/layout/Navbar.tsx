
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

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
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
                <NavigationMenuTrigger>Explore</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href="#"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium">
                            Find Skills
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Discover people offering the skills you want to learn
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <Link to="#" onClick={closeMenu} className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Programming</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Coding, web development, and more
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link to="#" onClick={closeMenu} className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Creative Arts</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Photography, design, music, and more
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link to="#" onClick={closeMenu} className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Lifestyle</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Cooking, fitness, gardening, and more
                        </p>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {user && (
                <NavigationMenuItem>
                  <Link to="/dashboard">
                    <NavigationMenuLink className={cn(
                      "inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    )}>
                      Dashboard
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="ml-4 flex items-center space-x-2">
            {user ? (
              <>
                <Button variant="ghost" onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>{user.firstName}</span>
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
            <Link to="#" onClick={closeMenu} className="px-4 py-2 hover:bg-accent rounded-md">
              Explore Skills
            </Link>
            
            {user && (
              <Link to="/dashboard" onClick={closeMenu} className="px-4 py-2 hover:bg-accent rounded-md">
                Dashboard
              </Link>
            )}
            
            <div className="pt-4 border-t">
              {user ? (
                <>
                  <div className="flex items-center px-4 py-2">
                    <User className="mr-2 h-4 w-4" />
                    <span>{user.firstName} {user.lastName}</span>
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
