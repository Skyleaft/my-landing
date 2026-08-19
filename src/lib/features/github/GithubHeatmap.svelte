<script lang="ts">
	import type { GitHubContributionDay } from '$lib/types/github';

	interface Props {
		contributions: GitHubContributionDay[];
		totalLastYear?: number;
	}

	let { contributions = [], totalLastYear = 0 }: Props = $props();

	let containerEl = $state<HTMLElement | null>(null);

	let hoveredDay = $state<{
		date: string;
		count: number;
		x: number;
		y: number;
		visible: boolean;
	}>({
		date: '',
		count: 0,
		x: 0,
		y: 0,
		visible: false
	});

	interface WeekColumn {
		days: (GitHubContributionDay | null)[];
		monthLabel?: string;
	}

	const monthNames = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec'
	];
	const dayNames = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

	// Group contribution days into 52+ weekly columns of 7 days (Sun=0 to Sat=6)
	let weeks = $derived.by(() => {
		if (!contributions || contributions.length === 0) return [];

		const sorted = [...contributions].sort(
			(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
		);

		const result: WeekColumn[] = [];
		let currentWeek: (GitHubContributionDay | null)[] = [];

		// Handle first week padding (if first day is not Sunday)
		const firstDate = new Date(sorted[0].date);
		const firstDayOfWeek = firstDate.getDay(); // 0 is Sunday

		for (let i = 0; i < firstDayOfWeek; i++) {
			currentWeek.push(null);
		}

		let lastMonth = -1;

		for (const day of sorted) {
			currentWeek.push(day);

			if (currentWeek.length === 7) {
				// Find if a new month starts within this week column
				let monthLabel: string | undefined = undefined;
				for (const d of currentWeek) {
					if (d) {
						const colDate = new Date(d.date);
						const colMonth = colDate.getMonth();
						if (colMonth !== lastMonth && colDate.getDate() <= 7) {
							monthLabel = monthNames[colMonth];
							lastMonth = colMonth;
							break;
						}
					}
				}

				result.push({ days: currentWeek, monthLabel });
				currentWeek = [];
			}
		}

		if (currentWeek.length > 0) {
			while (currentWeek.length < 7) {
				currentWeek.push(null);
			}
			result.push({ days: currentWeek });
		}

		return result;
	});

	function formatDate(dateStr: string) {
		if (!dateStr) return '';
		const d = new Date(dateStr);
		return d.toLocaleDateString('en-US', {
			weekday: 'short',
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	function handleMouseEnter(day: GitHubContributionDay | null, event: MouseEvent) {
		if (!day || !containerEl) return;
		const target = event.currentTarget as HTMLElement;
		const targetRect = target.getBoundingClientRect();
		const containerRect = containerEl.getBoundingClientRect();

		hoveredDay = {
			date: day.date,
			count: day.count,
			x: targetRect.left - containerRect.left + targetRect.width / 2,
			y: targetRect.top - containerRect.top - 8,
			visible: true
		};
	}

	function handleMouseLeave() {
		hoveredDay.visible = false;
	}

	function getLevelClass(level: number): string {
		switch (level) {
			case 1:
				return 'bg-[#4a6b83]/60 dark:bg-[#344958] border-[#5b84a0]/40 hover:bg-[#5b84a0] dark:hover:bg-[#4a6b83]';
			case 2:
				return 'bg-[#5b84a0] dark:bg-[#4a6b83] border-[#759eb8]/60 hover:bg-[#759eb8] shadow-[0_0_8px_rgba(91,132,160,0.35)]';
			case 3:
				return 'bg-[#759eb8] border-[#a6c0cf]/70 hover:bg-[#a6c0cf] shadow-[0_0_12px_rgba(117,158,184,0.55)]';
			case 4:
				return 'bg-[#a6c0cf] text-slate-900 border-white/80 hover:bg-white shadow-[0_0_16px_rgba(166,192,207,0.75)]';
			case 0:
			default:
				return 'bg-slate-200/70 dark:bg-slate-800/50 border-slate-300/40 dark:border-slate-700/40 hover:border-primary-400/50';
		}
	}
</script>

<div bind:this={containerEl} class="relative w-full">
	<!-- Scrollable Heatmap Canvas -->
	<div
		class="scrollbar-thin scrollbar-thumb-primary-400/30 scrollbar-track-transparent relative overflow-x-auto pt-2 pb-3"
		onscroll={handleMouseLeave}
	>
		<div class="inline-flex min-w-[790px] flex-col p-2">
			<!-- Month Header Row -->
			<div
				class="mb-2 flex h-4 items-center text-xs font-semibold text-[var(--foreground)]/60 select-none"
			>
				<!-- Left Spacer for Day Labels Alignment -->
				<div class="w-[36px] shrink-0"></div>

				<!-- Month Labels per Week Column -->
				<div class="flex gap-[3px]">
					{#each weeks as week}
						<div class="w-[14px] shrink-0 text-left text-[10px]">
							{#if week.monthLabel}
								<span class="font-medium whitespace-nowrap text-primary-400">{week.monthLabel}</span
								>
							{/if}
						</div>
					{/each}
				</div>
			</div>

			<!-- Grid: Day Labels + Week Columns -->
			<div class="flex items-start">
				<!-- Day of week labels -->
				<div
					class="flex w-[36px] shrink-0 flex-col gap-[3px] text-[10px] font-medium text-[var(--foreground)]/50 select-none"
				>
					{#each dayNames as dayName}
						<span class="h-[14px] leading-[14px]">{dayName}</span>
					{/each}
				</div>

				<!-- Weeks Columns -->
				<div class="flex gap-[3px]">
					{#each weeks as week}
						<div class="flex shrink-0 flex-col gap-[3px]">
							{#each week.days as day}
								{#if day}
									<button
										type="button"
										aria-label="{day.count} contributions on {day.date}"
										class="h-[14px] w-[14px] shrink-0 cursor-pointer rounded-[3px] border transition-all duration-150 {getLevelClass(
											day.level
										)}"
										onmouseenter={(e) => handleMouseEnter(day, e)}
										onmouseleave={handleMouseLeave}
									></button>
								{:else}
									<div class="pointer-events-none h-[14px] w-[14px] shrink-0 opacity-0"></div>
								{/if}
							{/each}
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>

	<!-- Relative Floating Tooltip -->
	{#if hoveredDay.visible}
		<div
			class="glass pointer-events-none absolute z-50 -translate-x-1/2 -translate-y-full rounded-xl border border-primary-400/60 px-3.5 py-2 text-xs font-semibold whitespace-nowrap text-[var(--foreground)] shadow-2xl backdrop-blur-xl transition-all duration-75"
			style="left: {hoveredDay.x}px; top: {hoveredDay.y}px;"
		>
			<div class="text-center">
				<span class="font-bold text-primary-400">
					{hoveredDay.count === 0 ? 'No' : hoveredDay.count}
					{hoveredDay.count === 1 ? 'contribution' : 'contributions'}
				</span>
				<div class="mt-0.5 text-[10px] font-normal text-[var(--foreground)]/70">
					{formatDate(hoveredDay.date)}
				</div>
			</div>
			<!-- Pointer triangle -->
			<div
				class="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-r border-b border-primary-400/60 bg-[rgba(var(--glass-bg),0.85)]"
			></div>
		</div>
	{/if}

	<!-- Legend & Info Bar -->
	<div
		class="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--card-border)]/40 pt-4 text-xs text-[var(--foreground)]/70"
	>
		<div class="flex items-center gap-2">
			<span class="inline-block h-2 w-2 animate-pulse rounded-full bg-green-500"></span>
			<span>Live Activity Data</span>
		</div>

		<div class="flex items-center gap-2">
			<span class="text-[11px]">Less</span>
			<div class="flex items-center gap-1">
				<span
					class="h-[11px] w-[11px] rounded-[2px] border border-slate-300/40 bg-slate-200/70 dark:border-slate-700/40 dark:bg-slate-800/50"
				></span>
				<span class="h-[11px] w-[11px] rounded-[2px] bg-[#4a6b83]/60 dark:bg-[#344958]"></span>
				<span class="h-[11px] w-[11px] rounded-[2px] bg-[#5b84a0] dark:bg-[#4a6b83]"></span>
				<span class="h-[11px] w-[11px] rounded-[2px] bg-[#759eb8]"></span>
				<span class="h-[11px] w-[11px] rounded-[2px] bg-[#a6c0cf]"></span>
			</div>
			<span class="text-[11px]">More</span>
		</div>
	</div>
</div>
