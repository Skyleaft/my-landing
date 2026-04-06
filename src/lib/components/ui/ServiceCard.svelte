<script lang="ts">
	import type { HomelabService } from '$lib/types/homelab';
	
	let { service }: { service: HomelabService } = $props();
	
	const statusColors = {
		online: 'preset-tonal-success',
		offline: 'preset-tonal-error',
		maintenance: 'preset-tonal-warning'
	};
</script>

<div class="card p-6 hover:scale-105 transition-transform">
	<div class="flex items-center justify-between mb-4">
		<div class="flex items-center gap-3">
			<div class="text-2xl">{service.icon}</div>
			<h4 class="h4">{service.name}</h4>
		</div>
		<span class="badge {statusColors[service.status]} capitalize">{service.status}</span>
	</div>
	<p class="text-surface-600 mb-4">{service.description}</p>
	{#if service.url}
		<a href={service.url} target="_blank" class="btn btn-sm variant-ghost-primary">Access Service</a>
	{/if}
</div>