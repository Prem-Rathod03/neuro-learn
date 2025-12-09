import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Home, TrendingUp, Award, Settings, LogOut, User, Menu, Shield } from 'lucide-react';
import { NeurodiversityBadge } from './NeurodiversityBadge';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { useState } from 'react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: Home },
    { to: '/progress', label: 'Progress', icon: TrendingUp },
    { to: '/rewards', label: 'Rewards', icon: Award },
    { to: '/settings', label: 'Settings', icon: Settings },
    { to: '/admin', label: 'Admin', icon: Shield },
  ];

  const NavLinks = ({ mobile = false, onClickLink }: { mobile?: boolean; onClickLink?: () => void }) => (
    <>
      {navLinks.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          onClick={onClickLink}
          className={mobile ? 'flex items-center gap-3 py-3 px-4 hover:bg-muted rounded-lg transition-colors' : ''}
        >
          {mobile ? (
            <>
              <link.icon className="w-5 h-5" />
              <span className="text-lg">{link.label}</span>
            </>
          ) : (
            <Button variant="ghost" className="gap-2">
              <link.icon className="w-4 h-4" />
              {link.label}
            </Button>
          )}
        </Link>
      ))}
    </>
  );

  if (!user) return null;

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="text-3xl">🧠</div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              NeuroPath
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <NavLinks />
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="py-6 space-y-4">
                  <div className="px-4 pb-4 border-b border-border">
                    <p className="font-semibold text-lg mb-2">{user.name}</p>
                    <div className="flex flex-wrap gap-1">
                      {(user.neuroFlags || user.neurodiversityTags || []).map((tag) => (
                        <NeurodiversityBadge key={tag} tag={tag as any} size="sm" />
                      ))}
                    </div>
                  </div>
                  <NavLinks mobile onClickLink={() => setMobileMenuOpen(false)} />
                  <div className="px-4 pt-4 border-t border-border">
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Desktop User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="hidden md:flex gap-2">
                  <User className="w-4 h-4" />
                  {user.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-popover">
                <div className="px-3 py-2">
                  <p className="font-semibold mb-2">{user.name}</p>
                  <div className="flex flex-wrap gap-1">
                    {(user.neuroFlags || user.neurodiversityTags || []).map((tag) => (
                      <NeurodiversityBadge key={tag} tag={tag as any} size="sm" />
                    ))}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};
