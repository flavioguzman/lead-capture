import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import netlify from '@astrojs/netlify';

export default defineConfig({
  integrations: [tailwind()],
  output: 'server',
  adapter: netlify({
    edgeMiddleware: true,
    functionPerRoute: false // Changed to false to handle all routes in a single function
  })
});