import Background from './components/Background';
import GameOverlay from './components/GameOverlay';
import { Multiplier } from './components/Multiplier';
import { Reel } from './components/reels/Reel';

export enum BaseLayers {
	Bg,
	Reel,
	Intro,
	GameOverlay,
	Coins,
	Multiplier,
	BlurSlot
}

export class MainShared {
	private static _background: Background | null = null;
	private static _reels: Reel | null = null;
	private static _multiplier: Multiplier | null = null;
	private static _gameOverlay: GameOverlay | null = null;
	private static _initialized = false;

	static init() {
		this._background = new Background();
		this._multiplier = new Multiplier();
		this._gameOverlay = new GameOverlay();
		this._reels = new Reel();

		// Set z-index layers
		this._gameOverlay.zIndex = BaseLayers.GameOverlay;
		this._background.zIndex = BaseLayers.Bg;
		this._multiplier.zIndex = BaseLayers.Multiplier;
		this._reels.zIndex = BaseLayers.Reel;

		this._initialized = true;
	}
	static controlsController: undefined | AbortController;

	static addEvents() {
		console.log('addEvents added');
		this.controlsController = new AbortController();
	}
	static resize() {
		if (!this._initialized) return;

		this._reels?.resize();
		this._multiplier?.resize();
		this._gameOverlay?.resize();
	}
	static reset() {
		this._background = null;
		this._reels = null;

		this._initialized = false;
	}

	static get background(): Background {
		if (!this._background) {
			throw new Error('Background has not been initialized.');
		}
		return this._background;
	}

	static get multiplier(): Multiplier {
		if (!this._multiplier) {
			throw new Error('Multiplier has not been initialized.');
		}
		return this._multiplier;
	}
	static get gameOverlay(): GameOverlay {
		if (!this._gameOverlay) {
			throw new Error('gameOverlay has not been initialized.');
		}
		return this._gameOverlay;
	}

	static get reels(): Reel {
		if (!this._reels) {
			throw new Error('Reels have not been initialized.');
		}
		return this._reels;
	}

	static get initialized(): boolean {
		return this._initialized;
	}

	private static get reelMatrix() {
		return this.reels?.reelMatrix;
	}
	static get event() {
		return {
			rollSlot: this.reelMatrix?.reelSpin?.bind(this.reelMatrix),
			spinEnd: this.reelMatrix?.spinEnd?.bind(this.reelMatrix),

			spinError: this.reelMatrix?.spinError?.bind(this.reelMatrix)
		};
	}
	static destroy() {
		this.controlsController?.abort();
		this.controlsController = undefined;

		this._background?.destroy({ children: true });
		this._multiplier?.destroy({ children: true });
		this._reels?.destroy({ children: true });
		this._gameOverlay?.destroy({ children: true });

		this._background = null;
		this._multiplier = null;
		this._reels = null;
		this._gameOverlay = null;

		this._initialized = false;
	}
}
