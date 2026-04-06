export interface HomelabService {
	id: string;
	name: string;
	description: string;
	status: 'online' | 'offline' | 'maintenance';
	url?: string;
	icon: string;
	category: 'virtualization' | 'media' | 'network' | 'storage' | 'database' | 'monitoring';
}