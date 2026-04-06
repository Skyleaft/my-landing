<script lang="ts">
	import type { HomeLab } from '$lib/types/api';
	import { inView } from '$lib/actions/inView';

	interface Props {
		homelab: HomeLab[];
	}

	let { homelab = [] }: Props = $props();
	let loading = $state(false);
	let error = $state<string | null>(null);

	function getCategoryColor(category: string) {
		const colors: Record<string, string> = {
			network: 'text-blue-400',
			storage: 'text-yellow-400',
			monitoring: 'text-green-400',
			media: 'text-purple-400',
			virtualization: 'text-red-400'
		};
		return colors[category.toLowerCase()] || 'text-primary-400';
	}
</script>

<section id="homelab" class="section-blur container mx-auto px-6 py-20">
	<div class="mb-12 flex flex-col items-center">
		<h2 class="reveal reveal-up mb-4 text-4xl font-bold" use:inView>My HomeLab Ecosystem</h2>
		<div class="reveal reveal-scale stagger-2 h-1.5 w-20 rounded-full bg-primary-400" use:inView></div>
	</div>

	{#if loading}
		<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
			{#each Array(6) as _, i}
				<div class="glass-card flex animate-pulse flex-col items-center space-y-6 p-8">
					<div class="h-16 w-16 rounded-2xl bg-primary-400/20"></div>
					<div class="h-8 w-3/4 rounded-md bg-primary-400/20"></div>
					<div class="h-4 w-1/2 rounded-md bg-primary-400/20"></div>
					<div class="w-full space-y-2 pt-4">
						<div class="h-4 rounded-md bg-primary-400/20"></div>
						<div class="h-4 w-2/3 rounded-md bg-primary-400/20"></div>
					</div>
				</div>
			{/each}
		</div>
	{:else if error}
		<div class="glass-card p-10 text-center text-red-500">{error}</div>
	{:else}
		<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
			{#each homelab as svc, i}
				<div
					class="glass-card group p-8 hover:-translate-y-2 hover:border-primary-400/50 hover:shadow-2xl reveal reveal-up stagger-{Math.min(i + 1, 8)}"
					use:inView
				>
					<div class="flex flex-col items-center text-center">
						<div
							class="glass mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-primary-400/20 text-4xl transition-all group-hover:scale-110"
						>
							{svc.icon}
						</div>

						<h3 class="mb-2 text-2xl font-bold transition-colors group-hover:text-primary-500">
							{svc.name}
						</h3>

						<div class="mb-4 flex items-center gap-2">
							<span class="text-xs font-bold tracking-widest uppercase {getCategoryColor(svc.category)}">
								{svc.category}
							</span>
							<span class="h-1 w-1 rounded-full bg-primary-400/30"></span>
							<span
								class="flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase {svc.isOnline
									? 'text-green-500'
									: 'text-gray-500'}"
							>
								<span
									class="h-2 w-2 rounded-full {svc.isOnline
										? 'animate-pulse bg-green-500'
										: 'bg-gray-500'}"
								></span>
								{svc.isOnline ? 'ONLINE' : 'OFFLINE'}
							</span>
						</div>

						<p class="mb-8 leading-relaxed text-[var(--foreground)]/70">
							{svc.description}
						</p>

						<a
							href={svc.url}
							target="_blank"
							rel="noopener noreferrer"
							class="glass w-full rounded-xl border border-primary-400/30 py-3 font-bold text-primary-500 transition-all hover:bg-primary-500 hover:text-white"
						>
							Launch Service
						</a>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</section>
