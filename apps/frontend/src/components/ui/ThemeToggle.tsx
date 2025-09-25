import { Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';

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

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
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

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <button
        className="w-9 h-9 rounded-md border"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--bg-tertiary)',
        }}
      >
        <span className="sr-only">Toggle theme</span>
      </button>
    );
  }

  const isDarkTheme = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="w-9 h-9 rounded-md border transition-colors flex items-center justify-center"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--bg-tertiary)',
      }}
      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)')}
      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-secondary)')}
      aria-label={`Switch to ${isDarkTheme ? 'light' : 'dark'} mode`}
    >
      {isDarkTheme ? (
        <Sun
          size={16}
          color="#cbd5e0"
          strokeWidth={2}
          style={{ display: 'inline-block', flexShrink: 0 }}
        />
      ) : (
        <Moon
          size={16}
          color="#4b5563"
          strokeWidth={2}
          style={{ display: 'inline-block', flexShrink: 0 }}
        />
      )}
    </button>
  );
}
