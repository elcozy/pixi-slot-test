import { animate } from 'motion';
import type { ObjectTarget } from 'motion/react';
import { Container, Point, Rectangle, Sprite, Text, TextStyle, Texture } from 'pixi.js';
import { engine } from '../getEngine';
import gsap from 'gsap';

export function wrapInPromise(func: () => void) {
	return new Promise<void>((resolve) => {
		func();
		resolve();
	});
}

export class LoadScreen extends Container {
	public static assetBundles = ['preload'];

	private gameLoader: Container;
	private gameLoaderText: Container;

	private background: Sprite;
	private progress = 0;
	constructor() {
		super();
		this.zIndex = 5;
		this.gameLoader = new Container();

		this.background = this.createBg();
		this.addChild(this.background);

		this.gameLoaderText = this.createText();

		this.addChild(this.gameLoader);
		this.gameLoader.addChild(this.gameLoaderText);
	}

	private get gameSize() {
		return {
			height: engine()?.screen.height * 0.3,
			width: engine()?.screen.width * 0.3
		};
	}
	private get logoWidth() {
		return Math.min(this.gameSize.width * 0.85, 250);
	}

	private createText() {
		const { width, height } = this.gameSize;
		const textsContainer = new Container();

		const textStyle1 = new TextStyle({
			fontFamily: 'Gilroy Medium',
			fontSize: 140,
			fill: '#ffffff',
			align: 'center',
			letterSpacing: 2.5
		});

		const textContent1 = 'Loading...';
		const textSpine1 = new Text({ text: textContent1, style: textStyle1 });

		textsContainer.addChild(textSpine1);
		textsContainer.scale.set(this.logoWidth / textsContainer.width);
		textsContainer.position.set(
			width / 2 - textsContainer.width / 2,
			height - textsContainer.height - 5
		);

		textsContainer.zIndex = 2;

		return textsContainer;
	}

	private createBg() {
		const background = new Sprite({
			texture: Texture.from('loading-bg-desktop.png'),
			anchor: 0.5,
			zIndex: 0,
			label: 'LoadingBg',

			frame: new Rectangle(0, 0, 50, 50),
			trim: new Rectangle(0, 0, 50, 50)
		});

		const bgScale = Math.max(
			engine()?.screen.width / background.width,
			engine()?.screen.height / background.height
		);

		if (engine()?.screen.width < engine()?.screen.height) {
			background.anchor = new Point(0.65, 0.5);
		}
		background.scale.set(bgScale);

		return background;
	}
	private resizeBg() {
		this.background.scale.set(1);
		const { width: widthEngine, height: heightEngine } = engine().screen;

		const bgScale = Math.max(
			widthEngine / this.background.width,
			heightEngine / this.background.height
		);

		this.background.anchor = new Point(widthEngine < heightEngine ? 0.65 : 0.5, 0.5);
		this.background.scale.set(bgScale);
	}

	public onLoad(progress: number) {
		this.progress = progress;
	}

	public resize(width: number, height: number) {
		this.resizeBg();
		this.background.position.set(width * 0.5, height * 0.5);

		this.gameLoader.pivot.set(this.gameLoader.width * 0.5, this.gameLoader.height * 0.5);
		this.gameLoader.position.set(width * 0.5, height * 0.5);
	}

	public async playIntro() {
		await Promise.all([
			wrapInPromise(() => {
				if (this.gameLoaderText) {
					const tl = gsap.timeline();
					const xPos = this.gameLoaderText.x;
					this.gameLoaderText.x = -this.gameLoaderText.width;
					tl.to(this.gameLoaderText.position, {
						x: xPos,
						duration: 0.5,
						ease: 'elastic.out(1, 0.75)'
					});
				}
			})
		]);

		this.playLoading();
	}

	private async playLoading() {}

	public async playOutro() {
		if (this.gameLoaderText) {
			this.gameLoaderText.visible = false;
		}
	}

	public async show() {
		this.alpha = 1;
		this.playIntro();
	}

	public async hide() {
		this.playOutro();

		return animate(this, { alpha: 0 } as ObjectTarget<this>, {
			duration: 0.3,
			ease: 'linear',
			delay: 1
		});
	}
}
