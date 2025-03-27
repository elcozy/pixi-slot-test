import { Container, Graphics, Rectangle, type DestroyOptions } from 'pixi.js';
import { GameConfig } from '@/game/configuration/Config';
import { engine } from '@/game/app/getEngine';

export default class Background extends Container {
	bgGraphics: Graphics;

	constructor() {
		super();
		this.bgGraphics = new Graphics();
	}

	init() {
		this.addChild(this.bgGraphics);
		this.bgGraphics
			.rect(0, 0, engine()?.screen.width, engine()?.screen.height)
			.fill(GameConfig.SKY_BGCOLOR);
		this.bgGraphics.alpha = 0;
		this.setBgBounds();

		this.interactiveChildren = false;
		this.interactive = false;
	}

	setBgBounds() {
		this.boundsArea = new Rectangle(0, 0, engine()?.screen.width, engine()?.screen.height);
	}

	public resize(width: number, height: number) {
		this.setBgBounds();
		this.bgGraphics
			.clear()
			.rect(0, 0, engine()?.screen.width, engine()?.screen.height)

			.fill(GameConfig.SKY_BGCOLOR);
	}

	destroy(options?: DestroyOptions | undefined): void {
		super.destroy(options);
	}
}
