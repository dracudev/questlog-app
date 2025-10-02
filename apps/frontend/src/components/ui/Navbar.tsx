import React, { useState, useEffect } from 'react';
import { Menu, X, Search, User } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { $currentUser, $isAuthenticated, initializeAuthState } from '@/stores/auth';
import ThemeToggle from './ThemeToggle';

interface NavbarProps {
  currentPath?: string;
}

interface NavigationItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

const navigationItems: NavigationItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Explore', href: '/explore' },
  { label: 'Reviews', href: '/reviews' },
  { label: 'Profile', href: '/profile' },
];

export default function Navbar({ currentPath }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false);

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuthState();
    setAuthInitialized(true);
  }, []);

  // Get auth state directly from store
  const currentUser = useStore($currentUser);
  const isAuthenticated = useStore($isAuthenticated);

  // Transform user data for display
  const user = currentUser
    ? {
        username: currentUser.username,
        avatar: currentUser.avatar,
      }
    : undefined;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActiveRoute = (href: string) => {
    if (href === '/' && currentPath === '/') return true;
    if (href !== '/' && currentPath?.startsWith(href)) return true;
    return false;
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-primary/95 backdrop-blur supports-[backdrop-filter]:bg-primary/60 border-tertiary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a
              href="/"
              className="flex items-center space-x-2 text-primary hover:text-brand-primary transition-colors"
            >
              <div className="w-8 h-8 bg-brand-primary rounded-md flex items-center justify-center">
                <span className="text-primary font-bold text-sm">Q</span>
              </div>
              <span className="font-bold text-xl hidden sm:block">Questlog</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigationItems.map((item) => {
                const isActive = isActiveRoute(item.href);
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-brand-primary/10 text-brand-primary'
                        : 'text-secondary hover:text-primary hover:bg-tertiary'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search Button */}
            <button
              type="button"
              className="p-2 rounded-md text-secondary hover:text-primary hover:bg-tertiary transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Authentication */}
            {authInitialized ? (
              isAuthenticated && user ? (
                <div className="relative">
                  <button
                    type="button"
                    className="flex items-center space-x-2 p-2 rounded-md text-secondary hover:text-primary hover:bg-tertiary transition-colors"
                    aria-label="User menu"
                  >
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.username} className="w-6 h-6 rounded-full" />
                    ) : (
                      <User size={20} />
                    )}
                    <span className="text-sm font-medium">{user.username}</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <a
                    href="/auth/login"
                    className="px-3 py-2 text-sm font-medium text-secondary hover:text-primary transition-colors"
                  >
                    Sign In
                  </a>
                  <a
                    href="/auth/register"
                    className="px-4 py-2 text-sm font-medium bg-brand-primary text-primary rounded-md hover:bg-brand-primary/90 transition-colors"
                  >
                    Sign Up
                  </a>
                </div>
              )
            ) : (
              <div className="w-24 h-10"></div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={toggleMobileMenu}
              type="button"
              className="p-2 rounded-md text-secondary hover:text-primary hover:bg-tertiary transition-colors"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-200 ease-in-out ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 border-t bg-secondary border-tertiary">
          {/* Mobile Navigation Links */}
          {navigationItems.map((item) => {
            const isActive = isActiveRoute(item.href);
            return (
              <a
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-primary/10 text-brand-primary'
                    : 'text-secondary hover:text-primary hover:bg-tertiary'
                }`}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            );
          })}

          {/* Mobile Search */}
          <button
            type="button"
            className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-secondary hover:text-primary hover:bg-tertiary transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="flex items-center space-x-2">
              <Search size={20} />
              <span>Search</span>
            </div>
          </button>

          {/* Mobile Authentication */}
          <div className="border-t pt-4 mt-4 border-tertiary">
            {authInitialized ? (
              isAuthenticated && user ? (
                <div className="px-3 py-2">
                  <div className="flex items-center space-x-3 mb-3">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full" />
                    ) : (
                      <User size={24} className="text-secondary" />
                    )}
                    <div>
                      <div className="text-base font-medium text-primary">{user.username}</div>
                      <div className="text-sm text-muted">View profile</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="px-3 py-2 space-y-2">
                  <a
                    href="/auth/login"
                    className="block w-full text-center px-4 py-2 text-sm font-medium text-secondary hover:text-primary border border-tertiary rounded-md hover:bg-tertiary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </a>
                  <a
                    href="/auth/register"
                    className="block w-full text-center px-4 py-2 text-sm font-medium bg-brand-primary text-primary rounded-md hover:bg-brand-primary/90 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </a>
                </div>
              )
            ) : (
              <div className="px-3 py-2 h-20"></div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
