<script>
	import { cases, archive } from '#lib/data/content.js';
	import { reveal } from '#lib/motion.svelte.js';

	let flipped = $state({});
	const flip = (id) => (flipped[id] = !flipped[id]);
</script>

<section id="work">
	<div class="wrap">
		<div use:reveal>
			<p class="tag">case-files · {cases.length} items</p>
			<h2>Six case <em class="serif">files.</em></h2>
			<p class="lede">
				Each one has a surface and an underneath. Flip a card to see what was really being built.
			</p>
		</div>

		<div class="cards">
			{#each cases as c (c.id)}
				<article class="card {c.tone}" class:flipped={flipped[c.id]} use:reveal>
					<div class="inner">
						<div class="face front" inert={flipped[c.id]}>
							<ul class="tags">
								{#each c.tags as t}<li>{t}</li>{/each}
							</ul>
							<h3>{c.title}</h3>
							<p class="figure">{c.figure}</p>
							<p class="figure-note">{c.figureNote}</p>
							<p class="pitch">{c.front}</p>
							<button class="flip" onclick={() => flip(c.id)} aria-expanded={!!flipped[c.id]}>
								<span aria-hidden="true">↻</span> What’s underneath
							</button>
						</div>
						<div class="face back" inert={!flipped[c.id]}>
							<p class="mono label">UNDERNEATH</p>
							<ul class="bullets">
								{#each c.back as b}<li>{b}</li>{/each}
							</ul>
							<ul class="stack">
								{#each c.stack as s}<li>{s}</li>{/each}
							</ul>
							<div class="row">
								<button class="flip" onclick={() => flip(c.id)}>
									<span aria-hidden="true">↻</span> Back to the surface
								</button>
								{#if c.link}
									<a class="out" href={c.link.url} rel="noopener">{c.link.label} →</a>
								{:else}
									<span class="private mono">private · no code link</span>
								{/if}
							</div>
						</div>
					</div>
				</article>
			{/each}
		</div>

		<div class="archive" use:reveal>
			<p class="mono label">ALSO ON FILE</p>
			<ul>
				{#each archive as a}
					<li>
						{#if a.url}<a href={a.url} rel="noopener">{a.title} →</a>{:else}<b>{a.title}</b>{/if}
						<span>{a.note}</span>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</section>

<style>
	.cards {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 330px), 1fr));
		gap: 18px;
		margin-top: 48px;
	}
	.card {
		perspective: 1600px;
		--bg: var(--paper);
		--fg: var(--ink);
		--soft: var(--muted);
		--edge: var(--line);
	}
	.card.ink {
		--bg: #17181c;
		--fg: #f3f2ed;
		--soft: #a3a5ae;
		--edge: #34353c;
	}
	.card.accent {
		--bg: var(--accent-soft);
		--edge: color-mix(in srgb, var(--accent) 35%, var(--line));
	}
	.inner {
		display: grid;
		height: 100%;
		transform-style: preserve-3d;
		transition: transform 0.7s cubic-bezier(0.3, 0.7, 0.2, 1);
	}
	.flipped .inner {
		transform: rotateY(180deg);
	}
	.face {
		grid-area: 1 / 1;
		display: flex;
		flex-direction: column;
		min-height: 440px;
		padding: 26px;
		border-radius: var(--radius);
		background: var(--bg);
		color: var(--fg);
		border: 1px solid var(--edge);
		backface-visibility: hidden;
		-webkit-backface-visibility: hidden;
	}
	.back {
		transform: rotateY(180deg);
		background-image: radial-gradient(circle at 1px 1px, var(--edge) 1px, transparent 0);
		background-size: 18px 18px;
	}
	.tags,
	.stack {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}
	.tags li,
	.stack li {
		font-family: var(--mono);
		font-size: 10.5px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		padding: 4px 8px;
		border: 1px solid var(--edge);
		border-radius: 6px;
		color: var(--soft);
	}
	h3 {
		margin-top: 18px;
		font-size: 19px;
		line-height: 1.25;
		font-weight: 550;
		letter-spacing: -0.015em;
		text-wrap: balance;
	}
	.figure {
		margin-top: auto;
		padding-top: 28px;
		font-size: clamp(40px, 5vw, 52px);
		line-height: 1;
		font-weight: 600;
		letter-spacing: -0.04em;
	}
	.figure-note {
		margin-top: 8px;
		font-size: 14px;
		color: var(--soft);
		max-width: 32ch;
	}
	.pitch {
		margin-top: 22px;
		font-size: 16px;
		line-height: 1.4;
		font-weight: 500;
	}
	.flip {
		align-self: flex-start;
		margin-top: 20px;
		padding: 8px 14px;
		border-radius: 999px;
		border: 1px solid var(--edge);
		background: transparent;
		color: inherit;
		font-size: 13.5px;
		cursor: pointer;
		transition: border-color 0.2s;
	}
	.flip:hover {
		border-color: currentColor;
	}
	.label {
		font-size: 11px;
		letter-spacing: 0.1em;
		color: var(--soft);
	}
	.bullets {
		margin: 16px 0 20px;
		padding: 0;
		list-style: none;
		display: grid;
		gap: 10px;
		font-size: 14.5px;
		line-height: 1.4;
	}
	.bullets li {
		padding-left: 18px;
		position: relative;
	}
	.bullets li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.55em;
		width: 8px;
		height: 1.5px;
		background: var(--accent);
	}
	.stack {
		margin-top: auto;
	}
	.stack li {
		background: var(--bg);
	}
	.row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
	}
	.out {
		margin-top: 20px;
		font-size: 14px;
		font-weight: 500;
		color: var(--accent);
		text-decoration: none;
	}
	.card.ink .out {
		color: #ff8a65;
	}
	.out:hover {
		text-decoration: underline;
	}
	.private {
		margin-top: 20px;
		font-size: 11px;
		color: var(--soft);
	}
	.archive {
		margin-top: 56px;
		padding-top: 28px;
		border-top: 1px solid var(--line);
	}
	.archive .label {
		color: var(--muted);
	}
	.archive ul {
		list-style: none;
		padding: 0;
		margin: 16px 0 0;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
		gap: 20px 28px;
	}
	.archive li {
		display: grid;
		gap: 4px;
		font-size: 14.5px;
	}
	.archive a,
	.archive b {
		font-weight: 550;
		text-decoration: none;
	}
	.archive a:hover {
		color: var(--accent);
	}
	.archive span {
		color: var(--muted);
	}

	/* With motion off, swap faces instead of spinning them. */
	:global(html[data-motion='off']) .inner,
	:global(html[data-motion='off']) .flipped .inner {
		transform: none;
	}
	:global(html[data-motion='off']) .back {
		transform: none;
		visibility: hidden;
	}
	:global(html[data-motion='off']) .flipped .back {
		visibility: visible;
	}
	:global(html[data-motion='off']) .flipped .front {
		visibility: hidden;
	}
</style>
