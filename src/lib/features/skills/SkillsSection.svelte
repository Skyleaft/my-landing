<script lang="ts">
	import type { TechnicalSkill } from '$lib/types/api';
	import { inView } from '$lib/actions/inView';

	interface Props {
		skills: TechnicalSkill | null;
	}

	let { skills = null }: Props = $props();
	let loading = $state(false);
	let error = $state<string | null>(null);

	interface SkillCategory {
		label: string;
		key: keyof TechnicalSkill;
		icon: string;
	}

	const categories: SkillCategory[] = [
		{ label: 'Programming Languages', key: 'programming_language', icon: '💻' },
		{ label: 'Web Frameworks', key: 'web_frameworks', icon: '🌐' },
		{ label: 'Backend & Architecture', key: 'backend_architecture', icon: '🏗️' },
		{ label: 'Databases & Caching', key: 'databases_caching', icon: '🗄️' },
		{ label: 'DevOps & Cloud', key: 'devops_cloud', icon: '☁️' },
		{ label: 'Message Brokers', key: 'message_brokers', icon: '✉️' },
		{ label: 'Infrastructure & AI', key: 'infrastructure_networking', icon: '🛠️' },
		{ label: 'Development Tools', key: 'tools_design', icon: '🔧' }
	];
</script>

<section id="skills" class="section-blur container mx-auto px-6 py-20">
	<div class="mb-12 flex flex-col items-center">
		<h2 class="reveal reveal-up mb-4 text-4xl font-bold" use:inView>Technical Skills</h2>
		<div
			class="reveal reveal-scale stagger-2 h-1.5 w-20 rounded-full bg-primary-400"
			use:inView
		></div>
	</div>

	{#if loading}
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
			{#each Array(8) as _, i}
				<div class="glass-card animate-pulse space-y-4 p-6">
					<div class="h-6 w-1/2 rounded-md bg-primary-400/20"></div>
					<div class="space-y-2">
						<div class="h-4 w-3/4 rounded-md bg-primary-400/20"></div>
						<div class="h-4 w-2/3 rounded-md bg-primary-400/20"></div>
						<div class="h-4 w-1/2 rounded-md bg-primary-400/20"></div>
					</div>
				</div>
			{/each}
		</div>
	{:else if error}
		<div class="glass-card p-10 text-center text-red-500">{error}</div>
	{:else if skills}
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
			{#each categories as cat, i}
				<div
					class="glass-card group skill-card reveal reveal-up p-6 stagger-{Math.min(i + 1, 8)}"
					use:inView
				>
					<div class="mb-6 flex items-center gap-3">
						<span class="text-2xl">{cat.icon}</span>
						<h3 class="text-xl font-bold transition-colors group-hover:text-primary-500">
							{cat.label}
						</h3>
					</div>

					<div class="flex flex-wrap gap-2">
						{#each skills[cat.key] as item}
							<span
								class="glass rounded-lg border border-[var(--glass-border)] px-3 py-1.5 text-sm font-medium transition-all hover:border-primary-400/50 hover:bg-primary-500/10"
							>
								{item}
							</span>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</section>
