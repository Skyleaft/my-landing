import { browser } from '$app/environment';

class ThemeState {
	current = $state<'light' | 'dark'>('dark');

	constructor() {
		if (browser) {
			const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
			if (saved) {
				this.current = saved;
			} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
				this.current = 'dark';
			}
			this.apply();
		}
	}

	toggle() {
		this.current = this.current === 'light' ? 'dark' : 'light';
		this.apply();
		if (browser) localStorage.setItem('theme', this.current);
	}

	private apply() {
		if (!browser) return;
		if (this.current === 'dark') {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}
}

export const theme = new ThemeState();
