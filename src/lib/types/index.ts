export interface Project {
	id: string;
	title: string;
	description: string;
	technologies: string[];
	url?: string;
}

export interface Experience {
	id: string;
	title: string;
	company: string;
	period: string;
	description: string;
	technologies: string[];
}

export * from './homelab.js';
export * from './gameserver.js';