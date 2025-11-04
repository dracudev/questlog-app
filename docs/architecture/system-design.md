# Questlog Design System

**Last Updated:** November 4, 2025  
**Status:** Production Ready

A modern, gaming-focused design system built for performance, accessibility, and developer experience.

## Design Principles

- **Gaming-First**: Dark theme optimized for gaming audiences with vibrant accent colors
- **Performance**: Minimal CSS footprint with efficient custom properties
- **Accessibility**: WCAG 2.1 AA compliant with proper focus management and Radix UI primitives
- **Developer Experience**: Intuitive naming conventions and clear documentation
- **Scalability**: Systematic approach supporting future growth and theming
- **Mobile-First**: Responsive design patterns starting from mobile viewports

## Design Tokens

All design tokens use industry-standard naming conventions and are organized by category:

### Colors

```css
/* Brand */
--brand-primary: #7f5af0; /* Primary CTA, links, focus states */
--brand-secondary: #94a1b2; /* Secondary elements, muted text */
--brand-accent: #2cb67d; /* Success, notifications, highlights */

/* Text */
--text-primary: #fffffe; /* Headings, high-emphasis text */
--text-secondary: #cbd5e0; /* Body text, readable on dark */
--text-muted: #a3b1c2; /* Placeholders, meta info */
--text-inverse: #1f2937; /* Light background text (rare) */

/* Backgrounds */
--bg-primary: #16161a; /* Main app background */
--bg-secondary: #242629; /* Cards, panels, elevated content */
--bg-tertiary: #3b3e45; /* Borders, dividers, input borders */

/* States */
--state-error: #ef4444; /* Error messages, destructive actions */
--state-warning: #f59e0b; /* Warnings, caution */
--state-success: #2cb67d; /* Success messages, positive feedback */
--state-info: #7f5af0; /* Info messages, neutral feedback */
```

### Typography

Single font family with responsive scaling:

```css
--font-family-base: "Inter", system-ui, sans-serif;

/* Fixed Sizes */
--font-size-xs: 0.75rem; /* 12px - Fine print */
--font-size-sm: 0.875rem; /* 14px - Small text, captions */
--font-size-base: 1rem; /* 16px - Body text */
--font-size-lg: 1.125rem; /* 18px - Large body text */
--font-size-xl: 1.25rem; /* 20px - Small headings */

/* Responsive Headings */
--font-size-h1: clamp(2.25rem, 5vw + 1rem, 3.75rem);
--font-size-h2: clamp(1.875rem, 4vw + 1rem, 3rem);
--font-size-h3: clamp(1.5rem, 3vw + 1rem, 2.25rem);
```

### Spacing

8px-based spacing scale for consistent layouts:

```css
--space-1: 0.25rem; /* 4px */
--space-2: 0.5rem; /* 8px */
--space-3: 0.75rem; /* 12px */
--space-4: 1rem; /* 16px */
--space-6: 1.5rem; /* 24px */
--space-8: 2rem; /* 32px */
--space-12: 3rem; /* 48px */
--space-16: 4rem; /* 64px */
```

### Shadows & Effects

Subtle depth for dark theme interfaces:

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.15);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.25);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.35);

--radius-sm: 0.25rem; /* Small components */
--radius-md: 0.375rem; /* Buttons, inputs */
--radius-lg: 0.5rem; /* Cards, panels */

--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-normal: 300ms cubic-bezier(0.4, 0, 0.2, 1);
```

## Component Patterns

### Buttons

```css
/* Primary button - default styling applied automatically */
button {
  /* Uses --brand-primary background */
}

/* Variants available as utility classes */
.btn-secondary {
  /* Outlined secondary style */
}
.btn-outline {
  /* Subtle outlined style */
}
.btn-danger {
  /* Destructive actions */
}
```

### Form Controls

All form elements share consistent styling:

- Focus states with `--brand-primary` color and subtle shadows
- Error states with `--state-error` color
- Proper spacing and typography hierarchy
- Accessible placeholder text contrast

### Accessibility Features

- **Focus Management**: Visible focus indicators on all interactive elements
- **Color Contrast**: WCAG AA compliant text/background combinations
- **Screen Readers**: `.sr-only` utility for hidden accessible content
- **Keyboard Navigation**: All interactive elements properly focusable

## Usage Guidelines

### CSS Custom Properties

Always use design tokens instead of hardcoded values:

```css
/* ✅ Good */
color: var(--text-primary);
margin: var(--space-4);

/* ❌ Avoid */
color: #fffffe;
margin: 16px;
```

### Component Development

Build components that extend base styles:

```css
.game-card {
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-md);
}
```

### Responsive Design

Use fluid typography and consistent spacing:

```css
.hero-title {
  font-size: var(--font-size-h1); /* Already responsive */
  margin-bottom: var(--space-6);
}
```

## Integration with Tailwind

This design system complements Tailwind CSS v4. Custom properties are available for Tailwind configuration and can be used alongside utility classes for rapid development while maintaining design consistency.

## Component Primitives: Radix UI

We use **Radix UI** as the project's headless, accessible primitive component library. Radix provides unstyled components with robust accessibility and focus management. All visual styling is applied via Tailwind CSS and our design tokens, keeping the primitives decoupled from presentation.

Philosophy:

- Use Radix for behavior and accessibility (focus traps, keyboard navigation, ARIA attributes).
- Apply styles with Tailwind and design tokens so components remain visually consistent and themeable.
- Keep Radix primitives wrapped in thin, project-specific presentational components to centralize styling and behavior.

Example — styling a `Tabs.Trigger` with Tailwind and design tokens:

```tsx
import { Tabs } from '@radix-ui/react-tabs';

function StyledTabTrigger({ children, ...props }) {
  return (
    <Tabs.Trigger
      {...props}
      className="px-4 py-2 rounded-md text-sm bg-[var(--bg-secondary)] text-[var(--text-primary)] data-[state=active]:bg-[var(--brand-primary)] data-[state=active]:text-white"
    >
      {children}
    </Tabs.Trigger>
  );
}
```

This keeps the accessibility benefits of Radix while giving the team full control over visuals via the design system.

## Radix UI Integration

All interactive components use Radix UI primitives for maximum accessibility:

- **Navigation:** `@radix-ui/react-navigation-menu` for keyboard-accessible navigation
- **Dialogs:** `@radix-ui/react-dialog` for modals and side-drawers
- **Dropdowns:** `@radix-ui/react-dropdown-menu` for user menus
- **Avatars:** `@radix-ui/react-avatar` with fallback support
- **Tabs:** `@radix-ui/react-tabs` for tabbed interfaces
- **Switch:** `@radix-ui/react-switch` for theme toggle

All Radix components are styled with design system tokens for consistency.

## Implementation Status

### ✅ Completed Components

- **Navbar:** Mobile hamburger + desktop navigation with user dropdown
- **Footer:** Responsive 4-column layout with social links
- **ThemeToggle:** Radix Switch with icon and smooth transitions
- **ProfileHeader:** Avatar, bio, stats with responsive layout
- **ProfileTabs:** Radix Tabs for content navigation
- **Buttons:** Primary, secondary, outline, and danger variants
- **Forms:** Input fields with validation states

### 🔄 In Progress

- Game card components
- Review card components
- Search components
- Filter components

## Future Considerations

- Light mode theme implementation
- Component-specific token variations
- Animation and motion tokens library
- Extended color palettes for data visualization
- Component documentation site (Storybook)
