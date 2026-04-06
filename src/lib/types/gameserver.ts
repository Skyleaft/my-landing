export interface GameServer {
	id: string;
	name: string;
	game: string;
	hostname: string;
	port: number;
	status: 'online' | 'offline' | 'maintenance';
	players: {
		current: number;
		max: number;
	};
	version?: string;
	description?: string;
}