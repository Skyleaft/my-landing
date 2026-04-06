<script lang="ts">
	import { theme } from '$lib/features/ui/theme.svelte';
	import { fade, fly } from 'svelte/transition';

	let scrolled = $state(false);

	$effect(() => {
		const handleScroll = () => {
			scrolled = window.scrollY > 50;
		};

		handleScroll();
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});

	const navItems = [
		{ name: 'Profile', href: '#profile' },
		{ name: 'Experience', href: '#experience' },
		{ name: 'Skills', href: '#skills' },
		{ name: 'HomeLab', href: '#homelab' }
	];
</script>

<header
	class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 {scrolled
		? 'py-4 glass-card border-none rounded-none'
		: 'py-8 bg-transparent'}"
>
	<div class="container mx-auto px-6 flex justify-between items-center text-primary-500">
		<a href="/" class="text-2xl font-bold text-primary-500 hover:scale-105 transition-all">
			Milzan<span class="text-[var(--foreground)]">.log</span>
		</a>

		<nav class="hidden md:flex items-center gap-8 text-primary-500">
			{#each navItems as item}
				<a href={item.href} class="text-sm font-bold uppercase tracking-widest hover:text-primary-400 transition-colors">
					{item.name}
				</a>
			{/each}

			<button
				onclick={() => theme.toggle()}
				class="p-2 glass rounded-xl text-primary-500 hover:scale-110 transition-all border border-primary-400/20"
				aria-label="Toggle Theme"
			>
				{theme.current === 'dark' ? '🌙' : '☀️'}
			</button>
		</nav>

		<button
			onclick={() => theme.toggle()}
			class="p-2 glass rounded-xl text-primary-500 md:hidden border border-primary-400/20"
		>
			{theme.current === 'dark' ? '🌙' : '☀️'}
		</button>
	</div>
</header>