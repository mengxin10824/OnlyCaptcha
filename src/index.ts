import { Elysia, t } from 'elysia';
import { html } from '@elysiajs/html';
import { Index } from './pages/Index';
import { generateCaptcha, verifyCaptcha, type Captcha } from './utils/captcha';
import { randomUUID } from 'crypto';

const captchaMap = new Map<string, Captcha>();

function addCaptcha(captchaId: string, captcha: Captcha) {
	captchaMap.set(captchaId, captcha);
	
	// Auto-delete captcha after 5 minutes
	setTimeout(() => {
		captchaMap.delete(captchaId);
	}, 5 * 60 * 1000);
}

const app = new Elysia()
	.use(html())

	.get("/", async () => {
		const captchaId = randomUUID();
		const captcha = await generateCaptcha();
		
		addCaptcha(captchaId, captcha);

		// use simple HTML page (via TSX file)
		return Index({
			captchaId: captchaId,
			captcha: captcha.img,
			width: String(captcha.size.width),
			height: String(captcha.size.height),
			prompt: captcha.prompt
		});
	})

	// handle form request
	.post("/submit", async ({ body: { x, y, captchaId } }) => {
		if (!captchaId) {
			return "Missing captcha ID";
		}

		// Get captcha from store
		const captcha = captchaMap.get(captchaId);

		if (!captcha) {
			return "Invalid or expired captcha";
		}

		const result = verifyCaptcha(captcha, x, y);
		captchaMap.delete(captchaId);

		if (result) {
			return "Successfully verified!";
		} else {
			return "Verification failed. Please try again.";
		}
	}, {
		body: t.Object({
			x: t.Numeric(),
			y: t.Numeric(),
			captchaId: t.String()
		})
	})

	.listen(3000, () => console.log('Server running at http://localhost:3000'));

