import { Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import * as Switch from '@radix-ui/react-switch';

/**
 * Theme toggle component using Radix UI Switch
 *
 * Fully accessible theme switcher with proper keyboard navigation and
 * screen reader support. Persists theme preference to localStorage.
 *
 * @example
 * ```tsx
 * <ThemeToggle />
 * ```
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('theme');
    if (stored) {
      setTheme(stored);
    } else {
      setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }
  }, []);

  const handleThemeChange = (checked: boolean) => {
    const newTheme = checked ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);

    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  };

  if (!mounted) {
    return <div className="w-11 h-6" />;
  }

  const isDarkTheme = theme === 'dark';

  return (
    <Switch.Root
      checked={isDarkTheme}
      onCheckedChange={handleThemeChange}
      className="w-11 h-6 bg-bg-tertiary rounded-full relative data-[state=checked]:bg-brand-primary cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent transition-colors"
      aria-label={`Switch to ${isDarkTheme ? 'light' : 'dark'} mode`}
    >
      <Switch.Thumb className="flex items-center justify-center w-5 h-5 bg-bg-primary rounded-full shadow-md transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[22px]">
        {isDarkTheme ? (
          <Moon size={12} className="text-brand-accent" strokeWidth={2.5} />
        ) : (
          <Sun size={12} className="text-brand-primary" strokeWidth={2.5} />
        )}
      </Switch.Thumb>
    </Switch.Root>
  );
}
