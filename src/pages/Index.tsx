interface IndexProps {
	captchaId: string
	width: string
	height: string

	captcha: string
	prompt: string
}

export function Index({ captchaId, captcha, width, height, prompt }: IndexProps) {
	return <html lang="en">
		<head>
			<meta charset="UTF-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<title>Form Demo</title>
		</head>
		<body>
			<h1>OnlyCaptcha</h1>
			<p>
				This is a simple form demo page, <strong>only using HTML</strong> form to submit data to the server.
			</p>

			<h2>How it works:</h2>
			<p>
				Each time the page is rendered, the server generates a unique `captchaId` and stores the corresponding CAPTCHA image and coordinates in a backend map. The form submits the `captchaId` via a hidden field.
			</p>

			<p>
				The image input field (<a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/image#using_image_inputs">MDN</a>) submits the user's clicked `x` and `y` coordinates. The server then looks up the corresponding CAPTCHA based on the `captchaId` and verifies whether the coordinates fall within the target area.
			</p>

			<form method="POST" action="/submit" enctype="application/x-www-form-urlencoded" style={{
				border: '1px solid #ccc',
				backgroundColor: '#f9f9f9',
				padding: '20px',
				display: 'inline-block'
			}}>
				<p><strong><u>{prompt}</u></strong></p>
				<input type="hidden" name="captchaId" value={captchaId} />
				<input type="image" src={captcha} alt="captcha" width={width} height={height} />
			</form>

			<footer>
				<p><a href="https://github.com/mengxin10824/OnlyCaptcha">GitHub</a></p>
			</footer>
		</body>
	</html>
}