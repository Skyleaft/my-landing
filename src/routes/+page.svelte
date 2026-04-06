<script lang="ts">
	import type { PageData } from './$types';
	import ProfileSection from '$lib/features/profile/ProfileSection.svelte';
	import ExperienceSection from '$lib/features/experience/ExperienceSection.svelte';
	import SkillsSection from '$lib/features/skills/SkillsSection.svelte';
	import HomeLabSection from '$lib/features/homelab/HomeLabSection.svelte';

	let { data }: { data: PageData } = $props();
</script>

<div class="space-y-12">
	<ProfileSection data={data.profile} />

	<div
		class="glass-card mx-6 rounded-none border-x-0 border-t border-[var(--card-border)]/50"
	></div>

	<ExperienceSection experiences={data.experiences} />

	<div
		class="glass-card mx-6 rounded-none border-x-0 border-t border-[var(--card-border)]/50"
	></div>

	<SkillsSection skills={data.skills} />

	<div
		class="glass-card mx-6 rounded-none border-x-0 border-t border-[var(--card-border)]/50"
	></div>

	<HomeLabSection homelab={data.homelab} />
</div>
