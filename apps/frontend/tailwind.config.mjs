import baseConfig from '../../packages/config/src/tailwind/tailwind.config.js';

export default {
  ...baseConfig,
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    '../../packages/ui-components/src/**/*.{js,ts,jsx,tsx}',
  ],
};
