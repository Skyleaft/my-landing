export interface GitHubContributionDay {
	date: string;
	count: number;
	level: 0 | 1 | 2 | 3 | 4;
}

export interface GitHubContributionsData {
	total: {
		[year: string]: number;
		lastYear: number;
	};
	contributions: GitHubContributionDay[];
}

export interface GitHubUser {
	login: string;
	name: string | null;
	avatar_url: string;
	html_url: string;
	bio: string | null;
	location: string | null;
	blog: string | null;
	public_repos: number;
	followers: number;
	following: number;
	created_at: string;
}

export interface GitHubEventPayload {
	action?: string;
	ref?: string;
	ref_type?: string;
	head?: string;
	commits?: Array<{ message: string; sha: string }>;
	pull_request?: {
		title: string;
		html_url: string;
		merged?: boolean;
		state?: string;
	};
	issue?: {
		title: string;
		html_url: string;
	};
}

export interface GitHubEvent {
	id: string;
	type: string;
	repo: {
		name: string;
		url: string;
	};
	payload: GitHubEventPayload;
	created_at: string;
}

export interface GitHubRepo {
	id: number;
	name: string;
	full_name: string;
	html_url: string;
	description: string | null;
	language: string | null;
	stargazers_count: number;
	forks_count: number;
	pushed_at: string;
	topics?: string[];
	homepage?: string | null;
}

export interface GitHubStats {
	totalContributions: number;
	currentStreak: number;
	longestStreak: number;
	activeDays: number;
	mostActiveDay: {
		date: string;
		count: number;
	} | null;
}

export interface GitHubActivityData {
	user: GitHubUser | null;
	contributions: GitHubContributionsData | null;
	stats: GitHubStats;
	recentEvents: GitHubEvent[];
	topRepos: GitHubRepo[];
}
