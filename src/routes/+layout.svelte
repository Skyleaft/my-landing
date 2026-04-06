<script lang="ts">
	import './layout.css';
	import AnimatedBackground from '$lib/features/ui/AnimatedBackground.svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import { theme } from '$lib/features/ui/theme.svelte.ts';

	let { children } = $props();
</script>

<svelte:head>
	<title>Milzan Malik | Fullstack Developer & .NET Architect</title>
	<meta
		name="description"
		content="Portfolio of Milzan Malik, a .NET Architect and Fullstack Developer specializing in modern web applications and AI-driven development."
	/>
</svelte:head>

<div class="min-h-screen flex flex-col relative overflow-hidden">
	<AnimatedBackground />

	<Header />

	<main class="flex-1 pt-24 pb-20">
		{@render children()}
	</main>

	<footer class="py-12 border-t border-[var(--card-border)] glass mt-auto">
		<div
			class="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-primary-500 font-bold"
		>
			<div class="flex items-center gap-4">
				<span>© {new Date().getFullYear()} Milzan Malik</span>
				<span class="w-1.5 h-1.5 bg-primary-400 rounded-full"></span>
				<span>Build with Svelte 5 + Tailwind 4</span>
			</div>
			<div class="flex gap-8 uppercase tracking-widest">
				<a href="https://github.com/Skyleaft" target="_blank" class="hover:text-primary-400">GitHub</a>
				<a
					href="https://id.linkedin.com/in/milzan-malik-fitriana-407454189"
					target="_blank"
					class="hover:text-primary-400">LinkedIn</a
				>
			</div>
		</div>
	</footer>
</div>

<style>
	:global(html) {
		scroll-behavior: smooth;
	}
</style>
