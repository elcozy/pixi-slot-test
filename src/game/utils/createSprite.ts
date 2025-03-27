import * as PIXI from 'pixi.js';

export function createSprite(texture: string, anchor: number, label?: string) {
	const sprite = new PIXI.Sprite(PIXI.Texture.from(texture));
	sprite.label = label ?? 'texture';
	sprite.anchor.set(anchor);

	return sprite;
}
