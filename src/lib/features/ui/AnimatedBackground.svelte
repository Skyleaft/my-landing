<script lang="ts">
	import { onMount } from 'svelte';
	import { theme } from './theme.svelte.ts';

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let width = 0;
	let height = 0;
	let animationFrame: number;
	let mouse = { x: -9999, y: -9999 };

	// ─── Palette ────────────────────────────────────────────────────────────────
	const DARK_COLORS = ['#5b8fd4', '#7b6fd4', '#4fc3c3', '#6d9eeb', '#a78bfa'];
	const LIGHT_COLORS = ['#3b6cb5', '#5b4db5', '#2e9d9d', '#4a7ecb', '#7c5cf0'];

	function palette() {
		return theme.current === 'dark' ? DARK_COLORS : LIGHT_COLORS;
	}

	// ─── Blobs ──────────────────────────────────────────────────────────────────
	interface Blob {
		x: number;
		y: number;
		tx: number;
		ty: number;
		vx: number;
		vy: number;
		size: number;
		color: string;
		pulse: number;
		pulseSpeed: number;
	}

	let blobs: Blob[] = [];

	function initBlobs() {
		const colors = palette();
		blobs = Array.from({ length: 5 }, (_, i) => {
			const color = colors[i % colors.length];
			return {
				x: Math.random() * width,
				y: Math.random() * height,
				tx: Math.random() * width,
				ty: Math.random() * height,
				vx: 0,
				vy: 0,
				size: 180 + Math.random() * 260,
				color,
				pulse: Math.random() * Math.PI * 2,
				pulseSpeed: 0.008 + Math.random() * 0.012
			};
		});
	}

	function hexToRgb(hex: string) {
		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);
		return { r, g, b };
	}

	function drawBlobs() {
		blobs.forEach((blob) => {
			blob.pulse += blob.pulseSpeed;
			const pulseFactor = 1 + 0.08 * Math.sin(blob.pulse);
			const r = blob.size * pulseFactor;

			// Drift towards target
			const dx = blob.tx - blob.x;
			const dy = blob.ty - blob.y;
			blob.vx += dx * 0.0006;
			blob.vy += dy * 0.0006;

			// Mouse repulsion
			const mdx = blob.x - mouse.x;
			const mdy = blob.y - mouse.y;
			const dist = Math.sqrt(mdx * mdx + mdy * mdy);
			if (dist < 500) {
				const force = (500 - dist) / 500;
				blob.vx += mdx * force * 0.015;
				blob.vy += mdy * force * 0.015;
			}

			blob.vx *= 0.94;
			blob.vy *= 0.94;
			blob.x += blob.vx;
			blob.y += blob.vy;

			if (Math.random() < 0.005) {
				blob.tx = Math.random() * width;
				blob.ty = Math.random() * height;
			}

			const { r: cr, g: cg, b: cb } = hexToRgb(blob.color);
			const alpha = theme.current === 'dark' ? 0.13 : 0.08;
			const gradient = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, r);
			gradient.addColorStop(0, `rgba(${cr},${cg},${cb},${alpha})`);
			gradient.addColorStop(0.5, `rgba(${cr},${cg},${cb},${alpha * 0.5})`);
			gradient.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);

			ctx.beginPath();
			ctx.arc(blob.x, blob.y, r, 0, Math.PI * 2);
			ctx.fillStyle = gradient;
			ctx.fill();
		});
	}

	// ─── Particles ──────────────────────────────────────────────────────────────
	interface Particle {
		x: number;
		y: number;
		vx: number;
		vy: number;
		size: number;
		color: string;
		alpha: number;
		life: number;
		maxLife: number;
	}

	const PARTICLE_COUNT = 80;
	const MAX_LINK_DIST = 140;
	let particles: Particle[] = [];

	function randomParticle(inheritX?: number, inheritY?: number): Particle {
		const colors = palette();
		const angle = Math.random() * Math.PI * 2;
		const speed = 0.3 + Math.random() * 0.5;
		const maxLife = 400 + Math.random() * 400;
		return {
			x: inheritX ?? Math.random() * width,
			y: inheritY ?? Math.random() * height,
			vx: Math.cos(angle) * speed,
			vy: Math.sin(angle) * speed,
			size: 1.5 + Math.random() * 2,
			color: colors[Math.floor(Math.random() * colors.length)],
			alpha: 0,
			life: 0,
			maxLife
		};
	}

	function initParticles() {
		particles = Array.from({ length: PARTICLE_COUNT }, () => {
			const p = randomParticle();
			p.life = Math.floor(Math.random() * p.maxLife); // stagger start
			p.alpha = 1;
			return p;
		});
	}

	function drawParticles() {
		const colors = palette();

		for (let i = particles.length - 1; i >= 0; i--) {
			const p = particles[i];
			p.life++;

			// Fade in / fade out
			const halfLife = p.maxLife / 2;
			if (p.life < halfLife) {
				p.alpha = p.life / halfLife;
			} else {
				p.alpha = 1 - (p.life - halfLife) / halfLife;
			}

			if (p.life >= p.maxLife) {
				particles[i] = randomParticle();
				continue;
			}

			// Mouse attraction (subtle)
			const mdx = mouse.x - p.x;
			const mdy = mouse.y - p.y;
			const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
			if (mDist < 200 && mDist > 0) {
				p.vx += (mdx / mDist) * 0.02;
				p.vy += (mdy / mDist) * 0.02;
			}

			// Speed cap
			const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
			if (speed > 1.5) {
				p.vx = (p.vx / speed) * 1.5;
				p.vy = (p.vy / speed) * 1.5;
			}

			p.x += p.vx;
			p.y += p.vy;

			// Wrap around edges
			if (p.x < -20) p.x = width + 20;
			if (p.x > width + 20) p.x = -20;
			if (p.y < -20) p.y = height + 20;
			if (p.y > height + 20) p.y = -20;

			// Draw node dot
			const { r, g, b } = hexToRgb(p.color);
			ctx.beginPath();
			ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
			ctx.fillStyle = `rgba(${r},${g},${b},${p.alpha * 0.85})`;
			ctx.fill();

			// Draw lines to nearby particles
			for (let j = i + 1; j < particles.length; j++) {
				const q = particles[j];
				const dx = p.x - q.x;
				const dy = p.y - q.y;
				const dist = Math.sqrt(dx * dx + dy * dy);
				if (dist < MAX_LINK_DIST) {
					const linkAlpha = (1 - dist / MAX_LINK_DIST) * 0.35 * Math.min(p.alpha, q.alpha);
					const { r: lr, g: lg, b: lb } = hexToRgb(p.color);
					ctx.beginPath();
					ctx.moveTo(p.x, p.y);
					ctx.lineTo(q.x, q.y);
					ctx.strokeStyle = `rgba(${lr},${lg},${lb},${linkAlpha})`;
					ctx.lineWidth = 0.8;
					ctx.stroke();
				}
			}
		}
	}

	// ─── Mouse lines (spider-web from cursor) ───────────────────────────────────
	function drawMouseLines() {
		if (mouse.x === -9999) return;
		const MOUSE_DIST = 160;
		for (const p of particles) {
			const dx = mouse.x - p.x;
			const dy = mouse.y - p.y;
			const dist = Math.sqrt(dx * dx + dy * dy);
			if (dist < MOUSE_DIST) {
				const { r, g, b } = hexToRgb(p.color);
				const linkAlpha = (1 - dist / MOUSE_DIST) * 0.5 * p.alpha;
				ctx.beginPath();
				ctx.moveTo(p.x, p.y);
				ctx.lineTo(mouse.x, mouse.y);
				ctx.strokeStyle = `rgba(${r},${g},${b},${linkAlpha})`;
				ctx.lineWidth = 0.8;
				ctx.stroke();
			}
		}
	}

	// ─── Main loop ──────────────────────────────────────────────────────────────
	function draw() {
		if (!ctx) return;
		ctx.clearRect(0, 0, width, height);
		drawBlobs();
		drawParticles();
		drawMouseLines();
		animationFrame = requestAnimationFrame(draw);
	}

	// ─── Resize / lifecycle ─────────────────────────────────────────────────────
	function resize() {
		if (typeof window === 'undefined') return;
		width = window.innerWidth;
		height = window.innerHeight;
		if (canvas) {
			canvas.width = width;
			canvas.height = height;
		}
	}

	function handleMouseMove(e: MouseEvent) {
		mouse.x = e.clientX;
		mouse.y = e.clientY;
	}

	function handleMouseLeave() {
		mouse.x = -9999;
		mouse.y = -9999;
	}

	onMount(() => {
		ctx = canvas.getContext('2d')!;
		resize();
		initBlobs();
		initParticles();
		draw();

		window.addEventListener('resize', resize);
		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('mouseleave', handleMouseLeave);

		return () => {
			cancelAnimationFrame(animationFrame);
			window.removeEventListener('resize', resize);
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('mouseleave', handleMouseLeave);
		};
	});

	let opacity = $derived(theme.current === 'dark' ? 1 : 0.75);
</script>

<canvas
	bind:this={canvas}
	class="pointer-events-none fixed inset-0 -z-50 transition-opacity duration-1000"
	style="opacity: {opacity};"
></canvas>
