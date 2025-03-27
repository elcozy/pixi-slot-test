import type { Sprite } from 'pixi.js';

export type KeyframesParams = {
	animDur: number;
	currentRotation: number;
	currScaleSpinner?: number;
	currScaleStar?: number;
	currGlowSparkScale?: number;
};
export type KeyframesFunction = (params: KeyframesParams) => any;

export type SymbolResetFunction = () => void;

export type AdditionalCallback = () => void;

export type TweenElement = {
	sprite: Sprite;
	spriteTweenVar: Record<string, any>;
	delay?: number;
};
