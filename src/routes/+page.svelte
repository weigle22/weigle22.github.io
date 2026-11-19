<script lang="ts">
	import { site } from '#lib/data/site.ts';
	import Hero from '#lib/sections/Hero.svelte';
	import Work from '#lib/sections/Work.svelte';
	import About from '#lib/sections/About.svelte';
	import Experience from '#lib/sections/Experience.svelte';
	import Education from '#lib/sections/Education.svelte';
	import Stack from '#lib/sections/Stack.svelte';
	import Playground from '#lib/sections/Playground.svelte';
	import GitHubActivity from '#lib/sections/GitHubActivity.svelte';
	import Contact from '#lib/sections/Contact.svelte';
	import Footer from '#lib/components/Footer.svelte';
	import Guide from '#lib/components/Guide.svelte';

	const title = `${site.name} · ${site.title}`;
	const description = `${site.name} is a full-stack .NET developer in ${site.locationShort}, building business applications with ASP.NET Core, C#, SQL Server and Angular.`;
	const person = {
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: site.name,
		jobTitle: site.title,
		image: `${site.url}${site.profileImage}`,
		address: { '@type': 'PostalAddress', addressLocality: 'Tagum City', addressRegion: 'Davao del Norte', addressCountry: 'PH' },
		worksFor: { '@type': 'GovernmentOrganization', name: 'Provincial Government of Davao del Norte' },
		alumniOf: [
			{ '@type': 'CollegeOrUniversity', name: 'Davao del Norte State College' },
			{ '@type': 'CollegeOrUniversity', name: 'University of Mindanao' }
		],
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
	<meta property="og:image" content="{site.url}/og.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="{site.name}, {site.title}" />
	<meta property="og:site_name" content={site.name} />
	<meta property="og:locale" content="en_PH" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content="{site.url}/og.png" />
	{@html `<script type="application/ld+json">${JSON.stringify(person)}</` + `script>`}
</svelte:head>

<main>
	<Hero />
	<Work />
	<About />
	<Experience />
	<Education />
	<Stack />
	<Playground />
	<GitHubActivity />
	<Contact />
</main>
<Footer />
<Guide />
