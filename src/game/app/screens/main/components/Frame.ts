import * as PIXI from 'pixi.js';
import { ReelLayers } from './reels/Reel';
import { Layout } from '@/game/configuration/Layout';

export default class Frame extends PIXI.Container {
	lastSymbolReel: boolean = false;
	isCombination = false;
	reelFrame!: PIXI.Sprite;
	reelBase!: PIXI.Sprite;

	init() {
		this.create();
		this.resize();
	}
	create() {
		const frame2 = PIXI.Texture.from('reel_border_edge3.png') as any;
		frame2.x = 50;
		const base = PIXI.Texture.from('reel_border_base2.png');
		this.reelFrame = new PIXI.Sprite({
			texture: frame2,
			y: 0,
			x: 0,
			width: Layout.reelFrameProps.width,
			height: Layout.reelFrameProps.height,
			roundPixels: false,
			label: 'this.reelFrame',
			zIndex: ReelLayers.Frame
		});
		const baseProps = {
			texture: base,
			roundPixels: false
		};
		this.reelBase = new PIXI.Sprite(baseProps);

		this.reelBase.tint = '#02BDFF';
		this.reelFrame.tint = '#02BDFF';

		this.addChild(this.reelBase);
		this.reelBase.position.set(this.reelFrame.width, this.reelFrame.height / 2);
	}

	resize() {
		if (this.reelFrame) {
			this.reelFrame.width = Layout.reelFrameProps.width;
		}

		if (this.reelBase) {
			this.reelBase.width = Layout.reelBaseProps.width;
			this.reelBase.height = Layout.reelBaseProps.height;
			this.reelBase.position.set(Layout.reelBaseProps.x, Layout.reelBaseProps.y);
		}
	}
}
