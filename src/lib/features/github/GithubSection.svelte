<script lang="ts">
	import type { GitHubActivityData, GitHubEvent } from '$lib/types/github';
	import GithubHeatmap from './GithubHeatmap.svelte';
	import { inView } from '$lib/actions/inView';

	interface Props {
		data: GitHubActivityData | null;
	}

	let { data = null }: Props = $props();

	function getLanguageColor(language: string | null): string {
		if (!language) return '#759eb8';
		const colors: Record<string, string> = {
			'C#': '#178600',
			Dart: '#00B4AB',
			Svelte: '#FF3E00',
			TypeScript: '#3178C6',
			JavaScript: '#F7DF1E',
			Python: '#3572A5',
			Smarty: '#F0C040',
			HTML: '#E34F26',
			CSS: '#563D7C',
			Go: '#00ADD8',
			Rust: '#DEA584'
		};
		return colors[language] || '#759eb8';
	}

	function formatRelativeTime(dateStr: string): string {
		try {
			const date = new Date(dateStr);
			const now = new Date();
			const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

			if (diffInSeconds < 60) return 'just now';
			const diffInMinutes = Math.floor(diffInSeconds / 60);
			if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
			const diffInHours = Math.floor(diffInMinutes / 60);
			if (diffInHours < 24) return `${diffInHours}h ago`;
			const diffInDays = Math.floor(diffInHours / 24);
			if (diffInDays < 30) return `${diffInDays}d ago`;
			const diffInMonths = Math.floor(diffInDays / 30);
			return `${diffInMonths}mo ago`;
		} catch {
			return '';
		}
	}

	function getEventDescription(event: GitHubEvent): {
		title: string;
		detail?: string;
		badge: string;
		color: string;
	} {
		switch (event.type) {
			case 'PushEvent': {
				const count = event.payload.commits?.length || 1;
				const branch = event.payload.ref?.replace('refs/heads/', '') || 'main';
				const msg = event.payload.commits?.[0]?.message?.split('\n')[0] || `Pushed to ${branch}`;
				return {
					title: `Pushed ${count} ${count === 1 ? 'commit' : 'commits'} (${branch}) to`,
					detail: msg,
					badge: 'Push',
					color: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30'
				};
			}
			case 'PullRequestEvent': {
				const action = event.payload.action || 'opened';
				const isMerged = event.payload.pull_request?.merged || action === 'merged';
				const prNum = event.payload.pull_request
					? `#${event.payload.pull_request.title ? event.payload.action : ''}`
					: '';
				return {
					title: `${isMerged ? 'Merged' : action === 'opened' ? 'Opened' : action} pull request in`,
					detail: event.payload.pull_request?.title || `PR ${action}`,
					badge: isMerged ? 'PR Merged' : 'PR Opened',
					color: isMerged
						? 'text-purple-400 bg-purple-400/10 border-purple-400/30'
						: 'text-green-400 bg-green-400/10 border-green-400/30'
				};
			}
			case 'CreateEvent': {
				const refType = event.payload.ref_type || 'branch';
				const ref = event.payload.ref ? `"${event.payload.ref}"` : '';
				return {
					title: `Created ${refType} ${ref} in`,
					detail:
						event.payload.ref_type === 'repository' ? 'New repository initialized' : undefined,
					badge: `New ${refType}`,
					color: 'text-amber-400 bg-amber-400/10 border-amber-400/30'
				};
			}
			case 'WatchEvent':
				return {
					title: 'Starred repository',
					badge: 'Starred',
					color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30'
				};
			case 'ForkEvent':
				return {
					title: 'Forked repository',
					badge: 'Fork',
					color: 'text-blue-400 bg-blue-400/10 border-blue-400/30'
				};
			default:
				return {
					title: `Activity in`,
					badge: event.type.replace('Event', ''),
					color: 'text-primary-400 bg-primary-400/10 border-primary-400/30'
				};
		}
	}
</script>

