export interface APIResponse<T> {
	data: T[];
	total: number;
	page: number;
	limit: number;
}

export interface Profile {
	_id: string;
	about: string;
	contact: {
		email: string;
		github: string;
		linkedin: string;
		phone: string;
	}[];
	location: string;
	photo_url: string;
	sub_title: string;
	title: string;
	cv_file: string;
}

export interface Experience {
	_id: string;
	detail: string[];
	since_date: {
		end: string;
		start: string;
	};
	title: string;
	work_field: string;
}

export interface TechnicalSkill {
	_id: string;
	ai_search: string[];
	backend_architecture: string[];
	databases_caching: string[];
	devops_cloud: string[];
	infrastructure_networking: string[];
	message_brokers: string[];
	programming_language: string[];
	tools_design: string[];
	web_frameworks: string[];
}

export interface HomeLab {
	_id: string;
	category: string;
	description: string;
	icon: string;
	isOnline: boolean;
	name: string;
	url: string;
}
