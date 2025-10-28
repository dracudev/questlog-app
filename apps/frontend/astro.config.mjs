import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  output: 'static',

  adapter: vercel(),

  vite: {
    plugins: [tailwindcss()],
    // Dev proxy: forward /api to the backend so cookies are same-origin in development
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  },

  integrations: [react()],
});
