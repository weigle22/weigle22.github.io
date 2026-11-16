// Shared shapes. Kept free of path aliases so scripts/fetch-github-stats.ts can import them with plain Node.

export interface Project {
	id: string;
	title: string;
	/** One sentence a visitor can understand without context. */
	description: string;
	category: string;
	/** "owner/name" on GitHub. Leave undefined for private work: no stars or links are shown. */
	repository?: string;
	liveUrl?: string;
	/** Optional path under /static (e.g. "/images/falcon.webp"). When empty, a code-drawn plate is used. */
	image?: string;
	featured: boolean;
	year: string;
	technologies: string[];
	/** What a user sees. */
	surface: string;
	/** What was actually built. */
	highlights: string[];
}

export interface GitHubMetadata {
	stars: number;
	language: string | null;
	updatedAt: string;
	description: string | null;
	url: string;
	latestCommit?: { message: string; date: string; sha: string };
}

export interface GitHubCommit {
	repo: string;
	message: string;
	date: string;
	sha: string;
	url: string;
}

export interface GitHubData {
	/** When the data was fetched. */
	fetchedAt: string;
	/** null means "GitHub didn't tell us", which is different from zero. */
	user: { login: string; followers: number | null; publicRepos: number | null };
	totalStars: number | null;
	repos: (GitHubMetadata & { name: string; fullName: string })[];
	/** Bytes of code per language across the user's own public repositories. */
	languages: { name: string; bytes: number }[];
	commits: GitHubCommit[];
	/** Public commits per day (YYYY-MM-DD → count) over the last 52 weeks, or null if unavailable. */
	activity: Record<string, number> | null;
	/** Metadata for every repository named in projects.ts, keyed by "owner/name". */
	projects: Record<string, GitHubMetadata>;
}

export type TechCategory =
	| 'Backend Development'
	| 'Frontend Development'
	| 'Database Management'
	| 'Programming Languages'
	| 'DevOps and Tools'
	| 'Software Architecture';

export interface Technology {
	name: string;
	category: TechCategory;
	description: string;
}
