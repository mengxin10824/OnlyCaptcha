import type { Canvas } from '@napi-rs/canvas'

export function drawGradientBackground(
	canvas: Canvas,
	width: number,
	height: number
): void {
	const ctx = canvas.getContext('2d')

	const gradient = ctx.createLinearGradient(0, 0, width, height)
	gradient.addColorStop(0, '#e0e0e0')
	gradient.addColorStop(0.5, '#c8c8c8')
	gradient.addColorStop(1, '#b0b0b0')

	ctx.fillStyle = gradient
	ctx.fillRect(0, 0, width, height)
}
