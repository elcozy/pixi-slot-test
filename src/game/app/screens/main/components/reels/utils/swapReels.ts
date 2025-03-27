import { Layout } from '@/game/configuration/Layout';
import type ReelSlot from '../ReelSlot';
import * as PIXI from 'pixi.js';

export function validateSwapIndices(indexA: number, indexB: number, slotCurrState: ReelSlot[]) {
	if (indexA === indexB) {
		return 'swap index: SAME indexes';
	}
	if (indexA >= slotCurrState.length || indexB >= slotCurrState.length) {
		console.error('swap index: INVALID');
		return 'swap index: INVALID';
	}
	return null;
}

export function createMaskedContainer(
	reel: ReelSlot,
	index: number
): {
	rectContainer: PIXI.Container;
	rectRectMask: PIXI.Graphics;
	swapFrame: PIXI.Sprite;
	swapFrameGlow: PIXI.Sprite;
} {
	const rectContainer = new PIXI.Container();
	const rectRectMask = new PIXI.Graphics();
	const radius = 12;

	rectRectMask.roundRect(0, 0, Layout.reelWidth, reel.reelHeight, radius).fill(0xffd952);

	rectContainer.addChild(rectRectMask);
	rectContainer.label = `rectContainer_${index}`;
	rectRectMask.label = `rectRectMask_${index}`;

	const columnTex = PIXI.Texture.from('column');
	const columnGlowTex = PIXI.Texture.from('column_glow');

	const scaleFrame = Math.min(
		(Layout.reelWidth * 1.1) / columnTex.width,
		(reel.reelHeight * 1.02) / columnTex.height
	);

	const scaleFrameGlow = Math.min(
		(Layout.reelWidth * 1.1) / columnGlowTex.width,
		(reel.reelHeight * 1.02) / columnGlowTex.height
	);

	let swapFrame = new PIXI.Sprite({
		texture: columnTex,
		alpha: 0,
		scale: scaleFrame,
		zIndex: 5,
		label: 'column_' + index,
		anchor: new PIXI.Point(0.05, 0.01)
	});
	let swapFrameGlow = new PIXI.Sprite({
		texture: columnGlowTex,
		alpha: 0,
		scale: scaleFrameGlow,
		zIndex: 5,
		label: 'column_glow_' + index,
		anchor: new PIXI.Point(0.05, 0.01)
	});

	rectContainer.addChild(rectRectMask, swapFrame, swapFrameGlow);

	return { rectContainer, rectRectMask, swapFrame, swapFrameGlow };
}

function setupSwapTimeline(
	slotCurrState: ReelSlot[],
	reelsToSwap: ReelSlot,
	reelsToSwapParent: PIXI.Container,
	indexA: number,
	indexB: number
): { moveToParentTl: GSAPTimeline; swapTl: GSAPTimeline } {
	const reel2Position = reelsToSwapParent.toLocal(slotCurrState[indexB].getGlobalPosition());
	const moveToParentTl = gsap.timeline({ paused: true });
	const swapTl = gsap.timeline({ paused: true });

	// Add timeline configurations for moveToParentTl and swapTl here...

	return { moveToParentTl, swapTl };
}
