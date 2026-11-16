import snapshot from '#lib/data/github-snapshot.json';

const USER = 'weigle22';

/**
 * Runs at build time (the site is prerendered). The deploy workflow rebuilds
 * on a schedule, so these numbers stay current without anyone touching them.
 * If GitHub can't be reached, the committed snapshot is used instead.
 */
export async function load({ fetch }) {
	try {
		const url = `https://api.github.com/users/${USER}/repos?per_page=100&sort=pushed`;
		const headers = { Accept: 'application/vnd.github+json', 'User-Agent': `${USER}-portfolio` };
		const token = process.env.GITHUB_TOKEN;

		// The token only raises the rate limit; this is public data, so retry without it if it's rejected.
		let res = await fetch(url, { headers: token ? { ...headers, Authorization: `Bearer ${token}` } : headers });
		if (res.status === 401 && token) res = await fetch(url, { headers });
		if (!res.ok) throw new Error(`GitHub responded ${res.status}`);

		const repos = (await res.json())
			.filter((r) => !r.fork && !r.private && !r.archived)
			.map((r) => ({
				name: r.name,
				url: r.html_url,
				description: r.description,
				language: r.language,
				stars: r.stargazers_count,
				pushedAt: r.pushed_at
			}));

		return { github: { live: true, fetchedAt: new Date().toISOString(), repos } };
	} catch (err) {
		console.warn(`[github] using snapshot: ${err.message}`);
		return { github: { ...snapshot, live: false } };
	}
}
