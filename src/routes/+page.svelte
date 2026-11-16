<script>
	import { onMount } from 'svelte';
	import { initMotion } from '#lib/motion.svelte.js';
	import { person } from '#lib/data/content.js';
	import Header from '#lib/components/Header.svelte';
	import Hero from '#lib/components/Hero.svelte';
	import Layers from '#lib/components/Layers.svelte';
	import CaseFiles from '#lib/components/CaseFiles.svelte';
	import Demos from '#lib/components/Demos.svelte';
	import Path from '#lib/components/Path.svelte';
	import Numbers from '#lib/components/Numbers.svelte';
	import Contact from '#lib/components/Contact.svelte';
	import Guide from '#lib/components/Guide.svelte';

	let { data } = $props();
	let touring = $state(false);

	onMount(initMotion);

	const description =
		'Emmanuel Otacan is a full-stack developer working in .NET, SQL Server and Angular, with projects in post-quantum signatures and local AI.';
</script>

<svelte:head>
	<title>{person.name} · Full-stack developer</title>
	<meta name="description" content={description} />
	<meta property="og:title" content="{person.name} · Full-stack developer" />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://weigle22.github.io/" />
</svelte:head>

<Header />
<main>
	<Hero onTour={() => (touring = true)} />
	<Layers />
	<CaseFiles />
	<Demos />
	<Path />
	<Numbers github={data.github} />
	<Contact />
</main>
<Guide bind:touring />
