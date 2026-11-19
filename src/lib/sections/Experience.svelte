<script lang="ts">
	import MapPin from '@lucide/svelte/icons/map-pin';
	import { employment, journey } from '#lib/data/site.ts';
	import { drawLine, rise, stagger, words } from '#lib/animations/scroll.ts';
	import { pad2 } from '#lib/utils/format.ts';
</script>

<section id="experience" class="light">
	<div class="wrap">
		<div class="eyebrow"><span>Professional experience</span><span>(03)</span></div>
		<h2 use:words>Where the work <em class="serif">happens</em></h2>

		{#each employment as job}
			<article class="job" use:rise>
				<header>
					<p class="dates">{job.start} – {job.end}</p>
					<div>
						<h3>{job.role}</h3>
						<p class="org">{job.org}</p>
						<p class="loc"><MapPin size={14} /> {job.location}</p>
					</div>
				</header>

				<div class="body">
					<div>
						<p class="label">Responsibilities</p>
						<ul class="duties" use:stagger={{ each: 0.05 }}>
							{#each job.responsibilities as r}<li>{r}</li>{/each}
						</ul>
					</div>

					<div>
						<p class="label">Selected systems</p>
						<ol class="systems">
							{#each job.systems as s, i}
								<li>
									<span class="n">{pad2(i + 1)}</span>
									<div>
										<p class="sys">{s.name}{#if s.full}<span>&nbsp;· {s.full}</span>{/if}</p>
										{#if s.contribution}
											<p class="mine"><b>My part</b> {s.contribution}</p>
										{:else}
											<p class="team">Team system</p>
										{/if}
									</div>
								</li>
							{/each}
						</ol>
						<p class="fine">These systems are built and run by a team; “My part” marks the modules I built myself. Source code and data are confidential.</p>
					</div>
				</div>
			</article>
		{/each}

		<div class="timeline">
			<p class="label">Milestones</p>
			<span class="track" aria-hidden="true"><i use:drawLine></i></span>
			<ol>
				{#each journey as m}
					<li use:rise>
						<span class="when">{m.when}</span>
						<span class="dot" aria-hidden="true"></span>
						<div>
							<span class="label">{m.kind}</span>
							<h4>{m.title}</h4>
							{#if m.note}<p>{m.note}</p>{/if}
						</div>
					</li>
				{/each}
			</ol>
		</div>
	</div>
</section>

<style>
	h2 {
		max-width: 15ch;
	}
	.job {
		margin-top: clamp(40px, 6vw, 80px);
		border-top: 1px solid var(--ink);
		padding-top: clamp(24px, 3vw, 36px);
	}
	header {
		display: grid;
		grid-template-columns: minmax(0, 0.38fr) minmax(0, 1fr);
		gap: 24px;
	}
	.dates {
		font-size: 13px;
		font-weight: 500;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		padding-top: 10px;
	}
	h3 {
		font-size: clamp(32px, 4.6vw, 64px);
		line-height: 0.98;
		letter-spacing: -0.045em;
		font-weight: 600;
	}
	.org {
		margin-top: 10px;
		font-family: var(--serif);
		font-weight: 640;
		font-size: clamp(22px, 2.4vw, 32px);
		line-height: 1.1;
	}
	.loc {
		margin-top: 8px;
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 14px;
		color: var(--muted);
	}
	.body {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: clamp(32px, 5vw, 72px);
		margin-top: clamp(32px, 4vw, 56px);
		margin-left: calc(0.38 / 1.38 * 100% + 12px);
	}
	.duties,
	.systems {
		list-style: none;
		margin: 12px 0 0;
		padding: 0;
	}
	.duties li {
		position: relative;
		padding: 11px 0 11px 22px;
		border-bottom: 1px solid var(--line);
		font-size: 16px;
		line-height: 1.4;
	}
	.duties li::before {
		content: '→';
		position: absolute;
		left: 0;
		color: var(--accent);
	}
	.systems li {
		display: grid;
		grid-template-columns: 34px 1fr;
		padding: 12px 0;
		border-bottom: 1px solid var(--line);
	}
	.n {
		font-family: var(--mono);
		font-size: 12px;
		color: var(--muted);
		padding-top: 3px;
	}
	.sys {
		font-weight: 600;
		font-size: 17px;
	}
	.sys span {
		font-weight: 400;
		color: var(--muted);
		font-size: 15px;
	}
	.team {
		margin-top: 4px;
		font-family: var(--mono);
		font-size: 11px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--muted);
	}
	.mine {
		margin-top: 6px;
		font-size: 14.5px;
		line-height: 1.45;
		padding: 10px 12px;
		border-radius: 10px;
		background: var(--accent-soft);
	}
	.mine b {
		display: block;
		font-family: var(--mono);
		font-size: 11px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--accent);
		margin-bottom: 2px;
	}
	.fine {
		margin-top: 14px;
		font-size: 13px;
		color: var(--muted);
	}
	.timeline {
		position: relative;
		margin-top: clamp(64px, 9vw, 120px);
	}
	.timeline > .label {
		margin-bottom: 8px;
	}
	.track {
		position: absolute;
		left: calc(22% + clamp(20px, 4vw, 56px) + 5px);
		top: 40px;
		bottom: 0;
		width: 1px;
		background: var(--line);
	}
	.track i {
		position: absolute;
		inset: 0;
		background: var(--ink);
	}
	.timeline ol {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.timeline li {
		display: grid;
		grid-template-columns: 22% 11px 1fr;
		gap: 0 clamp(20px, 4vw, 56px);
		padding: clamp(20px, 2.8vw, 36px) 0;
		align-items: start;
	}
	.when {
		font-size: clamp(28px, 4.4vw, 60px);
		line-height: 1;
		font-weight: 600;
		letter-spacing: -0.05em;
		text-align: right;
	}
	.dot {
		width: 11px;
		height: 11px;
		border-radius: 50%;
		background: var(--surface);
		border: 2px solid var(--ink);
		margin-top: clamp(8px, 1.6vw, 22px);
		position: relative;
	}
	h4 {
		margin: 8px 0;
		font-family: var(--serif);
		font-weight: 780;
		font-size: clamp(26px, 3vw, 40px);
		line-height: 1.02;
	}
	.timeline p {
		color: var(--muted);
		max-width: 56ch;
		font-size: 16px;
	}
	@media (max-width: 900px) {
		header,
		.body {
			grid-template-columns: 1fr;
		}
		.body {
			margin-left: 0;
		}
		.dates {
			padding-top: 0;
		}
	}
	@media (max-width: 640px) {
		.track {
			left: 5px;
		}
		.timeline li {
			grid-template-columns: 11px 1fr;
			gap: 0 20px;
		}
		.when {
			grid-column: 2;
			text-align: left;
			margin-bottom: 8px;
		}
		.dot {
			grid-row: 1 / span 2;
			margin-top: 10px;
		}
		.timeline li > div {
			grid-column: 2;
		}
	}
</style>
