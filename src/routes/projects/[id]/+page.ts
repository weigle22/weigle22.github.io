import { error } from '@sveltejs/kit';
import { portfolio } from '#lib/services/github.ts';

// One static page per project, generated at build time.
export const entries = () => portfolio.map((p) => ({ id: p.id }));

export function load({ params }) {
	const i = portfolio.findIndex((p) => p.id === params.id);
	if (i < 0) error(404, 'Project not found');
	return {
		project: portfolio[i],
		index: i,
		next: portfolio[(i + 1) % portfolio.length],
		prev: portfolio[(i - 1 + portfolio.length) % portfolio.length]
	};
}
