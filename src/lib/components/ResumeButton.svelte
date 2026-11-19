<script lang="ts">
	import Download from '@lucide/svelte/icons/download';
	import { site } from '#lib/data/site.ts';
	import { monthYear } from '#lib/utils/format.ts';

	// Renders nothing until a résumé file is configured in site.ts.
	let {
		variant = 'pill',
		label = 'Download résumé',
		showDate = true
	}: { variant?: 'pill' | 'link'; label?: string; showDate?: boolean } = $props();
	const r = site.resume;
	const updated = r.updated ? monthYear(r.updated.length === 7 ? `${r.updated}-01` : r.updated) : '';
</script>

{#if r.file}
	<a class={variant === 'pill' ? 'pill' : 'u link'} href={r.file} download="Emmanuel-Otacan-Resume.pdf" type="application/pdf">
		<Download size={16} />
		{label}
		{#if updated && showDate}<span class="when">PDF · updated {updated}</span>{:else}<span class="when">PDF</span>{/if}
	</a>
{/if}

<style>
	.when {
		font-size: 11px;
		font-weight: 500;
		opacity: 0.65;
		letter-spacing: 0.02em;
	}
	.link {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-weight: 500;
	}
</style>
