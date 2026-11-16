// Fetches public GitHub data at build time and writes src/lib/data/github.json.
//
//   node scripts/fetch-github-stats.ts
//
// Runs in GitHub Actions before every build (see .github/workflows). It never fails the build:
// if GitHub can't be reached, the previously committed github.json is left in place as the cache.
// The token (GITHUB_TOKEN) is read from the environment and is never written to the output.

import { readFileSync, writeFileSync } from 'node:fs';
import { site } from '../src/lib/data/site.ts';
import { projects } from '../src/lib/data/projects.ts';
import type { GitHubCommit, GitHubData, GitHubMetadata } from '../src/lib/data/types.ts';

const OUT = new URL('../src/lib/data/github.json', import.meta.url);
const API = process.env.GITHUB_API_URL || 'https://api.github.com';
const USER = site.githubUsername;
const TOKEN = process.env.GITHUB_TOKEN;
const WEEKS = 52;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** GET with retries, rate-limit back-off and a token that is dropped if GitHub rejects it. */
async function get(path: string, { optional = false } = {}): Promise<{ data: any; next: string | null }> {
	const url = path.startsWith('http') ? path : API + path;
	let useToken = Boolean(TOKEN);
	let lastError = '';

	for (let attempt = 1; attempt <= 4; attempt++) {
		try {
			const headers: Record<string, string> = {
				Accept: 'application/vnd.github+json',
				'X-GitHub-Api-Version': '2022-11-28',
				'User-Agent': `${USER}-portfolio`
			};
			if (useToken) headers.Authorization = `Bearer ${TOKEN}`;

			const res = await fetch(url, { headers, signal: AbortSignal.timeout(20_000) });

			if (res.ok) {
				const link = res.headers.get('link') ?? '';
				const next = link.match(/<([^>]+)>;\s*rel="next"/)?.[1] ?? null;
				return { data: await res.json(), next };
			}
			// Empty repository (409) or nothing there (404): not an error for optional data.
			if (optional && [404, 409, 451].includes(res.status)) return { data: null, next: null };
			if (res.status === 401 && useToken) {
				useToken = false; // public data: carry on without the token
				continue;
			}
			if (res.status === 403 || res.status === 429) {
				const wait = Number(res.headers.get('retry-after')) || 0;
				const remaining = res.headers.get('x-ratelimit-remaining');
				if (remaining === '0' && !wait) throw new Error(`rate limit exhausted on ${path}`);
				await sleep(Math.min(Math.max(wait, attempt * 2), 30) * 1000);
				lastError = `${res.status} on ${path}`;
				continue;
			}
			if (res.status >= 500) {
				lastError = `${res.status} on ${path}`;
				await sleep(attempt * 1500);
				continue;
			}
			throw new Error(`${res.status} ${res.statusText} on ${path}`);
		} catch (err) {
			lastError = (err as Error).message;
			if (/rate limit|^4\d\d /.test(lastError)) break;
			await sleep(attempt * 1500);
		}
	}
	if (optional) {
		console.warn(`  skipped ${path}: ${lastError}`);
		return { data: null, next: null };
	}
	throw new Error(lastError || `failed: ${path}`);
}

/** Follows Link: rel="next" up to maxPages. */
async function getAll(path: string, maxPages = 10, optional = false): Promise<any[]> {
	const items: any[] = [];
	let next: string | null = path;
	for (let page = 0; next && page < maxPages; page++) {
		const res = await get(next, { optional });
		if (!Array.isArray(res.data)) break;
		items.push(...res.data);
		next = res.next;
	}
	return items;
}

const toMeta = (r: any): GitHubMetadata => ({
	stars: r.stargazers_count ?? 0,
	language: r.language ?? null,
	updatedAt: r.pushed_at ?? r.updated_at,
	description: r.description ?? null,
	url: r.html_url
});

const toCommit = (repo: string, c: any): GitHubCommit => ({
	repo,
	message: String(c.commit?.message ?? '').split('\n')[0].slice(0, 120),
	date: c.commit?.author?.date ?? c.commit?.committer?.date,
	sha: String(c.sha).slice(0, 7),
	url: c.html_url
});

async function main(): Promise<GitHubData> {
	console.log(`Fetching GitHub data for ${USER}${TOKEN ? ' (authenticated)' : ' (no token)'}`);

	const profile = (await get(`/users/${USER}`)).data;
	const all = await getAll(`/users/${USER}/repos?per_page=100&type=owner&sort=pushed`);
	const own = all.filter((r) => !r.fork && !r.private && !r.archived);
	console.log(`  ${own.length} public repositories`);

	const since = new Date(Date.now() - WEEKS * 7 * 86_400_000).toISOString();
	const languages = new Map<string, number>();
	const activity: Record<string, number> = {};
	const commits: GitHubCommit[] = [];
	let activityOk = true;

	for (const r of own) {
		const langs = (await get(`/repos/${r.full_name}/languages`, { optional: true })).data;
		for (const [name, bytes] of Object.entries(langs ?? {})) languages.set(name, (languages.get(name) ?? 0) + Number(bytes));

		const list = await getAll(`/repos/${r.full_name}/commits?per_page=100&since=${since}`, 5, true).catch(() => {
			activityOk = false;
			return [];
		});
		for (const c of list) {
			const item = toCommit(r.name, c);
			if (!item.date) continue;
			activity[item.date.slice(0, 10)] = (activity[item.date.slice(0, 10)] ?? 0) + 1;
			commits.push(item);
		}
	}
	commits.sort((a, b) => b.date.localeCompare(a.date));

	// Metadata for every repository named in projects.ts, including ones outside the user's account.
	const projectMeta: Record<string, GitHubMetadata> = {};
	for (const full of new Set(projects.map((p) => p.repository).filter(Boolean) as string[])) {
		const known = own.find((r) => r.full_name.toLowerCase() === full.toLowerCase());
		const repo = known ?? (await get(`/repos/${full}`, { optional: true })).data;
		if (!repo) continue;
		const latest = (await get(`/repos/${full}/commits?per_page=1`, { optional: true })).data;
		projectMeta[full] = { ...toMeta(repo), latestCommit: latest?.[0] ? (({ repo: _r, url: _u, ...c }) => c)(toCommit(repo.name, latest[0])) : undefined };
	}

	return {
		fetchedAt: new Date().toISOString(),
		user: { login: USER, followers: profile.followers ?? null, publicRepos: own.length },
		totalStars: own.reduce((n, r) => n + (r.stargazers_count ?? 0), 0),
		repos: own.map((r) => ({ name: r.name, fullName: r.full_name, ...toMeta(r) })),
		languages: [...languages].map(([name, bytes]) => ({ name, bytes })).sort((a, b) => b.bytes - a.bytes),
		commits: commits.slice(0, 8),
		activity: activityOk ? activity : null,
		projects: projectMeta
	};
}

try {
	const data = await main();
	writeFileSync(OUT, JSON.stringify(data, null, '\t') + '\n');
	console.log(`Wrote github.json: ${data.repos.length} repos, ${data.totalStars} stars, ${data.commits.length} recent commits`);
} catch (err) {
	let cached = 'none';
	try {
		cached = JSON.parse(readFileSync(OUT, 'utf8')).fetchedAt;
	} catch {
		/* no cache yet */
	}
	console.warn(`GitHub fetch failed (${(err as Error).message}). Keeping cached data from ${cached}.`);
	if (process.env.GITHUB_ACTIONS) console.log('::warning::GitHub stats could not be refreshed; the site was built from cached data.');
}
