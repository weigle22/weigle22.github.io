<script lang="ts">
	import { site } from '#lib/data/site.ts';
	import Hero from '#lib/sections/Hero.svelte';
	import Work from '#lib/sections/Work.svelte';
	import About from '#lib/sections/About.svelte';
	import Experience from '#lib/sections/Experience.svelte';
	import Stack from '#lib/sections/Stack.svelte';
	import Playground from '#lib/sections/Playground.svelte';
	import GitHubActivity from '#lib/sections/GitHubActivity.svelte';
	import Contact from '#lib/sections/Contact.svelte';
	import Footer from '#lib/components/Footer.svelte';
	import Guide from '#lib/components/Guide.svelte';

	const title = `${site.name} · ${site.title}`;
	const description = `${site.name} is a ${site.title.toLowerCase()} working in .NET, SQL Server and Angular, with projects in post-quantum signatures and local AI.`;
	const person = {
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: site.name,
		jobTitle: site.title,
		url: site.url,
		sameAs: [`https://github.com/${site.githubUsername}`, site.linkedin, ...site.links.map((l) => l.url)]
	};
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href="{site.url}/" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="{site.url}/" />
	<meta name="twitter:card" content="summary" />
	{@html `<script type="application/ld+json">${JSON.stringify(person)}</` + `script>`}
</svelte:head>

<main>
	<Hero />
	<Work />
	<About />
	<Experience />
	<Stack />
	<Playground />
	<GitHubActivity />
	<Contact />
</main>
<Footer />
<Guide />
