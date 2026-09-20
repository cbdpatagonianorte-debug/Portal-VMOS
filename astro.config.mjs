import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  output: 'static',
  site: 'https://vmos-news-portal.vercel.app',
  i18n: {
    defaultLocale: 'es',
    locales: ['es']
  },
  build: {
    format: 'directory'
  }
});
