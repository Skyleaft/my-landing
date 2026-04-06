import { api } from '$lib/services/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		const [profileRes, experienceRes, skillsRes, homelabRes] = await Promise.all([
			api.getProfile(),
			api.getExperience(),
			api.getTechnicalSkills(),
			api.getHomeLab()
		]);

		return {
			profile: profileRes.data[0],
			experiences: experienceRes.data,
			skills: skillsRes.data[0],
			homelab: homelabRes.data
		};
	} catch (error) {
		console.error('Failed to load landing page data:', error);
		return {
			profile: null,
			experiences: [],
			skills: null,
			homelab: []
		};
	}
};
