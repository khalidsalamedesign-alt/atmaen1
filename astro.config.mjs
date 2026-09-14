import { defineConfig } from 'astro/config';

export default defineConfig({
  // غيّرها للدومين النهائي قبل الإطلاق
  site: 'https://example.com',
  trailingSlash: 'never',
  build: {
    format: 'file',
    // CSS داخل الصفحة: طلب أقل، وكل صفحة تشتغل أوفلاين لوحدها
    inlineStylesheets: 'always',
  },
});
