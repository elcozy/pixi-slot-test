import { gsap } from 'gsap';
import * as PIXI from 'pixi.js';
import { destroyChildren } from '@/game/utils/destroyChidrenInContainer';
import { Layout } from '@/game/configuration/Layout';

enum Layers {
	Spinner,
	WinSpine
}

export default class GameOverlay extends PIXI.Container {
	private tl: gsap.core.Timeline | undefined;
	private background: PIXI.Graphics | undefined;

	init() {
		this.createBg();
		this.createTl();
		this.setTl();
	}
	createBg() {
		if (!this.background) {
			this.background = new PIXI.Graphics();
			this.addChild(this.background);
		}

		this.background.clear().rect(0, 0, Layout.canvasSize.width, Layout.canvasSize.height).fill({
			color: 0x000000,
			alpha: 0.5
		});
		this.background.alpha = 0;
	}

	createTl() {
		if (this.tl) {
			this.tl.kill();
		}
		this.tl = gsap.timeline({
			repeat: 0,
			autoRemoveChildren: true,
			autoStart: true,
			onComplete: () => {
				// this.tl?.kill();
				this.tl = undefined;
			}
		});
	}

	clear() {
		if (this.background) {
			this.background.alpha = 0;
			this.endScene();
		}
	}
	setTl(duration = 1): Promise<string> {
		return new Promise((res, rej) => {
			if (!this.background) return rej('background NOT FOUND');

			this.tl?.to(this.background, {
				duration: duration,
				pixi: {
					alpha: 1
				},
				onStart: () => {
					if (this.background) this.background.alpha = 0;
				},
				onComplete: () => {
					res('scene cleared');
				}
			});
		});
	}
	resize() {
		if (this.background) {
			this.background.clear().rect(0, 0, Layout.canvasSize.width, Layout.canvasSize.height).fill({
				color: 0x000000,
				alpha: 0.5
			});
		}
	}

	endScene() {
		destroyChildren(this);
		this.tl = undefined;
		this.background = undefined;
	}
	destroy(options?: PIXI.DestroyOptions | undefined): void {
		super.destroy(options);

		this.tl = undefined;
		this.background = undefined;
	}
}
