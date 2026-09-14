import type { APIContext } from 'astro';
import { allRoutes } from '../lib/routes';

export const GET = ({ site }: APIContext) => {
  const urls = allRoutes
    .map((r) => `<url><loc>${new URL(r, site).href}</loc></url>`)
    .join('');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
    { headers: { 'Content-Type': 'application/xml' } },
  );
};
