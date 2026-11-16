export const monthYear = (iso: string) =>
	new Date(iso).toLocaleDateString('en', { month: 'short', year: 'numeric', timeZone: 'UTC' });

export const dayMonthYear = (iso: string) =>
	new Date(iso).toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

export const pad2 = (n: number) => String(n).padStart(2, '0');
