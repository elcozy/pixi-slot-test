import { animate } from 'motion';
import type { AnimationPlaybackControls } from 'motion/react';
import type { Ticker } from 'pixi.js';
import { Container } from 'pixi.js';
import { engine } from '../../getEngine';
import { Layout } from '@/game/configuration/Layout';
import { MainShared } from './MainShared';
import { GameConfig } from '@/game/configuration/Config';
import { waitFor } from '@/game/engine/utils/waitFor';
import { CustomEvents } from '@/game/utils/CustomEvents';
import { EControlsEv } from '@/events';

export class MainScreen extends Container {
	public static assetBundles = ['main', 'spines', 'tutorial', 'gamble'];

	public mainContainer: Container;

	private paused = false;

	constructor() {
		super();
		MainShared.init();

		MainShared.background.init();
		MainShared.reels.init();
		this.addChild(MainShared.background, MainShared.reels, MainShared.multiplier);

		this.mainContainer = new Container();
		this.addChild(this.mainContainer);

		CustomEvents.add(
			EControlsEv.On_SpinEndError,
			MainShared.reels.reelMatrix.spinError.bind(MainShared.reels.reelMatrix)
		);
		CustomEvents.add(
			EControlsEv.On_SpinEnd,
			MainShared.reels.reelMatrix.spinEnd.bind(MainShared.reels.reelMatrix)
		);

		CustomEvents.add(
			EControlsEv.On_SpinBtn,
			MainShared.reels.reelMatrix.reelSpin.bind(MainShared.reels.reelMatrix)
		);
		CustomEvents.add(
			EControlsEv.On_StopSpin,
			MainShared.reels.reelMatrix.skip.bind(MainShared.reels.reelMatrix)
		);

		console.log('engine ', engine());
	}

	public update(_time: Ticker) {
		if (this.paused && engine()?.screen) return;
	}

	public async pause() {
		this.mainContainer.interactiveChildren = false;
		this.paused = true;
	}

	public async resume() {
		this.mainContainer.interactiveChildren = true;
		this.paused = false;
	}

	/** Fully reset */
	public reset() {
		CustomEvents.removeListeners([
			EControlsEv.On_SpinEndError,
			EControlsEv.On_SpinEnd,
			EControlsEv.On_SpinBtn,
			EControlsEv.On_StopSpin
		]);
	}

	/** Resize the screen, fired whenever window size changes */
	public resize(width: number, height: number) {
		Layout.updateCanvasSize(width, height, 2);

		MainShared.background.resize(width, height);
		MainShared.reels.resize();
	}

	public async show(): Promise<void> {
		const elementsToAnimate = [MainShared.reels];

		let finalPromise!: AnimationPlaybackControls;

		MainShared.reels.pivot.y = -250;
		animate(MainShared.reels.pivot, { y: 0 }, { duration: 0.3, delay: 0.25, ease: 'backOut' });

		for (const element of elementsToAnimate) {
			element.alpha = 0;
			finalPromise = animate(element, { alpha: 1 }, { duration: 0.3, delay: 0.2, ease: 'backOut' });
		}

		waitFor(1).then(() => {
			CustomEvents.dispatch(EControlsEv.On_MainScreenLoaded);

			if (GameConfig.ROUND_RES) {
				MainShared.reels.reelMatrix.spinResume();
			}
		});
		return finalPromise;
	}
}
