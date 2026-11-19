import { error } from '@sveltejs/kit';
import { portfolio } from '#lib/services/github.ts';

// One static page per project, generated at build time.
export const entries = () => portfolio.map((p) => ({ id: p.id }));

export function load({ params }) {
	const i = portfolio.findIndex((p) => p.id === params.id);
	if (i < 0) error(404, 'Project not found');
	const project = portfolio[i];

	// Related: shared technologies count most, then same category, then same context.
	const related = portfolio
		.filter((p) => p.id !== project.id)
		.map((p) => {
			const shared = p.technologies.filter((t) => project.technologies.includes(t));
			const score = shared.length * 2 + (p.category === project.category ? 1.5 : 0) + (p.context === project.context ? 0.5 : 0);
			const why = shared.length ? `Shares ${shared.slice(0, 3).join(', ')}` : p.category === project.category ? `Also ${p.category.toLowerCase()}` : `Also ${p.context.toLowerCase()} work`;
			return { id: p.id, title: p.title, why, score };
		})
		.filter((r) => r.score > 0)
		.sort((a, b) => b.score - a.score)
		.slice(0, 3);

	return {
		project,
		index: i,
		related,
		next: portfolio[(i + 1) % portfolio.length],
		prev: portfolio[(i - 1 + portfolio.length) % portfolio.length]
	};
}
