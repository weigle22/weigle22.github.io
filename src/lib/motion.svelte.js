// Shared motion preference: follows the OS setting until the visitor flips the switch.
import { browser } from '$app/environment';

export const motion = $state({ on: true });

export function initMotion() {
	if (!browser) return;
	let saved = null;
	try {
		saved = localStorage.getItem('motion');
	} catch {
		/* storage unavailable: fall back to the OS preference */
	}
	motion.on = saved ? saved === 'on' : !matchMedia('(prefers-reduced-motion: reduce)').matches;
	apply();
}

export function toggleMotion() {
	motion.on = !motion.on;
	apply();
	try {
		localStorage.setItem('motion', motion.on ? 'on' : 'off');
	} catch {
		/* ignore */
	}
}

function apply() {
	document.documentElement.dataset.motion = motion.on ? 'on' : 'off';
}

/** Svelte action: fade an element up the first time it scrolls into view. */
export function reveal(node) {
	node.classList.add('reveal');
	const io = new IntersectionObserver(
		(entries) => {
			for (const e of entries) {
				if (e.isIntersecting) {
					node.classList.add('in');
					io.disconnect();
				}
			}
		},
		{ threshold: 0.12 }
	);
	io.observe(node);
	return { destroy: () => io.disconnect() };
}