<section id="activity" class="section-blur container mx-auto px-6 py-20">
	<!-- Section Header -->
	<div class="mb-12 flex flex-col items-center text-center">
		<div
			class="reveal reveal-up stagger-1 mb-3 inline-flex items-center gap-2 rounded-full border border-primary-400/30 bg-primary-500/10 px-4 py-1.5 text-sm font-semibold text-primary-400 backdrop-blur-md"
			use:inView
		>
			<!-- GitHub SVG Icon -->
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path
					d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"
				/>
				<path d="M9 18c-4.51 2-5-2-7-2" />
			</svg>
			<span>Open Source & Engineering</span>
		</div>

		<h2 class="reveal reveal-up stagger-2 mb-4 text-4xl font-bold md:text-5xl" use:inView>
			GitHub Contribution Activity
		</h2>
		<div
			class="reveal reveal-scale stagger-3 mb-4 h-1.5 w-20 rounded-full bg-primary-400"
			use:inView
		></div>

		<p class="reveal reveal-up stagger-3 max-w-2xl text-lg text-[var(--foreground)]/70" use:inView>
			Continuous contributions, code commits, and open-source projects by
			<a
				href="https://github.com/Skyleaft"
				target="_blank"
				rel="noopener noreferrer"
				class="font-semibold text-primary-400 transition-colors hover:text-primary-300 hover:underline"
			>
				@Skyleaft
			</a>
		</p>
	</div>

	{#if data}
		<!-- Stats Overview Grid -->
		<div class="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
			<!-- Total Contributions -->
			<div
				class="glass-card reveal reveal-up stagger-1 group relative overflow-hidden p-6"
				use:inView
			>
				<div class="mb-3 flex items-center justify-between">
					<span class="text-xs font-bold tracking-wider text-primary-500 uppercase"
						>Year Contributions</span
					>
					<div
						class="glass rounded-xl p-2 text-primary-400 transition-transform group-hover:scale-110"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
						</svg>
					</div>
				</div>
				<div class="text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
					{data.stats.totalContributions}+
				</div>
				<div class="mt-1 text-xs text-[var(--foreground)]/60">Across all public repositories</div>
			</div>

			<!-- Current Streak -->
			<div
				class="glass-card reveal reveal-up stagger-2 group relative overflow-hidden p-6"
				use:inView
			>
				<div class="mb-3 flex items-center justify-between">
					<span class="text-xs font-bold tracking-wider text-primary-500 uppercase"
						>Current Streak</span
					>
					<div
						class="glass rounded-xl p-2 text-amber-400 transition-transform group-hover:scale-110"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path
								d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
							/>
						</svg>
					</div>
				</div>
				<div class="text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
					{data.stats.currentStreak}
					<span class="text-lg font-semibold text-primary-400">days</span>
				</div>
				<div class="mt-1 text-xs text-[var(--foreground)]/60">Active daily streak</div>
			</div>

			<!-- Longest Streak -->
			<div
				class="glass-card reveal reveal-up stagger-3 group relative overflow-hidden p-6"
				use:inView
			>
				<div class="mb-3 flex items-center justify-between">
					<span class="text-xs font-bold tracking-wider text-primary-500 uppercase"
						>Longest Streak</span
					>
					<div
						class="glass rounded-xl p-2 text-purple-400 transition-transform group-hover:scale-110"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
							<path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
							<path d="M4 22h16" />
							<path d="M10 14.66V17c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-2.34" />
							<path d="M14 14.66V17c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-2.34" />
							<path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
						</svg>
					</div>
				</div>
				<div class="text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
					{data.stats.longestStreak} <span class="text-lg font-semibold text-purple-400">days</span>
				</div>
				<div class="mt-1 text-xs text-[var(--foreground)]/60">Continuous contribution record</div>
			</div>

			<!-- Public Repositories -->
			<div
				class="glass-card reveal reveal-up stagger-4 group relative overflow-hidden p-6"
				use:inView
			>
				<div class="mb-3 flex items-center justify-between">
					<span class="text-xs font-bold tracking-wider text-primary-500 uppercase"
						>Repositories</span
					>
					<div
						class="glass rounded-xl p-2 text-green-400 transition-transform group-hover:scale-110"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
							<path d="M6 6h10" />
							<path d="M6 10h10" />
						</svg>
					</div>
				</div>
				<div class="text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
					{data.user?.public_repos ?? 66}
					<span class="text-lg font-semibold text-green-400">repos</span>
				</div>
				<div class="mt-1 text-xs text-[var(--foreground)]/60">
					{data.user?.followers ?? 9} followers · {data.user?.following ?? 10} following
				</div>
			</div>
		</div>

		<!-- Contribution Heatmap Card -->
		<div class="glass-card reveal reveal-up stagger-3 mb-10 p-6 md:p-8" use:inView>
			<div class="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
				<div>
					<h3 class="flex items-center gap-2 text-xl font-bold text-[var(--foreground)]">
						<span>Contributions Calendar</span>
						<span
							class="rounded-full border border-primary-400/30 bg-primary-400/10 px-2.5 py-0.5 text-xs font-semibold text-primary-400"
						>
							Past 12 Months
						</span>
					</h3>
					<p class="mt-1 text-xs text-[var(--foreground)]/60">
						Total of <strong class="font-semibold text-primary-400"
							>{data.stats.totalContributions} contributions</strong
						>
						spanning across {data.stats.activeDays} active days.
					</p>
				</div>

				<a
					href="https://github.com/Skyleaft"
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-2 self-start text-xs font-bold text-primary-400 transition-colors hover:text-primary-300 sm:self-auto"
				>
					<span>View on GitHub</span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M7 17 17 7" />
						<path d="M7 7h10v10" />
					</svg>
				</a>
			</div>

			<GithubHeatmap
				contributions={data.contributions?.contributions || []}
				totalLastYear={data.stats.totalContributions}
			/>
		</div>

		<!-- Recent Events & Top Repositories Grid -->
		<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
			<!-- Recent Activity Timeline -->
			<div class="glass-card reveal reveal-up stagger-4 flex flex-col p-6 md:p-8" use:inView>
				<div class="mb-6 flex items-center justify-between">
					<h3 class="flex items-center gap-2 text-xl font-bold text-[var(--foreground)]">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="text-primary-400"
						>
							<circle cx="12" cy="12" r="10" />
							<polyline points="12 6 12 12 16 14" />
						</svg>
						<span>Recent GitHub Activity</span>
					</h3>
					<span class="text-xs font-medium text-[var(--foreground)]/60">Live Feed</span>
				</div>

				{#if data.recentEvents && data.recentEvents.length > 0}
					<div class="flex-1 space-y-4">
						{#each data.recentEvents.slice(0, 5) as event}
							{@const info = getEventDescription(event)}
							<div
								class="glass rounded-xl border border-[var(--card-border)]/40 p-4 transition-all hover:border-primary-400/40"
							>
								<div class="flex items-start justify-between gap-3">
									<div class="space-y-1">
										<div class="flex flex-wrap items-center gap-2">
											<span class="rounded-md border px-2 py-0.5 text-xs font-bold {info.color}">
												{info.badge}
											</span>
											<span class="text-xs text-[var(--foreground)]/70">
												{info.title}
											</span>
											<a
												href="https://github.com/{event.repo.name}"
												target="_blank"
												rel="noopener noreferrer"
												class="text-xs font-bold text-primary-400 hover:text-primary-300 hover:underline"
											>
												{event.repo.name.replace('Skyleaft/', '')}
											</a>
										</div>

										{#if info.detail}
											<p
												class="line-clamp-2 pt-1 pl-1 font-mono text-xs text-[var(--foreground)]/80 italic"
											>
												"{info.detail}"
											</p>
										{/if}
									</div>

									<span class="pl-2 text-[11px] whitespace-nowrap text-[var(--foreground)]/50">
										{formatRelativeTime(event.created_at)}
									</span>
								</div>
							</div>
						{/each}
					</div>
				{:else}
					<div class="glass rounded-xl p-8 text-center text-sm text-[var(--foreground)]/60">
						No recent public events recorded
					</div>
				{/if}
			</div>

			<!-- Featured Repositories -->
			<div class="glass-card reveal reveal-up stagger-5 flex flex-col p-6 md:p-8" use:inView>
				<div class="mb-6 flex items-center justify-between">
					<h3 class="flex items-center gap-2 text-xl font-bold text-[var(--foreground)]">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="text-primary-400"
						>
							<polygon
								points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
							/>
						</svg>
						<span>Active Repositories</span>
					</h3>
					<a
						href="https://github.com/Skyleaft?tab=repositories"
						target="_blank"
						rel="noopener noreferrer"
						class="text-xs font-bold text-primary-400 hover:underline"
					>
						View All
					</a>
				</div>

				{#if data.topRepos && data.topRepos.length > 0}
					<div class="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
						{#each data.topRepos.slice(0, 4) as repo}
							<a
								href={repo.html_url}
								target="_blank"
								rel="noopener noreferrer"
								class="glass group flex flex-col justify-between rounded-xl border border-[var(--card-border)]/40 p-4 transition-all hover:-translate-y-1 hover:border-primary-400/60 hover:shadow-lg"
							>
								<div>
									<div class="mb-2 flex items-center justify-between gap-2">
										<h4
											class="truncate text-sm font-bold text-[var(--foreground)] transition-colors group-hover:text-primary-400"
										>
											{repo.name}
										</h4>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="14"
											height="14"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
											class="flex-shrink-0 text-primary-400/60 transition-colors group-hover:text-primary-400"
										>
											<path d="M7 17 17 7" />
											<path d="M7 7h10v10" />
										</svg>
									</div>

									<p class="mb-4 line-clamp-2 text-xs leading-relaxed text-[var(--foreground)]/70">
										{repo.description || 'Open-source project on GitHub'}
									</p>
								</div>

								<div
									class="flex items-center justify-between border-t border-[var(--card-border)]/30 pt-2 text-[11px] text-[var(--foreground)]/60"
								>
									{#if repo.language}
										<div class="flex items-center gap-1.5">
											<span
												class="h-2.5 w-2.5 rounded-full"
												style="background-color: {getLanguageColor(repo.language)}"
											></span>
											<span>{repo.language}</span>
										</div>
									{/if}

									<div class="ml-auto flex items-center gap-3">
										{#if repo.stargazers_count > 0}
											<span class="flex items-center gap-1">
												⭐ {repo.stargazers_count}
											</span>
										{/if}
										{#if repo.forks_count > 0}
											<span class="flex items-center gap-1">
												🍴 {repo.forks_count}
											</span>
										{/if}
									</div>
								</div>
							</a>
						{/each}
					</div>
				{:else}
					<div class="glass rounded-xl p-8 text-center text-sm text-[var(--foreground)]/60">
						No repositories found
					</div>
				{/if}
			</div>
		</div>
	{:else}
		<!-- Loading / Skeleton Placeholder -->
		<div class="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
			{#each Array(4) as _}
				<div class="glass-card animate-pulse space-y-3 p-6">
					<div class="h-4 w-24 rounded bg-primary-400/20"></div>
					<div class="h-8 w-16 rounded bg-primary-400/20"></div>
					<div class="h-3 w-32 rounded bg-primary-400/20"></div>
				</div>
			{/each}
		</div>
		<div class="glass-card mb-10 animate-pulse space-y-4 p-8">
			<div class="h-6 w-48 rounded bg-primary-400/20"></div>
			<div class="h-32 rounded-xl bg-primary-400/20"></div>
		</div>
	{/if}

	<!-- CTA Footer Button -->
	<div class="reveal reveal-up stagger-6 mt-12 flex justify-center" use:inView>
		<a
			href="https://github.com/Skyleaft"
			target="_blank"
			rel="noopener noreferrer"
			class="glass group flex items-center gap-3 rounded-2xl border border-primary-400/40 px-8 py-3.5 font-bold text-primary-400 shadow-xl transition-all hover:border-primary-500 hover:bg-primary-500 hover:text-white hover:shadow-primary-500/25"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2.2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="transition-transform group-hover:scale-125"
			>
				<path
					d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"
				/>
				<path d="M9 18c-4.51 2-5-2-7-2" />
			</svg>
			<span>Explore @Skyleaft on GitHub</span>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2.5"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="transition-transform group-hover:translate-x-1"
			>
				<path d="M5 12h14" />
				<path d="m12 5 7 7-7 7" />
			</svg>
		</a>
	</div>
</section>
