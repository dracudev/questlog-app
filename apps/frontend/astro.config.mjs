import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  // Enable server-side rendering (all pages SSR by default, opt-out with prerender: true)
  output: 'server',

  // Node.js adapter for SSR
  adapter: node({
    mode: 'standalone',
  }),

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react()],
});
