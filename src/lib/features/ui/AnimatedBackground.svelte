<script lang="ts">
	import { onMount } from 'svelte';
	import { theme } from './theme.svelte.ts';

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let width = $state(0);
	let height = $state(0);
	let animationFrame: number;

	let mouse = { x: 0, y: 0 };
	let blobs: Array<{
		x: number;
		y: number;
		targetX: number;
		targetY: number;
		size: number;
		vx: number;
		vy: number;
		color: string;
	}> = $state([]);

	function initBlobs() {
		blobs = Array.from({ length: 5 }, (_, i) => ({
			x: Math.random() * width,
			y: Math.random() * height,
			targetX: Math.random() * width,
			targetY: Math.random() * height,
			size: 200 + Math.random() * 300,
			vx: 0,
			vy: 0,
			color: `rgba(117, 158, 184, ${0.1 + Math.random() * 0.15})`
		}));
	}

	function handleMouseMove(e: MouseEvent) {
		mouse.x = e.clientX;
		mouse.y = e.clientY;
	}

	function draw() {
		if (!ctx) return;
		ctx.clearRect(0, 0, width, height);

		blobs.forEach((blob, i) => {
			// Movement towards target
			const dx = blob.targetX - blob.x;
			const dy = blob.targetY - blob.y;
			blob.vx += dx * 0.001;
			blob.vy += dy * 0.001;

			// Mouse influence
			const mdx = mouse.x - blob.x;
			const mdy = mouse.y - blob.y;
			const dist = Math.sqrt(mdx * mdx + mdy * mdy);
			if (dist < 400) {
				const force = (400 - dist) / 400;
				blob.vx += mdx * force * 0.02;
				blob.vy += mdy * force * 0.02;
			}

			blob.vx *= 0.95;
			blob.vy *= 0.95;
			blob.x += blob.vx;
			blob.y += blob.vy;

			// Random new targets occasionally
			if (Math.random() < 0.01) {
				blob.targetX = Math.random() * width;
				blob.targetY = Math.random() * height;
			}

			// Draw blob
			ctx.beginPath();
			const gradient = ctx.createRadialGradient(
				blob.x,
				blob.y,
				0,
				blob.x,
				blob.y,
				blob.size
			);
			gradient.addColorStop(0, blob.color);
			gradient.addColorStop(1, 'rgba(117, 158, 184, 0)');
			ctx.fillStyle = gradient;
			ctx.arc(blob.x, blob.y, blob.size, 0, Math.PI * 2);
			ctx.fill();
		});

		animationFrame = requestAnimationFrame(draw);
	}

	function resize() {
		if (typeof window === 'undefined') return;
		width = window.innerWidth;
		height = window.innerHeight;
		if (canvas) {
			canvas.width = width;
			canvas.height = height;
		}
	}

	onMount(() => {
		ctx = canvas.getContext('2d')!;
		resize();
		initBlobs();
		draw();

		window.addEventListener('resize', resize);
		window.addEventListener('mousemove', handleMouseMove);

		return () => {
			cancelAnimationFrame(animationFrame);
			window.removeEventListener('resize', resize);
			window.removeEventListener('mousemove', handleMouseMove);
		};
	});

	let opacity = $derived(theme.current === 'dark' ? 0.4 : 0.2);
</script>

<canvas
	bind:this={canvas}
	class="fixed inset-0 -z-50 pointer-events-none transition-opacity duration-1000"
	style="opacity: {opacity};"
></canvas>
