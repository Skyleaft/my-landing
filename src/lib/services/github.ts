import type {
	GitHubActivityData,
	GitHubContributionsData,
	GitHubContributionDay,
	GitHubUser,
	GitHubEvent,
	GitHubRepo,
	GitHubStats
} from '$lib/types/github';

const GITHUB_USERNAME = 'Skyleaft';

function calculateGitHubStats(contributions: GitHubContributionDay[]): GitHubStats {
	if (!contributions || contributions.length === 0) {
		return {
			totalContributions: 0,
			currentStreak: 0,
			longestStreak: 0,
			activeDays: 0,
			mostActiveDay: null
		};
	}

	let totalContributions = 0;
	let activeDays = 0;
	let currentStreak = 0;
	let longestStreak = 0;
	let tempStreak = 0;
	let mostActiveDay: { date: string; count: number } | null = null;

	// Sort chronologically just in case
	const sorted = [...contributions].sort(
		(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
	);

	for (const day of sorted) {
		totalContributions += day.count;

		if (day.count > 0) {
			activeDays++;
			tempStreak++;
			if (tempStreak > longestStreak) {
				longestStreak = tempStreak;
			}
			if (!mostActiveDay || day.count > mostActiveDay.count) {
				mostActiveDay = { date: day.date, count: day.count };
			}
		} else {
			tempStreak = 0;
		}
	}

	// Calculate current streak starting from latest date
	// If today has 0 commits, check if yesterday was part of an active streak
	for (let i = sorted.length - 1; i >= 0; i--) {
		const day = sorted[i];
		if (i === sorted.length - 1 && day.count === 0) {
			// Today has no commits yet, don't break streak immediately if yesterday had commits
			continue;
		}
		if (day.count > 0) {
			currentStreak++;
		} else {
			break;
		}
	}

	return {
		totalContributions,
		currentStreak,
		longestStreak,
		activeDays,
		mostActiveDay
	};
}

export async function fetchGitHubActivity(username: string = GITHUB_USERNAME): Promise<GitHubActivityData> {
	const headers: Record<string, string> = {
		'User-Agent': 'SvelteKit-LandingPage'
	};

	const [userRes, contribRes, eventsRes, reposRes] = await Promise.allSettled([
		fetch(`https://api.github.com/users/${username}`, { headers }),
		fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`),
		fetch(`https://api.github.com/users/${username}/events?per_page=12`, { headers }),
		fetch(`https://api.github.com/users/${username}/repos?sort=pushed&per_page=6`, { headers })
	]);

	let user: GitHubUser | null = null;
	if (userRes.status === 'fulfilled' && userRes.value.ok) {
		user = await userRes.value.json();
	}

	let contributions: GitHubContributionsData | null = null;
	if (contribRes.status === 'fulfilled' && contribRes.value.ok) {
		contributions = await contribRes.value.json();
	}

	let recentEvents: GitHubEvent[] = [];
	if (eventsRes.status === 'fulfilled' && eventsRes.value.ok) {
		const rawEvents: GitHubEvent[] = await eventsRes.value.json();
		// Filter relevant contribution events (Push, PullRequest, Create, Issues)
		recentEvents = Array.isArray(rawEvents)
			? rawEvents.filter((e) =>
					['PushEvent', 'PullRequestEvent', 'CreateEvent', 'IssuesEvent', 'WatchEvent', 'ForkEvent'].includes(
						e.type
					)
				)
			: [];
	}

	let topRepos: GitHubRepo[] = [];
	if (reposRes.status === 'fulfilled' && reposRes.value.ok) {
		const rawRepos: GitHubRepo[] = await reposRes.value.json();
		if (Array.isArray(rawRepos)) {
			topRepos = rawRepos.filter((r) => !r.name.includes('.github'));
		}
	}

	const stats = calculateGitHubStats(contributions?.contributions || []);

	return {
		user,
		contributions,
		stats,
		recentEvents,
		topRepos
	};
}
