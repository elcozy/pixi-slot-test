import { Layout } from '@/game/configuration/Layout';
import { CurrencyUtils } from '@/game/utils/CurrencyUtil';
import { destroyChildren } from '@/game/utils/destroyChidrenInContainer';
import { waitForInterval } from '@/game/utils/intervalWait';
import * as PIXI from 'pixi.js';

// €
export class Multiplier extends PIXI.Container {
	private text: PIXI.Text;

	constructor() {
		super();
		this.text = new PIXI.Text();
	}

	setFontSize() {
		const fS = Math.min(Layout.reelFrameSize2.width * 0.11, Layout.reelFrameSize2.height * 0.125);
		this.text.style = {
			fontFamily: 'Arial',
			fontSize: fS,
			align: 'center',
			fill: 0xfff008,
			fontWeight: '700'
		};
	}
	setPostion() {
		this.position.set(Layout.canvasCenterX, Layout.canvasCenterY + Layout.matrixHeight * 0.35);
	}
	init() {
		this.text = new PIXI.Text();

		this.text.text = '0.00'; // Start display at 0.00
		this.setFontSize();
		this.text.anchor.set(0.5);

		this.setPostion();
		this.addChild(this.text);

		this.resize();
	}

	updateText(counterValue: number) {
		this.text.text = CurrencyUtils.format(counterValue ?? 0, false);
	}

	countTo(val: number, duration?: number, runPulse?: boolean) {
		this.init();
		return new Promise((res) => {
			this.setFontSize();
			this.updateText(val);
			waitForInterval(duration ?? 1500).then(() => {
				return res('done');
			});
		});
	}

	public resize(): void {
		this.setPostion();
		this.setFontSize();
	}
	public clear(): void {
		this.removeChildren();
	}

	endScene() {
		destroyChildren(this);
	}

	public destroy(options?: any): void {
		super.destroy(options);
	}
}
