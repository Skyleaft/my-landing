<script lang="ts">
	import type { Experience } from '$lib/types/api';
	import { fly } from 'svelte/transition';

	interface Props {
		experiences: Experience[];
	}

	let { experiences = [] }: Props = $props();
	let loading = $state(false);
	let error = $state<string | null>(null);

	function formatDate(dateStr: string) {
		const options: Intl.DateTimeFormatOptions = {
			year: 'numeric',
			month: 'short'
		};
		return new Date(dateStr).toLocaleDateString('en-US', options);
	}
</script>

<section id="experience" class="container mx-auto px-6 py-20 section-blur">
	<div class="mb-12 flex flex-col items-center">
		<h2 class="text-4xl font-bold mb-4">Professional Experience</h2>
		<div class="w-20 h-1.5 bg-primary-400 rounded-full"></div>
	</div>

	<div class="max-w-4xl mx-auto space-y-12">
		{#if loading}
			{#each Array(4) as _, i}
				<div
					class="p-8 glass-card animate-pulse flex flex-col md:flex-row gap-6"
					style="opacity: {1 - i * 0.2}"
				>
					<div class="md:w-1/4 h-6 bg-primary-400/20 rounded-md"></div>
					<div class="flex-1 space-y-4">
						<div class="h-8 bg-primary-400/20 rounded-md w-3/4"></div>
						<div class="h-4 bg-primary-400/20 rounded-md w-1/4"></div>
						<div class="space-y-2 pt-4">
							<div class="h-4 bg-primary-400/20 rounded-md"></div>
							<div class="h-4 bg-primary-400/20 rounded-md"></div>
							<div class="h-4 bg-primary-400/20 rounded-md w-1/2"></div>
						</div>
					</div>
				</div>
			{/each}
		{:else if error}
			<div class="glass-card p-10 text-center text-red-500">
				{error}
			</div>
		{:else}
			{#each experiences as exp, i}
				<div
					class="relative p-8 glass-card group"
					in:fly={{ y: 30, duration: 800, delay: i * 200 }}
				>
					<div class="flex flex-col md:flex-row gap-6">
						<div class="md:w-1/4">
							<div class="text-sm font-bold text-primary-500 mb-2 uppercase tracking-wider">
								{formatDate(exp.since_date.start)} — {exp.since_date.end === 'Present'
									? 'Present'
									: formatDate(exp.since_date.end)}
							</div>
							<div class="text-lg font-medium text-[var(--foreground)]/80">
								{exp.work_field}
							</div>
						</div>

						<div class="flex-1">
							<h3 class="text-2xl font-bold mb-2 group-hover:text-primary-500 transition-colors">
								{exp.title}
							</h3>

							<div class="mt-6 prose dark:prose-invert max-w-none text-lg">
								<ul class="list-disc space-y-4 marker:text-primary-400">
									{#each exp.detail as detail}
										<li>{@html detail}</li>
									{/each}
								</ul>
							</div>
						</div>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</section>
