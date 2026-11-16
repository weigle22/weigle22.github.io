// Merges hand-written project data with the GitHub metadata fetched at build time.
// The hand-written side always wins; GitHub only adds stars, language, dates and the latest commit.

import raw from '#lib/data/github.json';
import { projects } from '#lib/data/projects.ts';
import type { GitHubData, GitHubMetadata, Project } from '#lib/data/types.ts';

export const github = raw as unknown as GitHubData;

export type ProjectWithMeta = Project & { github: GitHubMetadata | null };

export const portfolio: ProjectWithMeta[] = projects.map((p) => ({
	...p,
	github: (p.repository && github.projects[p.repository]) || null
}));

export const featured = portfolio.filter((p) => p.featured);

export const byId = (id: string) => portfolio.find((p) => p.id === id);
