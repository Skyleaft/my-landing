<script lang="ts">
	import type { GameServer } from '$lib/types/gameserver';
	
	let { server }: { server: GameServer } = $props();
	
	const statusColors = {
		online: 'preset-tonal-success',
		offline: 'preset-tonal-error',
		maintenance: 'preset-tonal-warning'
	};
</script>

<div class="card p-6 hover:scale-105 transition-transform">
	<div class="flex items-center justify-between mb-4">
		<div class="flex items-center gap-3">
			<div class="text-3xl">🎮</div>
			<div>
				<h4 class="h4">{server.name}</h4>
				<p class="text-sm text-surface-500">{server.game}</p>
			</div>
		</div>
		<span class="badge {statusColors[server.status]} capitalize">{server.status}</span>
	</div>
	
	<div class="space-y-3">
		<div class="flex justify-between">
			<span class="text-surface-600">Hostname:</span>
			<code class="text-primary-500">{server.hostname}</code>
		</div>
		<div class="flex justify-between">
			<span class="text-surface-600">Port:</span>
			<code class="text-primary-500">{server.port}</code>
		</div>
		<div class="flex justify-between">
			<span class="text-surface-600">Players:</span>
			<span class="badge variant-soft">{server.players.current}/{server.players.max}</span>
		</div>
		{#if server.version}
			<div class="flex justify-between">
				<span class="text-surface-600">Version:</span>
				<span class="text-surface-400">{server.version}</span>
			</div>
		{/if}
	</div>
	
	{#if server.description}
		<p class="text-surface-600 mt-4 text-sm">{server.description}</p>
	{/if}
</div>