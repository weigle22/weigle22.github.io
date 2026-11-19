import { site } from '#lib/data/site.ts';
import { portfolio } from '#lib/services/github.ts';

// Prerendered to build/sitemap.xml: the home page plus one entry per case study.
export const prerender = true;
export const trailingSlash = 'never';

export function GET() {
	const today = new Date().toISOString().slice(0, 10);
	const urls = [{ loc: `${site.url}/`, priority: '1.0' }, ...portfolio.map((p) => ({ loc: `${site.url}/projects/${p.id}/`, priority: '0.8' }))];
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u.loc}</loc><lastmod>${today}</lastmod><priority>${u.priority}</priority></url>`).join('\n')}
</urlset>
`;
	return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
