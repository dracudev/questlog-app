import React, { useState, useEffect } from 'react';
import { Menu, X, User, LogOut, Settings } from 'lucide-react';
import { useStore } from '@nanostores/react';
import {
  $currentUser,
  $isAuthenticated,
  initializeAuthState,
  getUserAvatarUrl,
} from '@/stores/auth';
import { logout } from '@/services/auth';
import ThemeToggle from './ThemeToggle';
import * as Dialog from '@radix-ui/react-dialog';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Avatar from '@radix-ui/react-avatar';

interface NavbarProps {
  currentPath?: string;
}

interface NavigationItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

const navigationItems: NavigationItem[] = [
  { label: 'Home', href: '/feed' },
  { label: 'Explore', href: '/games' },
  { label: 'Reviews', href: '/reviews' },
];

/**
 * Main navigation bar component with mobile-first responsive design
 *
 * Features:
 * - Mobile: Hamburger menu with Radix Dialog drawer
 * - Desktop: Horizontal navigation with Radix NavigationMenu
 * - Auth: User dropdown with Radix DropdownMenu and Avatar
 * - Fully accessible with keyboard navigation
 *
 * @example
 * ```tsx
 * <Navbar currentPath="/explore" />
 * ```
 */
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

  const isActiveRoute = (href: string) => {
    if (href === '/' && currentPath === '/') return true;
    if (href !== '/' && currentPath?.startsWith(href)) return true;
    return false;
  };

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-[var(--bg-primary)] backdrop-blur supports-[backdrop-filter]:bg-[var(--bg-primary)]/95 border-[var(--bg-tertiary)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a
              href="/"
              className="flex items-center space-x-2 text-[var(--text-primary)] hover:text-[var(--brand-accent)] transition-colors"
            >
              <div className="w-8 h-8 bg-[var(--brand-primary)] rounded-md flex items-center justify-center">
                <span className="text-[var(--text-inverse)] font-bold text-sm">Q</span>
              </div>
              <span className="font-bold text-[var(--text-primary)] text-xl hidden sm:block">
                Questlog
              </span>
            </a>
          </div>

          {/* Desktop Navigation - Radix NavigationMenu */}
          <div className="hidden lg:block">
            <NavigationMenu.Root className="relative">
              <NavigationMenu.List className="flex items-center space-x-1">
                {navigationItems.map((item) => {
                  const isActive = isActiveRoute(item.href);
                  return (
                    <NavigationMenu.Item key={item.href}>
                      <NavigationMenu.Link
                        href={item.href}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-[var(--bg-secondary)] text-[var(--brand-primary)]'
                            : 'text-[var(--brand-primary)] hover:text-[var(--brand-primary)] hover:bg-[var(--bg-secondary)]'
                        }`}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        {item.label}
                      </NavigationMenu.Link>
                    </NavigationMenu.Item>
                  );
                })}
              </NavigationMenu.List>
            </NavigationMenu.Root>
          </div>

          {/* Desktop Right Side */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Authentication */}
            {authInitialized ? (
              isAuthenticated && user ? (
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button
                      type="button"
                      className="flex items-center justify-center rounded-full hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2"
                    >
                      <Avatar.Root className="w-8 h-8 rounded-full overflow-hidden">
                        <Avatar.Image
                          src={getUserAvatarUrl(40)}
                          alt={user.username}
                          className="w-full h-full object-cover"
                        />
                      </Avatar.Root>
                    </button>
                  </DropdownMenu.Trigger>

                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      className="min-w-[200px] bg-[var(--bg-secondary)] border border-[var(--bg-tertiary)] rounded-md shadow-lg p-1 z-[100] text-[var(--text-primary)]"
                      sideOffset={8}
                      align="end"
                    >
                      <DropdownMenu.Item
                        className="px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-md outline-none cursor-pointer transition-colors flex items-center space-x-2"
                        asChild
                      >
                        <a href={`/profile/${user.username}`}>
                          <User size={16} />
                          <span>Profile</span>
                        </a>
                      </DropdownMenu.Item>

                      <DropdownMenu.Item
                        className="px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-md outline-none cursor-pointer transition-colors flex items-center space-x-2"
                        asChild
                      >
                        <a href="/settings">
                          <Settings size={16} />
                          <span>Settings</span>
                        </a>
                      </DropdownMenu.Item>

                      <DropdownMenu.Separator className="h-px bg-[var(--bg-tertiary)] my-1" />

                      <DropdownMenu.Item
                        className="px-3 py-2 text-sm text-[var(--state-error)] hover:bg-[var(--state-error)]/10 rounded-md outline-none cursor-pointer transition-colors flex items-center space-x-2"
                        onSelect={handleLogout}
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              ) : (
                <div className="flex items-center space-x-2">
                  <a
                    href="/auth/login"
                    className="px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    Login
                  </a>
                  <a
                    href="/auth/register"
                    className="px-4 py-2 text-sm font-medium bg-[var(--brand-primary)] text-[var(--text-inverse)] rounded-md hover:opacity-90 transition-opacity"
                  >
                    Register
                  </a>
                </div>
              )
            ) : (
              <div className="w-24 h-10"></div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Dialog.Root open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <Dialog.Trigger asChild>
                <button
                  type="button"
                  className="p-1 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]"
                  aria-label="Toggle navigation menu"
                >
                  {isMobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
                </button>
              </Dialog.Trigger>

              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-[var(--bg-primary)]/80 backdrop-blur-sm z-[60]" />
                <Dialog.Content
                  className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-[var(--bg-secondary)] border-l border-[var(--bg-tertiary)] shadow-lg z-[60] focus:outline-none"
                  aria-describedby={undefined}
                >
                  {/* Mobile Menu Header */}
                  <div className="flex items-center justify-between p-4 border-b border-[var(--bg-tertiary)]">
                    <Dialog.Title className="text-lg font-semibold text-[var(--text-primary)]">
                      Menu
                    </Dialog.Title>
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        className="p-1 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                        aria-label="Close menu"
                      >
                        <X size={16} />
                      </button>
                    </Dialog.Close>
                  </div>

                  {/* Mobile Menu Content */}
                  <div className="flex flex-col max-h-screen overflow-y-auto">
                    {/* Navigation Links */}
                    <nav className="p-4 space-y-1">
                      {navigationItems.map((item) => {
                        const isActive = isActiveRoute(item.href);
                        return (
                          <a
                            key={item.href}
                            href={item.href}
                            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                              isActive
                                ? 'bg-[var(--bg-tertiary)] text-[var(--brand-primary)]'
                                : 'text-[var(--brand-primary)] hover:text-[var(--brand-primary)] hover:bg-[var(--bg-tertiary)]'
                            }`}
                            aria-current={isActive ? 'page' : undefined}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {item.label}
                          </a>
                        );
                      })}
                    </nav>

                    {/* Mobile Authentication Section */}
                    <div className="border-t border-[var(--bg-tertiary)] p-4">
                      {authInitialized ? (
                        isAuthenticated && user ? (
                          <div className="space-y-3">
                            {/* User Info */}
                            <div className="flex items-center space-x-3 px-3 py-2">
                              <Avatar.Root className="w-10 h-10 rounded-full overflow-hidden">
                                <Avatar.Image
                                  src={getUserAvatarUrl(64)}
                                  alt={user.username}
                                  className="w-full h-full object-cover"
                                />
                              </Avatar.Root>
                              <div>
                                <div className="text-base font-medium text-[var(--text-primary)]">
                                  {user.username}
                                </div>
                                <a href={`/profile/${user.username}`}>
                                  <div className="text-sm text-[var(--text-muted)]">
                                    View profile
                                  </div>
                                </a>
                              </div>
                            </div>

                            {/* User Menu Links */}

                            <a
                              href="/settings"
                              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-md transition-colors"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <Settings size={16} />
                              <span>Settings</span>
                            </a>

                            <button
                              type="button"
                              className="w-full flex items-center space-x-2 px-3 py-2 text-sm font-medium text-[var(--state-error)] hover:bg-[var(--state-error)]/10 rounded-md transition-colors"
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                handleLogout();
                              }}
                            >
                              <LogOut size={16} />
                              <span>Logout</span>
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <a
                              href="/auth/login"
                              className="block w-full text-center px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--bg-tertiary)] rounded-md hover:bg-[var(--bg-tertiary)] transition-colors"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              Login
                            </a>
                            <a
                              href="/auth/register"
                              className="block w-full text-center px-4 py-2 text-sm font-medium bg-[var(--brand-primary)] text-[var(--text-inverse)] rounded-md hover:opacity-90 transition-opacity"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              Register
                            </a>
                          </div>
                        )
                      ) : (
                        <div className="h-20"></div>
                      )}
                    </div>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </div>
      </div>
    </nav>
  );
}
