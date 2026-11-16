<script>
	import { motion, toggleMotion } from '#lib/motion.svelte.js';
	import { person } from '#lib/data/content.js';
</script>

<header>
	<div class="wrap bar">
		<a class="name" href="#top">{person.name.split(' ')[0]}<span>.Otacan</span></a>
		<nav aria-label="Sections">
			<a href="#work">Work</a>
			<a href="#demos">Demos</a>
			<a href="#path">Path</a>
			<a href="#contact">Contact</a>
		</nav>
		<button class="motion" onclick={toggleMotion} aria-pressed={!motion.on} title="Turn animation on or off">
			<span class="led" class:on={motion.on}></span>
			motion {motion.on ? 'on' : 'off'}
		</button>
	</div>
</header>

<style>
	header {
		position: sticky;
		top: 0;
		z-index: 30;
		background: color-mix(in srgb, var(--surface) 82%, transparent);
		backdrop-filter: blur(12px);
		border-bottom: 1px solid color-mix(in srgb, var(--line) 60%, transparent);
	}
	.bar {
		display: flex;
		align-items: center;
		gap: 20px;
		height: 60px;
	}
	.name {
		font-weight: 650;
		letter-spacing: -0.02em;
		text-decoration: none;
		margin-right: auto;
	}
	.name span {
		color: var(--muted);
		font-weight: 450;
	}
	nav {
		display: flex;
		gap: 22px;
		font-size: 15px;
	}
	nav a {
		text-decoration: none;
		color: var(--muted);
		transition: color 0.2s;
	}
	nav a:hover {
		color: var(--ink);
	}
	.motion {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-family: var(--mono);
		font-size: 12px;
		padding: 6px 10px;
		border-radius: 999px;
		border: 1px solid var(--line);
		background: transparent;
		cursor: pointer;
		white-space: nowrap;
	}
	.led {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--muted);
	}
	.led.on {
		background: var(--ok);
	}
	@media (max-width: 640px) {
		nav {
			display: none;
		}
	}
</style>
