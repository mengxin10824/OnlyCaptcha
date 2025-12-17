import type { Canvas } from '@napi-rs/canvas'

export function addNoiseLayer(
	canvas: Canvas,
	width: number,
	height: number,
	intensity: number = 0.1
): void {
	const ctx = canvas.getContext('2d')
	const imageData = ctx.getImageData(0, 0, width, height)
	const pixels = imageData.data

	for (let i = 0; i < pixels.length; i += 4) {
		const noise = (Math.random() - 0.5) * 255 * intensity
		const r = pixels[i]
		const g = pixels[i + 1]
		const b = pixels[i + 2]
		if (r !== undefined) pixels[i] = r + noise
		if (g !== undefined) pixels[i + 1] = g + noise
		if (b !== undefined) pixels[i + 2] = b + noise
	}

	ctx.putImageData(imageData, 0, 0)
}

export function addInterferenceLines(
	canvas: Canvas,
	width: number,
	height: number,
	lineCount: number = 5
): void {
	const ctx = canvas.getContext('2d')

	for (let i = 0; i < lineCount; i++) {
		ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.3)`
		ctx.lineWidth = Math.random() * 3 + 1
		ctx.beginPath()
		ctx.moveTo(Math.random() * width, Math.random() * height)
		ctx.lineTo(Math.random() * width, Math.random() * height)
		ctx.stroke()
	}
}

export function addRandomDots(
	canvas: Canvas,
	width: number,
	height: number,
	dotCount: number = 50
): void {
	const ctx = canvas.getContext('2d')

	for (let i = 0; i < dotCount; i++) {
		ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 0.5})`
		ctx.beginPath()
		ctx.arc(
			Math.random() * width,
			Math.random() * height,
			Math.random() * 3 + 1,
			0,
			Math.PI * 2
		)
		ctx.fill()
	}
}

export function addMultiLayerNoise(
	canvas: Canvas,
	width: number,
	height: number
): void {
	addNoiseLayer(canvas, width, height, 0.05)
	addInterferenceLines(canvas, width, height, 8)
	addRandomDots(canvas, width, height, 80)
	addNoiseLayer(canvas, width, height, 0.08)
}
