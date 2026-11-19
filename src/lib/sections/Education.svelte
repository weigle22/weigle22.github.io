<script lang="ts">
	import GraduationCap from '@lucide/svelte/icons/graduation-cap';
	import BadgeCheck from '@lucide/svelte/icons/badge-check';
	import { education } from '#lib/data/site.ts';
	import { stagger, words } from '#lib/animations/scroll.ts';

	const degrees = education.filter((e) => e.kind === 'Degree');
	const credentials = education.filter((e) => e.kind !== 'Degree');
</script>

<section id="education" class="dark">
	<div class="wrap">
		<div class="eyebrow"><span>Education and credentials</span><span>(04)</span></div>
		<h2 use:words>Formal <em class="serif">foundations</em></h2>

		<ol class="list" use:stagger={{ each: 0.1 }}>
			{#each degrees as d}
				<li>
					<span class="when">{d.when}</span>
					<span class="icon" aria-hidden="true"><GraduationCap size={22} /></span>
					<div>
						<h3>{d.title}</h3>
						<p class="org">{d.org}</p>
						{#if d.note}<p class="note">{d.note}</p>{/if}
					</div>
				</li>
			{/each}
		</ol>

		{#if credentials.length}
			<p class="label sub">Eligibility, certifications and training</p>
			<ol class="list small" use:stagger={{ each: 0.1 }}>
				{#each credentials as c}
					<li>
						<span class="when">{c.when}</span>
						<span class="icon" aria-hidden="true"><BadgeCheck size={20} /></span>
						<div>
							<h3>{c.title}</h3>
							<p class="org">{c.org} · {c.kind}</p>
							{#if c.note}<p class="note">{c.note}</p>{/if}
						</div>
					</li>
				{/each}
			</ol>
		{/if}
	</div>
</section>

<style>
	h2 {
		max-width: 14ch;
	}
	.list {
		list-style: none;
		margin: clamp(40px, 6vw, 72px) 0 0;
		padding: 0;
		border-top: 1px solid var(--line);
	}
	.list li {
		display: grid;
		grid-template-columns: minmax(110px, 0.32fr) 44px minmax(0, 1fr);
		gap: 16px;
		align-items: start;
		padding: clamp(22px, 3vw, 36px) 0;
		border-bottom: 1px solid var(--line);
	}
	.when {
		font-size: 13px;
		font-weight: 500;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--muted);
		padding-top: 8px;
	}
	.icon {
		width: 44px;
		height: 44px;
		border-radius: 50%;
		border: 1px solid var(--line);
		display: grid;
		place-items: center;
		color: var(--accent);
	}
	h3 {
		font-size: clamp(26px, 3.6vw, 48px);
		line-height: 1;
		letter-spacing: -0.04em;
		font-weight: 600;
		text-wrap: balance;
	}
	.small h3 {
		font-size: clamp(20px, 2.2vw, 28px);
		letter-spacing: -0.025em;
	}
	.org {
		margin-top: 8px;
		font-family: var(--serif);
		font-size: clamp(19px, 2vw, 26px);
		color: color-mix(in srgb, var(--ink) 80%, transparent);
	}
	.small .org {
		font-family: var(--sans);
		font-size: 15px;
		color: var(--muted);
	}
	.note {
		margin-top: 6px;
		color: var(--muted);
	}
	.sub {
		margin-top: clamp(40px, 5vw, 64px);
	}
	.small {
		margin-top: 14px;
	}
	@media (max-width: 640px) {
		.list li {
			grid-template-columns: 36px 1fr;
		}
		.when {
			grid-column: 1 / -1;
			padding-top: 0;
		}
		.icon {
			width: 36px;
			height: 36px;
		}
	}
</style>
