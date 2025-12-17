import { Canvas } from '@napi-rs/canvas'
import { drawGradientBackground } from './background'
import { drawCubic, generateCubics, type CubicInfo } from './cubic'
import { addMultiLayerNoise } from './noise'

export interface Captcha {
	// base64 string
	img: string

	size: {
		width: number
		height: number
	}

	target: {
		x: number
		y: number
	}

	// prompt to show user
	prompt: string
}

export async function generateCaptcha(
	width: number = 600,
	height: number = 400,
	cubicCount?: number
): Promise<Captcha> {
	/**
	 * Generate a captcha image containing 4-8 random 3D-like objects.
	 */
	const count = cubicCount ?? Math.floor(Math.random() * 5) + 4
	if (count < 4 || count > 8) {
		throw new Error('Cubic count must be between 4 and 8')
	}

	const canvas = new Canvas(width, height)
	drawGradientBackground(canvas, width, height)

	const cubics: CubicInfo[] = generateCubics(width, height, count)
	for (const cubic of cubics) {
		drawCubic(canvas, cubic.x, cubic.y, cubic.width, cubic.height, cubic.color, cubic.type)
	}

	addMultiLayerNoise(canvas, width, height)

	const targetCubic = cubics.find((c) => c.isTarget)
	if (!targetCubic) {
		throw new Error('Target object not found')
	}

	const buffer = await canvas.toBuffer('image/png')
	const base64 = `data:image/png;base64,${buffer.toString('base64')}`

	const prompt = generatePrompt(targetCubic)

	return {
		img: base64,
		size: {
			width,
			height,
		},
		target: {
			x: targetCubic.x + targetCubic.width / 2,
			y: targetCubic.y + targetCubic.height / 2,
		},
		prompt,
	}
}

function generatePrompt(cubic: CubicInfo): string {
	const colorMap: Record<string, string> = {
		'#FF6B6B': 'red',
		'#4ECDC4': 'teal',
		'#45B7D1': 'blue',
		'#FFA07A': 'orange',
		'#98D8C8': 'mint',
		'#F7DC6F': 'yellow',
		'#BB8FCE': 'purple',
		'#85C1E2': 'sky',
	}

	const typeMap: Record<string, string> = {
		cube: 'cube',
		cuboid: 'cuboid',
		cylinder: 'cylinder',
	}

	const colorName = colorMap[cubic.color] || 'colored'
	const typeName = typeMap[cubic.type] || 'object'

	return `Please click the ${colorName} ${typeName}`
}

export function verifyCaptcha(
	captcha: Captcha,
	userX: number,
	userY: number,
	tolerance: number = 50
): boolean {
	const distance = Math.sqrt(
		Math.pow(userX - captcha.target.x, 2) +
			Math.pow(userY - captcha.target.y, 2)
	)
	return distance <= tolerance
}