import * as PIXI from 'pixi.js';

//https://pixijs.com/8.x/examples/advanced/screen-shot

export async function takeScreenshot(app: PIXI.Application, containerFrame: PIXI.Container) {
	let screenshot: HTMLAnchorElement;

	//   if (screenshot !== undefined) {
	//     screenshot.remove();
	//   }

	//   app.stop();
	const url = await app.renderer.extract.base64(containerFrame);

	screenshot = document.createElement('a');

	document.body.append(screenshot);

	screenshot.style.position = 'fixed';
	screenshot.style.top = '20px';
	screenshot.style.right = '20px';
	screenshot.download = 'screenshot';
	screenshot.href = url;

	const image = new Image();

	image.width = app.screen.width / 5;
	image.src = url;

	screenshot.innerHTML = image.outerHTML;

	//   app.start();
	return url;
	// return screenshot;
}

export function createSnapshotAsBackground(app: PIXI.Application, sourceContainer: PIXI.Container) {
	// Step 1: Render the source container to a texture
	const texture = app.renderer.generateTexture({
		target: sourceContainer,
		resolution: 1
		// multisample: PIXI.MSAA_QUALITY.NONE,
	});

	// Step 2: Create a sprite from the texture
	return texture;
	const snapshotSprite = new PIXI.Sprite(texture);

	// Optional: Resize to fit the target container
	//   snapshotSprite.width = targetContainer.width;
	//   snapshotSprite.height = targetContainer.height;

	// Step 3: Add the snapshot sprite as the background of the target container
	return snapshotSprite;
	//   targetContainer.addChildAt(snapshotSprite, 0); // Adding at index 0 makes it the background
}
export function createTextureFromContainer(app: PIXI.Application, sourceContainer: PIXI.Container) {
	const texture = app.renderer.generateTexture({
		target: sourceContainer,
		resolution: 1
		// multisample: PIXI.MSAA_QUALITY.NONE,
	});

	return texture;
}
