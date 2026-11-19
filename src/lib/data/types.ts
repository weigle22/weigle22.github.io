// Shared shapes. Kept free of path aliases so scripts/fetch-github-stats.ts can import them with plain Node.

/** Where the work happened. Shown on every card so visitors never confuse a side project with a job. */
export type ProjectContext = 'Professional' | 'Personal' | 'Volunteer' | 'Technical assessment' | 'Independent';

/** A box in an architecture diagram. `row` 0 is the top; boxes in a row are spread evenly. */
export interface DiagramNode {
	id: string;
	label: string;
	detail: string;
	row: number;
	kind?: 'client' | 'service' | 'native' | 'data' | 'external';
}
export interface DiagramEdge {
	from: string;
	to: string;
	label?: string;
}

/**
 * The long-form story on /projects/<id>/. Every field is optional: a section only appears
 * when it has content, so nothing is padded or invented. Fill these in as you go.
 */
export interface CaseStudy {
	overview?: string;
	problem?: string;
	/** What *you* did, as opposed to the team. */
	role?: string;
	architecture?: { caption: string; nodes: DiagramNode[]; edges: DiagramEdge[] };
	decisions?: { title: string; text: string }[];
	challenges?: { challenge: string; solution: string }[];
	testing?: string[];
	/** Before → after, for modernisation work. */
	beforeAfter?: { aspect: string; before: string; after: string }[];
	results?: string[];
	lessons?: string[];
}

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
	context: ProjectContext;
	caseStudy?: CaseStudy;
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

/**
 * How a technology has been used, so the site never overstates expertise:
 * Production = built new things with it at work; Maintenance = kept existing systems running with it at work;
 * Independent = personal, volunteer or assessment projects outside the job.
 */
export type TechUse = 'Production' | 'Maintenance' | 'Independent';

export interface Technology {
	name: string;
	category: TechCategory;
	description: string;
	use: TechUse[];
}
