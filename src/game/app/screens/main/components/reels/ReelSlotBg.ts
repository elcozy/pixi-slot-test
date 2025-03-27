import * as PIXI from 'pixi.js';
import { Layout } from '@/game/configuration/Layout';
import { GameConfig } from '@/game/configuration/Config';

export default class ReelSlotBg extends PIXI.Container {
	constructor() {
		super();
		this.createSymbolsBG();
	}

	createSymbolsBG() {
		let currY = 0;

		for (let i = 0; i < GameConfig.REEL_COUNT_ROW; i++) {
			const symbolBG = new PIXI.Graphics();
			symbolBG
				.roundRect(0, 0, Layout.reelWidth, Layout.reelWidth, Layout.reelWidth * 0.1)
				.fill(0xffffff);
			symbolBG.alpha = 0.1;
			symbolBG.position.set(0, currY);

			currY += symbolBG.height + Layout.slotGap;
			this.addChild(symbolBG);
		}
	}

	get symbolsBackgrounds() {
		return this.children;
	}

	get positions() {
		const firstReelPosition = -(Layout.reelWidth + Layout.slotGap);

		const positions = this.symbolsBackgrounds.map((bg) => bg.y);
		const lastPosition =
			positions[positions.length - 1] + this.symbolsBackgrounds[0].height + Layout.slotGap;

		return [firstReelPosition, ...positions, lastPosition];
	}

	resize() {
		let currBGY = 0;

		this.symbolsBackgrounds.map((symbolBG) => {
			if (symbolBG instanceof PIXI.Graphics && !symbolBG.destroyed) {
				symbolBG
					.clear()
					.roundRect(0, 0, Layout.reelWidth, Layout.reelWidth, Layout.reelWidth * 0.1)
					.fill(0xffffff);
				symbolBG.y = currBGY;

				currBGY += symbolBG.height + Layout.slotGap;
			}
		});
	}
}
