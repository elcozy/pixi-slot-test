import * as PIXI from 'pixi.js';

export function createText(text: string, options: Partial<PIXI.TextStyle> = {}): PIXI.Text {
	const textPixi = new PIXI.Text({
		text,
		style: {
			fontSize: 50,
			fill: 0xffffff,
			fontWeight: '700',
			...options
		}
	});

	return textPixi;
}
