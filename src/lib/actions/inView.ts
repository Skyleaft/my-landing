import type { Action } from 'svelte/action';

interface InViewOptions {
	threshold?: number;
	rootMargin?: string;
	once?: boolean;
}

/**
 * Svelte action that adds `.in-view` to an element when it enters the viewport
 * and removes it when it leaves (unless `once: true`).
 */
export const inView: Action<HTMLElement, InViewOptions | undefined> = (
	node,
	options = {}
) => {
	const { threshold = 0.15, rootMargin = '0px', once = true } = options;

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					node.classList.add('in-view');
					if (once) observer.unobserve(node);
				} else if (!once) {
					node.classList.remove('in-view');
				}
			});
		},
		{ threshold, rootMargin }
	);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
};
