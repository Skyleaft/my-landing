import { api } from '$lib/services/api';
import { fetchGitHubActivity } from '$lib/services/github';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		const [profileRes, experienceRes, skillsRes, homelabRes, githubData] = await Promise.all([
			api.getProfile().catch((err) => {
				console.error('Failed to load profile data:', err);
				return { data: [null] };
			}),
			api.getExperience().catch((err) => {
				console.error('Failed to load experience data:', err);
				return { data: [] };
			}),
			api.getTechnicalSkills().catch((err) => {
				console.error('Failed to load technical skills data:', err);
				return { data: [null] };
			}),
			api.getHomeLab().catch((err) => {
				console.error('Failed to load homelab data:', err);
				return { data: [] };
			}),
			fetchGitHubActivity('Skyleaft').catch((err) => {
				console.error('Failed to load GitHub activity data:', err);
				return null;
			})
		]);

		return {
			profile: profileRes.data[0] || null,
			experiences: experienceRes.data || [],
			skills: skillsRes.data[0] || null,
			homelab: homelabRes.data || [],
			github: githubData
		};
	} catch (error) {
		console.error('Failed to load landing page data:', error);
		return {
			profile: null,
			experiences: [],
			skills: null,
			homelab: [],
			github: null
		};
	}
};
