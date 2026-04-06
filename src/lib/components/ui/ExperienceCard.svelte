<script lang="ts">
	import type { Experience } from '$lib/types';
	
	let { experience }: { experience: Experience } = $props();
</script>

<div class="card p-6">
	<div class="flex justify-between items-start mb-4">
		<div>
			<h4 class="h4">{experience.title}</h4>
			<p class="text-primary-500 font-semibold">{experience.company}</p>
		</div>
		<span class="badge variant-filled-surface">{experience.period}</span>
	</div>
	<p class="text-surface-600 mb-3">{experience.description}</p>
	<div class="flex flex-wrap gap-2">
		{#each experience.technologies as tech}
			<span class="badge variant-soft">{tech}</span>
		{/each}
	</div>
</div>