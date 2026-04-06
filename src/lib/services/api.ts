import { env } from '$env/dynamic/public';
import type { APIResponse, Profile, Experience, TechnicalSkill, HomeLab } from '$lib/types/api';

export const getBaseUrl = () => env.PUBLIC_BASE_URL || 'http://11.1.1.4:3030';
const getApiUrl = () => `${getBaseUrl()}/api/v1/content`;

export const api = {
	async getProfile(): Promise<APIResponse<Profile>> {
		const res = await fetch(`${getApiUrl()}/landing-profile`);
		if (!res.ok) throw new Error('Failed to fetch profile');
		return res.json();
	},

	async getExperience(): Promise<APIResponse<Experience>> {
		const res = await fetch(`${getApiUrl()}/landing-pro-experience?sort=-since_date&page=1&limit=20`);
		if (!res.ok) throw new Error('Failed to fetch experience');
		return res.json();
	},

	async getTechnicalSkills(): Promise<APIResponse<TechnicalSkill>> {
		const res = await fetch(`${getApiUrl()}/landing-technical-skill`);
		if (!res.ok) throw new Error('Failed to fetch technical skills');
		return res.json();
	},

	async getHomeLab(): Promise<APIResponse<HomeLab>> {
		const res = await fetch(`${getApiUrl()}/landing-myhomelab`);
		if (!res.ok) throw new Error('Failed to fetch homelab');
		return res.json();
	}
};
