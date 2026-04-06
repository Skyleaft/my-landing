<script lang="ts">
	import type { Project } from '$lib/types';
	import { fly } from 'svelte/transition';
	import { extractDominantColor } from '../../utils/color';

	let { delay = 0, project }: { delay?: number; project: Project } = $props();

	let dominantColor = $state('#9ACFEEAE');
	let dominantColorRGBA = $derived(
		dominantColor.startsWith('rgb')
			? dominantColor.replace('rgb(', 'rgba(').replace(')', ', 0.4)')
			: dominantColor
	);

	// $effect(() => {
	// 	if (project.image) {
	// 		extractDominantColor(project.image).then(color => {
	// 			dominantColor = color;
	// 		});
	// 	}
	// });

	let cardElement: HTMLElement;
</script>

<div
	class="group relative flex flex-col overflow-hidden rounded-xl bg-clip-border p-2 text-gray-700"
	style="--overlay-color: {dominantColorRGBA};"
	bind:this={cardElement}
	in:fly={{ x: -50, duration: 600, delay }}
>
	<!-- background layer -->
	<div
		class="pointer-events-none absolute inset-0 z-1 scale-90 rounded-xl backdrop-blur-[2px] transition-all duration-300 group-hover:scale-102 group-hover:bg-[var(--overlay-color)] group-hover:shadow-xl"
	></div>

	<div class="relative z-10">
		<div class="h-48 bg-linear-to-br from-primary-500 to-secondary-500"></div>
		<div class="p-6">
			<a href={project.url || '#'} class="mb-2 h4 hover:text-primary-500">{project.title}</a>
			<p class="mb-4 text-surface-600">{project.description}</p>
			<div class="mb-4 flex flex-wrap gap-2">
				{#each project.technologies as tech}
					<button type="button" class="chip preset-tonal-primary">{tech}</button>
				{/each}
			</div>
		</div>
	</div>
</div>
