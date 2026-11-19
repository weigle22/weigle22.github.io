<script lang="ts">
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import Mail from '@lucide/svelte/icons/mail';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import { site } from '#lib/data/site.ts';
	import { magnetic, rise, words } from '#lib/animations/scroll.ts';
	import ResumeButton from '#lib/components/ResumeButton.svelte';
	import ContactForm from '#lib/components/ContactForm.svelte';

	const github = `https://github.com/${site.githubUsername}`;
	// Email is the main call to action when one is set; otherwise LinkedIn takes its place.
	const primary = site.email ? { label: site.email, url: `mailto:${site.email}` } : { label: 'Message me on LinkedIn', url: site.linkedin };
	const others = [...(site.email ? [{ label: 'LinkedIn', url: site.linkedin }] : []), { label: 'GitHub', url: github }, ...site.links];
</script>

<section id="contact" class="dark">
	<div class="wrap">
		<div class="eyebrow">
			<span>Contact</span>
			{#if site.availability}<span class="avail"><i></i>{site.availability}</span>{:else}<span>Say hello</span>{/if}
		</div>
		<h2 use:words>Have a system that needs to work <em class="serif">better?</em></h2>
		<p class="lede" use:rise>
			I’m interested in opportunities involving backend development, .NET applications, system modernization, and database-driven
			solutions. Let’s connect and discuss how we can build something reliable.
		</p>

		<div class="row" use:rise>
			<a class="big" href={primary.url} rel="noopener" use:magnetic={0.18} data-cursor="Go">
				{#if site.email}<Mail size={22} />{/if}
				{primary.label}
				<span class="arrow"><ArrowUpRight size={26} /></span>
			</a>
			<div class="side">
				<ul>
					{#each others as l}
						<li><a class="u" href={l.url} rel="noopener">{l.label} <ArrowUpRight size={14} /></a></li>
					{/each}
				</ul>
				<p class="where"><MapPin size={15} /> {site.location}{#if site.workPreference}&nbsp;· {site.workPreference.toLowerCase()} work preferred{/if}</p>
				<ResumeButton variant="link" />
			</div>
		</div>

		{#if site.contactFormEndpoint}
			<div class="form" use:rise>
				<p class="label">Or write here</p>
				<ContactForm />
			</div>
		{/if}
	</div>
</section>

<style>
	section {
		position: relative;
		overflow: hidden;
		isolation: isolate;
		padding-bottom: clamp(140px, 24vw, 340px);
	}
	/* The hero's light comes back to close the page. */
	section::after {
		content: '';
		position: absolute;
		z-index: -1;
		left: 8%;
		right: 8%;
		bottom: -40vw;
		height: 58vw;
		border-radius: 50%;
		background: radial-gradient(closest-side, var(--glow-c) 0, var(--glow-b) 30%, var(--glow-a) 62%, transparent 100%);
		filter: blur(50px);
	}
	.avail {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		color: var(--ink);
	}
	.avail i {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--ok);
	}
	h2 {
		max-width: 13ch;
		font-size: clamp(44px, 8.6vw, 140px);
	}
	.lede {
		max-width: 58ch;
	}
	.row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 28px 40px;
		margin-top: clamp(40px, 6vw, 72px);
	}
	.big {
		display: inline-flex;
		align-items: center;
		gap: 14px;
		padding: 20px 22px 20px 30px;
		border-radius: 999px;
		background: var(--ink);
		color: var(--surface);
		text-decoration: none;
		font-size: clamp(18px, 2vw, 24px);
		font-weight: 600;
		letter-spacing: -0.02em;
		overflow-wrap: anywhere;
	}
	.arrow {
		flex: none;
		display: grid;
		place-items: center;
		width: 46px;
		height: 46px;
		border-radius: 50%;
		background: var(--surface);
		color: var(--ink);
		transition: transform 0.5s var(--ease), background 0.3s;
	}
	.big:hover .arrow {
		transform: rotate(45deg);
		background: var(--glow-a);
		color: #fff;
	}
	.side {
		display: grid;
		gap: 14px;
		justify-items: start;
	}
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 10px 28px;
		font-size: 15px;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
	ul a {
		display: inline-flex;
		align-items: center;
		gap: 4px;
	}
	.where {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		color: var(--muted);
		font-size: 15px;
	}
	.form {
		margin-top: clamp(48px, 7vw, 88px);
		max-width: 760px;
	}
	.form .label {
		margin-bottom: 16px;
	}
</style>
