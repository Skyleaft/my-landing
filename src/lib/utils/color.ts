/**
 * Extracts the dominant color from an image URL
 * @param imageUrl - The URL of the image to analyze
 * @returns A promise that resolves to the dominant color in RGB format
 */
export function extractDominantColor(imageUrl: string): Promise<string> {
	return new Promise((resolve) => {
		// Check if we're in a browser environment
		if (typeof window === 'undefined' || typeof document === 'undefined') {
			resolve('#ffffff');
			return;
		}

		const img = new Image();
		img.crossOrigin = 'anonymous';
		img.onload = () => {
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');
			if (!ctx) {
				resolve('#ffffff');
				return;
			}

			canvas.width = img.width;
			canvas.height = img.height;
			ctx.drawImage(img, 0, 0);

			const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
			const data = imageData.data;

			// Sample pixels to find dominant color
			const colorCounts: { [key: string]: number } = {};
			const sampleSize = Math.floor(data.length / 4 / 100); // Sample 1% of pixels

			for (let i = 0; i < data.length; i += 4 * sampleSize) {
				const r = data[i];
				const g = data[i + 1];
				const b = data[i + 2];

				// Skip transparent pixels
				if (data[i + 3] < 128) continue;

				const color = `rgb(${r},${g},${b})`;
				colorCounts[color] = (colorCounts[color] || 0) + 1;
			}

			// Find most frequent color
			let dominant = '#ffffff';
			let maxCount = 0;
			for (const [color, count] of Object.entries(colorCounts)) {
				if (count > maxCount) {
					maxCount = count;
					dominant = color;
				}
			}

			// Make the color brighter/lighter
			const brightenedColor = makeColorBrighter(dominant);
			resolve(brightenedColor);
		};
		img.onerror = () => resolve('#ffffff');
		img.src = imageUrl;
	});
}

/**
 * Makes a color brighter by converting to HSL, increasing lightness, and converting back to RGB
 * @param rgbColor - The color in rgb(r, g, b) format
 * @returns The brighter color in rgb(r, g, b) format
 */
export function makeColorBrighter(rgbColor: string): string {
	// Extract RGB values from rgb(r, g, b) format
	const match = rgbColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
	if (!match) return rgbColor;

	let r = parseInt(match[1]);
	let g = parseInt(match[2]);
	let b = parseInt(match[3]);

	// Convert to HSL to adjust lightness
	const hsl = rgbToHsl(r, g, b);

	// Increase lightness by 50% (but cap at 90% to avoid pure white)
	hsl.l = Math.min(hsl.l + 0.7, 0.8);

	// Convert back to RGB
	const brightRgb = hslToRgb(hsl.h, hsl.s, hsl.l);

	return `rgb(${Math.round(brightRgb.r)}, ${Math.round(brightRgb.g)}, ${Math.round(brightRgb.b)})`;
}

/**
 * Converts RGB color values to HSL
 * @param r - Red component (0-255)
 * @param g - Green component (0-255)
 * @param b - Blue component (0-255)
 * @returns Object with h, s, l properties
 */
function rgbToHsl(r: number, g: number, b: number) {
	r /= 255;
	g /= 255;
	b /= 255;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	let h = 0;
	let s = 0;
	const l = (max + min) / 2;

	if (max !== min) {
		const d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
		}
		h /= 6;
	}

	return { h, s, l };
}

/**
 * Converts HSL color values to RGB
 * @param h - Hue component (0-1)
 * @param s - Saturation component (0-1)
 * @param l - Lightness component (0-1)
 * @returns Object with r, g, b properties
 */
function hslToRgb(h: number, s: number, l: number) {
	let r, g, b;

	if (s === 0) {
		r = g = b = l; // achromatic
	} else {
		const hue2rgb = (p: number, q: number, t: number) => {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		};

		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;

		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}

	return {
		r: Math.round(r * 255),
		g: Math.round(g * 255),
		b: Math.round(b * 255)
	};
}