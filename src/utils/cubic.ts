import type { Canvas, SKRSContext2D } from '@napi-rs/canvas'

export interface CubicInfo {
	x: number
	y: number
	width: number
	height: number
	color: string
	isTarget: boolean
	type: 'cube' | 'cuboid' | 'cylinder'
}

export function drawCubic(
	canvas: Canvas,
	x: number,
	y: number,
	width: number,
	height: number,
	color: string,
	type: 'cube' | 'cuboid' | 'cylinder'
): void {
	const ctx = canvas.getContext('2d')

	ctx.save()
	ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
	ctx.shadowBlur = 10
	ctx.shadowOffsetX = 5
	ctx.shadowOffsetY = 5

	if (type === 'cylinder') {
		drawCylinder(ctx, x, y, width, height, color)
	} else {
		drawBox(ctx, x, y, width, height, color)
	}

	ctx.restore()
}

function drawBox(
	ctx: SKRSContext2D,
	x: number,
	y: number,
	width: number,
	height: number,
	color: string
): void {
	ctx.fillStyle = color
	ctx.fillRect(x, y, width, height)

	const offsetX = width * 0.3
	const offsetY = height * 0.3
	ctx.fillStyle = lightenColor(color, 20)
	ctx.beginPath()
	ctx.moveTo(x, y)
	ctx.lineTo(x + offsetX, y - offsetY)
	ctx.lineTo(x + width + offsetX, y - offsetY)
	ctx.lineTo(x + width, y)
	ctx.closePath()
	ctx.fill()

	ctx.fillStyle = darkenColor(color, 20)
	ctx.beginPath()
	ctx.moveTo(x + width, y)
	ctx.lineTo(x + width + offsetX, y - offsetY)
	ctx.lineTo(x + width + offsetX, y + height - offsetY)
	ctx.lineTo(x + width, y + height)
	ctx.closePath()
	ctx.fill()

	ctx.strokeStyle = darkenColor(color, 40)
	ctx.lineWidth = 2
	ctx.strokeRect(x, y, width, height)
}

function drawCylinder(
	ctx: SKRSContext2D,
	x: number,
	y: number,
	width: number,
	height: number,
	color: string
): void {
	const radiusX = width / 2
	const radiusY = height * 0.2
	const centerX = x + radiusX

	ctx.fillStyle = darkenColor(color, 20)
	ctx.beginPath()
	ctx.ellipse(centerX, y + height, radiusX, radiusY, 0, 0, Math.PI * 2)
	ctx.fill()

	ctx.fillStyle = color
	ctx.fillRect(x, y + radiusY, width, height - radiusY)

	ctx.fillStyle = lightenColor(color, 20)
	ctx.beginPath()
	ctx.ellipse(centerX, y + radiusY, radiusX, radiusY, 0, 0, Math.PI * 2)
	ctx.fill()

	ctx.strokeStyle = darkenColor(color, 40)
	ctx.lineWidth = 2
	ctx.beginPath()
	ctx.ellipse(centerX, y + radiusY, radiusX, radiusY, 0, 0, Math.PI * 2)
	ctx.stroke()
	ctx.beginPath()
	ctx.moveTo(x, y + radiusY)
	ctx.lineTo(x, y + height)
	ctx.moveTo(x + width, y + radiusY)
	ctx.lineTo(x + width, y + height)
	ctx.stroke()
}

export function generateCubics(
	canvasWidth: number,
	canvasHeight: number,
	count: number
): CubicInfo[] {
	const cubics: CubicInfo[] = []
	const colors = [
		'#FF6B6B',
		'#4ECDC4',
		'#45B7D1',
		'#FFA07A',
		'#98D8C8',
		'#F7DC6F',
		'#BB8FCE',
		'#85C1E2',
	]
	const types: Array<'cube' | 'cuboid' | 'cylinder'> = ['cube', 'cuboid', 'cylinder']

	const minSize = 40
	const maxSize = 80
	const padding = 20

	for (let i = 0; i < count; i++) {
		const type = types[Math.floor(Math.random() * types.length)] || 'cube'
		let width: number
		let height: number

		if (type === 'cube') {
			const size = Math.floor(Math.random() * (maxSize - minSize) + minSize)
			width = size
			height = size
		} else if (type === 'cuboid') {
			width = Math.floor(Math.random() * (maxSize - minSize) + minSize)
			height = Math.floor(Math.random() * (maxSize - minSize) + minSize)
		} else {
			width = Math.floor(Math.random() * (maxSize - minSize) + minSize)
			height = Math.floor(Math.random() * (maxSize * 1.2 - minSize) + minSize)
		}

		const maxDimension = Math.max(width, height)
		const x = Math.floor(
			Math.random() * (canvasWidth - maxDimension - padding * 2) + padding
		)
		const y = Math.floor(
			Math.random() * (canvasHeight - maxDimension - padding * 2) + padding
		)
		const color = colors[Math.floor(Math.random() * colors.length)] || '#FF6B6B'

		cubics.push({
			x,
			y,
			width,
			height,
			color,
			isTarget: false,
			type,
		})
	}

	if (cubics.length > 0) {
		const targetIndex = Math.floor(Math.random() * cubics.length)
		const targetCubic = cubics[targetIndex]
		if (targetCubic) {
			targetCubic.isTarget = true
		}
	}

	return cubics
}

function darkenColor(color: string, percent: number): string {
	const num = parseInt(color.replace('#', ''), 16)
	const amt = Math.round(2.55 * percent)
	const R = Math.max((num >> 16) - amt, 0)
	const G = Math.max(((num >> 8) & 0x00ff) - amt, 0)
	const B = Math.max((num & 0x0000ff) - amt, 0)
	return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`
}

function lightenColor(color: string, percent: number): string {
	const num = parseInt(color.replace('#', ''), 16)
	const amt = Math.round(2.55 * percent)
	const R = Math.min((num >> 16) + amt, 255)
	const G = Math.min(((num >> 8) & 0x00ff) + amt, 255)
	const B = Math.min((num & 0x0000ff) + amt, 255)
	return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`
}
