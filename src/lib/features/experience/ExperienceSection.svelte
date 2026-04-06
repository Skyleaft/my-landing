<script lang="ts">
	import type { Experience } from '$lib/types/api';
	import { inView } from '$lib/actions/inView';

	interface Props {
		experiences: Experience[];
	}

	let { experiences = [] }: Props = $props();
	let loading = $state(false);
	let error = $state<string | null>(null);

	function formatDate(dateStr: string) {
		const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short' };
		return new Date(dateStr).toLocaleDateString('en-US', options);
	}
</script>

<section id="experience" class="section-blur container mx-auto px-6 py-20">
	<div class="mb-12 flex flex-col items-center" use:inView>
		<h2 class="reveal reveal-up mb-4 text-4xl font-bold" use:inView>Professional Experience</h2>
		<div
			class="reveal reveal-scale stagger-2 h-1.5 w-20 rounded-full bg-primary-400"
			use:inView
		></div>
	</div>

	<div class="mx-auto max-w-4xl space-y-12">
		{#if loading}
			{#each Array(4) as _, i}
				<div
					class="glass-card flex animate-pulse flex-col gap-6 p-8 md:flex-row"
					style="opacity: {1 - i * 0.2}"
				>
					<div class="h-6 rounded-md bg-primary-400/20 md:w-1/4"></div>
					<div class="flex-1 space-y-4">
						<div class="h-8 w-3/4 rounded-md bg-primary-400/20"></div>
						<div class="h-4 w-1/4 rounded-md bg-primary-400/20"></div>
						<div class="space-y-2 pt-4">
							<div class="h-4 rounded-md bg-primary-400/20"></div>
							<div class="h-4 rounded-md bg-primary-400/20"></div>
							<div class="h-4 w-1/2 rounded-md bg-primary-400/20"></div>
						</div>
					</div>
				</div>
			{/each}
		{:else if error}
			<div class="glass-card p-10 text-center text-red-500">{error}</div>
		{:else}
			{#each experiences as exp, i}
				<div
					class="glass-card group reveal reveal-up relative p-8 stagger-{Math.min(i + 1, 8)}"
					use:inView
				>
					<div class="flex flex-col gap-6 md:flex-row">
						<div class="md:w-1/4">
							<div class="mb-2 text-sm font-bold tracking-wider text-primary-500 uppercase">
								{formatDate(exp.since_date.start)} — {exp.since_date.end === 'Present'
									? 'Present'
									: formatDate(exp.since_date.end)}
							</div>
							<div class="text-lg font-medium text-[var(--foreground)]/80">
								{exp.work_field}
							</div>
						</div>

						<div class="flex-1">
							<h3 class="mb-2 text-2xl font-bold transition-colors group-hover:text-primary-500">
								{exp.title}
							</h3>

							<div class="prose mt-6 max-w-none text-lg dark:prose-invert">
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
