<script lang="ts">
	import { layers } from '#lib/data/site.ts';

	// One leave request seen at four altitudes of the same system.
	let i = $state(0);
	const layer = $derived(layers[i]);
</script>

<div class="altitude">
	<div class="stage" aria-live="polite">
		<span class="depth mono">10{['⁰', '¹', '²', '³'][i]} · the {layer.label}</span>
		{#key layer.id}
			<div class="card">
				{#if layer.id === 'ui'}
					<div class="form">
						<span class="label">File a leave</span>
						<div class="field"><span>Type</span><b>Vacation leave</b></div>
						<div class="field"><span>Days</span><b>3</b></div>
						<div class="field"><span>Balance</span><b>15 days</b></div>
						<div class="fake-btn">Submit</div>
					</div>
				{:else if layer.id === 'data'}
					<div class="table mono">
						<div class="row head"><span>Id</span><span>Type</span><span>Days</span><span>Status</span></div>
						<div class="row dim"><span>4819</span><span>Sick</span><span>1</span><span>Posted</span></div>
						<div class="row dim"><span>4820</span><span>Vacation</span><span>5</span><span>Approved</span></div>
						<div class="row hot"><span>4821</span><span>Vacation</span><span>3</span><span>Draft</span></div>
					</div>
				{:else}
					<pre class="mono"><code>{layer.code}</code></pre>
				{/if}
			</div>
		{/key}
		<span class="note mono">illustrative</span>
	</div>

	<div class="control">
		<input type="range" min="0" max={layers.length - 1} step="1" bind:value={i} aria-label="Altitude" aria-valuetext={layer.label} />
		<div class="stops">
			{#each layers as l, n}
				<button class:on={n === i} onclick={() => (i = n)}>{l.label}</button>
			{/each}
		</div>
		<p class="caption">{layer.caption}</p>
	</div>
</div>

<style>
	.stage {
		position: relative;
		min-height: 340px;
		display: grid;
		place-items: center;
		padding: 48px 20px 40px;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		background:
			radial-gradient(circle at 1px 1px, var(--line) 1px, transparent 0) 0 0 / 22px 22px,
			var(--paper);
		overflow: hidden;
	}
	.depth,
	.note {
		position: absolute;
		font-size: 11px;
		color: var(--muted);
	}
	.depth {
		top: 16px;
		left: 18px;
	}
	.note {
		bottom: 14px;
		right: 18px;
	}
	.card {
		width: min(100%, 340px);
		background: var(--surface);
		border: 1px solid var(--line);
		border-radius: 16px;
		padding: 20px;
		animation: pop 0.45s var(--ease);
	}
	@keyframes pop {
		from {
			opacity: 0;
			transform: translateY(14px) scale(0.97);
		}
	}
	.form {
		display: grid;
		gap: 10px;
	}
	.field {
		display: flex;
		justify-content: space-between;
		padding: 10px 12px;
		border: 1px solid var(--line);
		border-radius: 10px;
		font-size: 14px;
		background: var(--paper);
	}
	.field span {
		color: var(--muted);
	}
	.fake-btn {
		text-align: center;
		padding: 11px;
		border-radius: 999px;
		background: var(--ink);
		color: var(--surface);
		font-size: 14px;
		font-weight: 500;
	}
	pre {
		margin: 0;
		font-size: 12.5px;
		line-height: 1.65;
		white-space: pre-wrap;
		word-break: break-word;
	}
	.table {
		font-size: 12px;
		display: grid;
		gap: 2px;
	}
	.row {
		display: grid;
		grid-template-columns: 0.8fr 1.3fr 0.7fr 1.2fr;
		gap: 8px;
		padding: 8px 6px;
		border-radius: 6px;
	}
	.row.head {
		color: var(--muted);
		border-bottom: 1px solid var(--line);
		border-radius: 0;
	}
	.row.dim {
		opacity: 0.5;
	}
	.row.hot {
		background: var(--accent-soft);
		outline: 1px solid var(--accent);
	}
	.control {
		margin-top: 22px;
	}
	input[type='range'] {
		width: 100%;
		accent-color: var(--accent);
		margin: 0;
	}
	.stops {
		display: flex;
		justify-content: space-between;
		margin-top: 8px;
	}
	.stops button {
		font-family: var(--mono);
		font-size: 12px;
		background: none;
		border: 0;
		padding: 6px 2px;
		color: var(--muted);
		cursor: pointer;
	}
	.stops button.on {
		color: var(--ink);
		font-weight: 600;
	}
	.caption {
		margin-top: 14px;
		font-family: var(--serif);
		font-style: italic;
		font-size: 22px;
		line-height: 1.25;
		min-height: 2.5em;
	}
</style>
