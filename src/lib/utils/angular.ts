// Loads the Angular widgets bundle once, on demand. Svelte owns the page; Angular only
// defines custom elements (<tech-constellation>, <leave-demo>) that Svelte places like native tags.
import { asset } from '$app/paths';

let pending: Promise<void> | null = null;

export function loadAngularWidgets(tag: string): Promise<void> {
	pending ??= new Promise<void>((resolve, reject) => {
		const s = document.createElement('script');
		s.type = 'module';
		// Built by `npm run build:angular`, so it isn't in the typed asset list at type-check time.
		s.src = asset('angular/widgets.js' as Parameters<typeof asset>[0]);
		s.onload = () => resolve();
		s.onerror = () => {
			pending = null;
			reject(new Error('Angular widgets failed to load'));
		};
		document.head.append(s);
	});
	return pending.then(() => customElements.whenDefined(tag)).then(() => undefined);
}
