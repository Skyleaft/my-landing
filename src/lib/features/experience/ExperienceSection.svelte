<script lang="ts">
	import type { Experience } from '$lib/types/api';
	import { inView } from '$lib/actions/inView';
	import { slide } from 'svelte/transition';

	interface Props {
		experiences: Experience[];
	}

	let { experiences = [] }: Props = $props();
	let loading = $state(false);
	let error = $state<string | null>(null);
	let openStates = $state<Record<number, boolean>>({});

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

	<div class="relative mx-auto max-w-4xl space-y-12">
		<!-- Timeline line -->
		{#if !loading && !error && experiences.length > 0}
			<div
				class="absolute top-8 bottom-0 left-[15px] w-[2px] bg-primary-500/30 md:left-[23px]"
			></div>
		{/if}

		{#if loading}
			{#each Array(4) as _, i}
				<div class="relative pl-10 md:pl-16">
					<!-- Dot placeholder -->
					<div
						class="absolute top-[40px] left-[8px] h-4 w-4 rounded-full border-2 border-primary-500/20 bg-[var(--background)] md:left-[16px]"
					></div>
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
				</div>
			{/each}
		{:else if error}
			<div class="glass-card p-10 text-center text-red-500">{error}</div>
		{:else}
			{#each experiences as exp, i}
				<div
					class="group reveal reveal-up relative pl-10 md:pl-16 stagger-{Math.min(i + 1, 8)}"
					use:inView
				>
					<!-- Timeline Dot -->
					<div
						class="absolute top-[40px] left-[8px] h-4 w-4 rounded-full border-2 border-primary-500 bg-[var(--background)] shadow-md shadow-primary-500/30 transition-all duration-300 group-hover:scale-150 group-hover:bg-primary-500 group-hover:shadow-lg group-hover:shadow-primary-500/60 md:left-[16px]"
					></div>

					<div class="glass-card p-6 md:p-8">
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
								<h3 class="text-2xl font-bold transition-colors group-hover:text-primary-500">
									{exp.title}
								</h3>

								<div class="mt-4">
									<button
										type="button"
										onclick={() => (openStates[i] = !openStates[i])}
										class="inline-flex cursor-pointer items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-4 py-2 text-sm font-medium text-primary-500 transition-colors select-none hover:bg-primary-500/20 hover:text-primary-400"
									>
										{#if openStates[i]}
											<span>Hide Details</span>
										{:else}
											<span>View Details</span>
										{/if}
										<svg
											class="h-4 w-4 transition-transform {openStates[i] ? 'rotate-180' : ''}"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M19 9l-7 7-7-7"
											/>
										</svg>
									</button>

									{#if openStates[i]}
										<div transition:slide={{ duration: 300 }}>
											<div class="prose mt-6 max-w-none text-lg dark:prose-invert">
												<ul class="list-disc space-y-4 marker:text-primary-400">
													{#each exp.detail as detail}
														<li>{@html detail}</li>
													{/each}
												</ul>
											</div>
										</div>
									{/if}
								</div>
							</div>
						</div>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</section>
