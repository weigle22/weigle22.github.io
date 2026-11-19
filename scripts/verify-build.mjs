// Fails the deployment if the static output is missing anything the site needs.
import { existsSync, readFileSync, statSync } from 'node:fs';

const projects = [...readFileSync('src/lib/data/projects.ts', 'utf8').matchAll(/^\t\tid: '([^']+)'/gm)].map((m) => m[1]);
const required = ['build/index.html', 'build/404.html', 'build/angular/widgets.js', 'build/.nojekyll', 'build/sitemap.xml', 'build/robots.txt', 'build/og.png', ...projects.map((id) => `build/projects/${id}/index.html`)];

const missing = required.filter((f) => !existsSync(f) || (!f.endsWith('.nojekyll') && statSync(f).size === 0));
const home = existsSync('build/index.html') ? readFileSync('build/index.html', 'utf8') : '';
for (const id of ['work', 'about', 'experience', 'education', 'stack', 'playground', 'github', 'contact'])
	if (!home.includes(`id="${id}"`)) missing.push(`home page section id="${id}"`);
const sitemap = existsSync('build/sitemap.xml') ? readFileSync('build/sitemap.xml', 'utf8') : '';
for (const id of projects) if (!sitemap.includes(`/projects/${id}/`)) missing.push(`sitemap entry for ${id}`);
if (/gh[pousr]_[A-Za-z0-9]{20,}|github_pat_/.test(home)) missing.push('SECURITY: a token-like string is present in the HTML');

if (missing.length) {
	console.error('Build verification failed:\n' + missing.map((m) => '  - ' + m).join('\n'));
	process.exit(1);
}
console.log(`Build verified: ${required.length} files present (${projects.length} case studies).`);
