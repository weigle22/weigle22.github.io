<script lang="ts">
	import FileText from '@lucide/svelte/icons/file-text';
	import { site } from '#lib/data/site.ts';
	import { monthYear } from '#lib/utils/format.ts';

	// Renders nothing until a résumé file is configured in site.ts.
	let {
		variant = 'pill',
		label = 'View résumé',
		showDate = true
	}: { variant?: 'pill' | 'link'; label?: string; showDate?: boolean } = $props();
	const r = site.resume;
	const updated = r.updated ? monthYear(r.updated.length === 7 ? `${r.updated}-01` : r.updated) : '';
</script>

{#if r.file}
	<!-- Opens the PDF in a new tab (the browser's viewer also offers download and print). -->
	<a class={variant === 'pill' ? 'pill' : 'u link'} href={r.file} target="_blank" rel="noopener" type="application/pdf" aria-label="{label} (PDF, opens in a new tab)">
		<FileText size={16} />
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
