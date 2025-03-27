import * as PIXI from 'pixi.js';
import ReelSlot from './ReelSlot';
import { GameConfig } from '@/game/configuration/Config';
import { Layout } from '@/game/configuration/Layout';
import { symbolsCodes } from '@/game/configuration/types';
import { getInitialSymbols, regularSymbolsList } from '@/game/utils/getInitialSymbols';
import type { TSymbolCodes, IPlayRes } from '@/game/utils/types';

import ReelSlotBg from './ReelSlotBg';
import { ReelSwapper } from './ReelSwapper';
import { playCombinations } from './utils/playCombinations';
import { WinAnimationTiers } from '../../WinAnimationTiers';
import { Log } from '@/game/utils/Logger';
import { isObjectEmpty } from '@/game/utils';
import { CustomEvents } from '@/game/utils/CustomEvents';
import { EControlsEv } from '@/events';

type TReelMatrix = PIXI.ContainerOptions & {
	initialSymbols?: TSymbolCodes[][];
};

interface IWinTier {
	betAmount: number; // betAmount response  moxie playServer
	winAmount: number; // winAmount response from moxie server
}

export enum EWinTiers {
	NoWin = 'NoWin',
	NormalTier1 = 'NormalTier1'
}

export const getWinValue = ({ betAmount, winAmount }: IWinTier) => {
	const winVal = winAmount / betAmount;
	return winVal;
};
export const getWinTier = ({ betAmount, winAmount }: IWinTier): EWinTiers => {
	return winAmount ? EWinTiers.NormalTier1 : EWinTiers.NoWin;
};

export class ReelMatrix extends PIXI.Container {
	_slots: Record<number, ReelSlot> = {};
	_slotsBg: Record<number, ReelSlotBg> = {};
	_slotsBgPixi: PIXI.Container;
	private speed: number;
	private isSpinning: boolean = false;
	public endSymbols: string[][];
	public combinationSymbols: (boolean | number)[][] = [];
	private swapTweenTl: gsap.core.Timeline | undefined;
	private initialSymbols: TSymbolCodes[][] | null = null;

	constructor(options?: TReelMatrix) {
		super(options);
		this.initialSymbols = options?.initialSymbols ?? null;
		this._slots = {};
		this._slotsBg = {};
		this.speed = 0;
		this.isSpinning = false;
		this.endSymbols = [];
		this._slotsBgPixi = new PIXI.Container({
			// zIndex:EReelSlot.SymbolBG
		});
		this.addChild(this._slotsBgPixi);
	}

	get initialView() {
		if (this.initialSymbols) {
			return this.initialSymbols;
		}
		if (!isObjectEmpty(GameConfig.ROUND_RES?.baseGame ?? {})) {
			// console.log('GameConfig.ROUND_RES', GameConfig.ROUND_RES);
			return GameConfig.ROUND_RES?.baseGame.initialSymbolView ?? getInitialSymbols();
		}
		return getInitialSymbols();
	}
	init() {
		let currX = 0;
		// const reelInitialView = getInitialSymbols();
		const reelInitialView = this.initialView;
		// for (let i = 0; i < 2; i++) {
		for (let i = 0; i < GameConfig.REEL_COUNT_COL; i++) {
			const slotBg = new ReelSlotBg();

			const slot = new ReelSlot({
				reelIndex: i,
				x: currX,
				y: 0,
				initialSymbols: reelInitialView[i],
				slotBg
			});

			currX += slot.reel_width + Layout.slotGap;
			this._slots[i] = slot;
			this._slotsBg[i] = slotBg;

			this.addChild(slot);
			this._slotsBgPixi.addChild(slotBg);

			// this.zIndex = Layers.Reel;
			// reel.visible = false;
		}
		this.position.set(...Layout.matrixPosition);

		document.addEventListener('symbols-alpha-reset', this.resetSymbolsAlpha.bind(this));
	}

	get slots() {
		return this._slots;
	}
	get container() {
		return this;
	}

	isBlurred: boolean = false;
	blurNonSwaps: gsap.core.Timeline | undefined;
	blackLayerCover: PIXI.Graphics | undefined;

	swapReels(swaps: { from: number; to: number }[], instant = false) {
		return new Promise((res, rej) => {
			if (this.swapTweenTl || this.blurNonSwaps) {
				res('in progress');
				return;
			}

			const swapsPromises = swaps.map((reelIdx) => {
				const reelSwapper = new ReelSwapper(this.slotArr, reelIdx, this);
				if (instant) {
					return reelSwapper.playInstant();
				} else {
					return reelSwapper.play();
				}
			});
			Promise.all(swapsPromises)
				.then(() => {
					const reelsToSwapCurr = { ...this._slots };

					swaps.forEach(({ from, to }) => {
						if (from !== to) {
							const fromReel = reelsToSwapCurr[from];
							this._slots[to] = fromReel;
						}
					});

					res({ status: 'done' });
				})
				.catch(rej);
		});
	}

	addEndSymbols(endSymbols: TSymbolCodes[][]) {
		if (endSymbols) {
			this.slotArr.map((slot, i) => {
				const randomLetters = Array.from({ length: i }, () => {
					const randomIndex = Math.floor(Math.random() * symbolsCodes.length);
					return symbolsCodes[randomIndex];
				});

				const zArray = Array(i).fill('Z');

				// const extraLettersArray = zArray;
				const extraLettersArray = randomLetters; //zArray
				// slot.endSymbols = [  ...endSymbols[i],  ...extraLettersArray];
				slot.endSymbols = [
					getRandomRegularSymbol(),
					...endSymbols[i],
					getRandomRegularSymbol(),
					...extraLettersArray
				];
			});
		}
	}

	tickerSpinning: PIXI.Ticker | null = null;

	reelSpin() {
		console.log('reelSpin EControlsEv');
		return new Promise((resolve) => {
			this.endSymbolsAdded = false;

			if (this.isSpinning) {
				const msg = 'spinning';
				Log.log('msg', msg);
				if (this.isSpinning) {
					this.skip();
				}
				return resolve(msg);
			}
			this.speed = GameConfig.REEL_SPEED;
			this.isSpinning = true;
			GameConfig.ROUND_RES = null;
			GameConfig.IMMEDIATE_END = false;
			GameConfig.IMMEDIATE_END_ERROR = false;
			WinAnimationTiers.clear();
			this.tickerSpinning = new PIXI.Ticker();
			this.tickerSpinning!.speed = GameConfig.REEL_SPEED;

			CustomEvents.dispatch(EControlsEv.Emit_SpinAnimStart);

			this.abortCombinations();
			this.slotArr.map(async (slot, index) => {
				// if (index === 0) {
				slot.resetReelSlot();
				// }
			});
			let timeSpent = 0;

			const slotDelays = this.slotArr.map((_, index) => ({
				startDelay: index * 100, // Delay per column in milliseconds
				elapsedTime: 0, // Tracks elapsed time for each slot
				started: false // Flags if the spin has started
			}));
			this.startTime = performance.now();

			this.tickerSpinning.add((tick: PIXI.Ticker) => {
				// this.tickerSpinning!.speed = GameConfig.REEL_SPEED;
				timeSpent += 1;
				this.playSpinAudio(tick);

				this.slotArr.map((slot, index) => {
					// if (index === 0) {

					const slotDelay = slotDelays[index];

					slotDelay.elapsedTime += tick.deltaTime;

					if (slotDelay.elapsedTime >= slotDelay.startDelay) {
						slotDelay.started = true;
					}

					slot.spin(tick, index);
				});

				const allSpinsEnded = this.slotArr.every((slot) => slot.spinEnded);

				if (allSpinsEnded) {
					this.stop();
					console.log('All spins have ended');
					CustomEvents.dispatch(EControlsEv.Emit_SpinAnimDone);		
					this.postSpinEnd();
				}
			});
			this.tickerSpinning.start();
		});
	}

	get slotBgArr(): ReelSlotBg[] {
		return Object.values(this._slotsBg);
	}
	get slotArr(): ReelSlot[] {
		return Object.values(this._slots);
	}

	abortCombinations() {
		if (this.abortCombController) {
			console.warn('Operation should abort');

			this.abortCombController.abort();
		}
	}
	startTime: number = 0;
	spinError() {
		console.error('spinError');
		GameConfig.IMMEDIATE_END = true;
		GameConfig.IMMEDIATE_END_ERROR = true;
	}
	spinResume() {
		console.log('spinResume play');

		return new Promise((resolve, rej) => {
			this.endSymbolsAdded = true;

			this.abortCombinations();

			this.isSpinning = true;

			const game = GameConfig.ROUND_RES;

			const initialSymbolView = game?.baseGame.initialSymbolView;
			console.log('game?.baseGame', game?.baseGame);
			// setRoundInProgress(!!initialSymbolView);
			if (!initialSymbolView) {
				console.error('initialSymbolView missing', game);
				return rej(new Error('initialSymbolView missing'));
			}

			this.addEndSymbols(initialSymbolView);

			if (!initialSymbolView.length) {
				// setRoundInProgress(false);
				console.error('initialSymbolView.len missing');
				return rej(new Error('initialSymbolView len missing'));
			}

			const endTime = performance.now();
			const completionTime = endTime - this.startTime;

			console.log(`Spin Completion Time: ${completionTime.toFixed(2)} ms`);
			// setSpinStopState('STOPPING');

			const handleSpinProcess = async () => {
				const response = GameConfig.ROUND_RES?.baseGame;
				if (response) {
					const { paylines, reelSwaps, totalWin, betAmount } = response;

					if (reelSwaps.length) {
						await this.swapReels(reelSwaps);
					}

					if (paylines[0]?.length) {
						GameConfig.AUTOPLAY_DELAY = GameConfig.AUTOPLAY_DELAY_WIN;

						this.abortCombController = new AbortController();
						const winTier = getWinTier({
							betAmount,
							winAmount: totalWin
						});

						await Promise.all([
							playCombinations(this, false),
							// playCombinations(this, !isAutoActive()),
							this.winAnimation(winTier)
						]);

						CustomEvents.dispatch(EControlsEv.Emit_WinCountUpDone);

						this.combinationSymbols = [];
					}
				}

				if (GameConfig.ROUND_RES) {
					const res = GameConfig.ROUND_RES;

					if (res.currentState) {
						// setRoundState(res.currentState);
					}
				}

				this.isSpinning = false;
				// setRoundInProgress(false);
				// setSpinStopState('INACTIVE');
				GameConfig.IMMEDIATE_END = false;

				CustomEvents.dispatch(EControlsEv.Emit_SpinAnimDone);

				resolve('done resume');
			};

			handleSpinProcess().catch((err) => {
				console.error('Error in spinResume:', err);
				resolve('done with err');
			});
		});
	}

	endSymbolsAdded = false;

	private lastAudioTime = 0;

	playSpinAudio(tick: PIXI.Ticker) {
		if (!tick) return;

		const speedLevel = 40 / tick.speed;
		// const speedLevel = GameConfig.REEL_SPEED_NORMAL / tick.speed;
		const audioInterval = 76 * (speedLevel > 1 ? 3 : 1);

		const currentTime = Date.now();

		if (currentTime - this.lastAudioTime >= audioInterval) {
			this.lastAudioTime = currentTime;
		}
	}

	spinEnd(e: { detail: IPlayRes<true> }) {
		const { detail: game } = e;
		GameConfig.ROUND_RES = game;
		return new Promise((resolve) => {
			if (!this.isSpinning) {
				const msg = 'not-spinning';
				Log.log('msg', msg);
				return resolve(msg);
			}

			const initialSymbolView = game?.baseGame?.initialSymbolView;
			console.log('game?.baseGame', game);

			if (!initialSymbolView) {
				// setRoundInProgress(false);
				console.error('initialSymbolView missing', game);
				return;
			}
			if (this.endSymbolsAdded) return resolve('this.endSymbolsAdded');
			if (!initialSymbolView) return resolve('initialSymbolView missing');
			this.endSymbolsAdded = true;
			this.isSpinning = true;

			if (!initialSymbolView.length) {
				const msg = 'initialSymbolView.len missing';
				console.error(msg);
				return resolve(msg);
			}
			this.addEndSymbols(initialSymbolView);

			const completionTime = performance.now() - this.startTime;

			Log.log(`Spinend Completion Time: ${completionTime.toFixed(2)} ms`);
			resolve('done');
		});
	}

	async postSpinEnd() {
		const endTime = performance.now();
		const completionTime = endTime - this.startTime;

		console.log(`Spin Completion Time: ${completionTime} ms`);		

		const response = GameConfig.ROUND_RES?.baseGame;
		if (response) {
			const { paylines, reelSwaps, totalWin, betAmount } = response;
			if (reelSwaps.length) {
				await this.swapReels(reelSwaps);
			}
			if (paylines[0].length) {
				GameConfig.AUTOPLAY_DELAY = GameConfig.AUTOPLAY_DELAY_WIN;

				this.abortCombController = new AbortController();

				const winTier = getWinTier({
					betAmount,
					winAmount: totalWin
				});

				await Promise.all([playCombinations(this, false), this.winAnimation(winTier)]);
				// await Promise.all([playCombinations(this, !isAutoActive()), this.winAnimation(winTier)]);

				this.combinationSymbols = [];
				Log.log('playCombinations done', 'this.isSpinning', this.isSpinning);
				CustomEvents.dispatch(EControlsEv.Emit_WinCountUpDone);
			}
		}
		// resolve('done spinning');
		if (GameConfig.ROUND_RES) {
			const res = GameConfig.ROUND_RES;
			const newBalance = res.balance + res.baseGame.totalWin;

			// balance.set(res.balance);

			if (res.currentState) {
				// setRoundState(res.currentState);
			}
		}
		this.isSpinning = false;

		// setRoundInProgress(false);
		// setSpinStopState('INACTIVE');
		GameConfig.IMMEDIATE_END = false;

		CustomEvents.dispatch(EControlsEv.Emit_SpinAnimDone);
	}

	abortCombController: AbortController | null = null;
	resetSymbolsVisibleStates() {
		this.slotArr.map((slot) => {
			slot.setSymbolsVisible(true);
		});
	}

	stop() {
		this.tickerSpinning?.stop();
		this.tickerSpinning?.destroy();
		this.tickerSpinning = null;

		this.isSpinning = false;
		this.speed = 0;
	}
	skip() {
		GameConfig.IMMEDIATE_END = true;
	}

	winAnimation(tier: EWinTiers): Promise<void | string> {
		if (tier === EWinTiers.NoWin) return Promise.resolve('no win');
		return WinAnimationTiers[tier]();
	}

	resetSymbolsAlpha() {
		this.slotArr.map((slot) => {
			slot.setSymbolsVisible();
		});
	}

	public update(delta: number): void {
		if (!this.isSpinning) return;
	}

	resize() {
		let currX = 0;
		this.slotArr.map((child, i) => {
			if (child instanceof ReelSlot) {
				child.resize();
				child.x = currX;

				const bg = this.slotBgArr[i];

				if (bg) {
					bg.resize();
					bg.x = currX;
				}

				currX += child.reel_width + Layout.slotGap;
			}
		});
	}

	destroy(options?: PIXI.DestroyOptions) {
		this.abortCombController?.abort();
		this.abortCombController = null;
		// this.controlsController?.abort();
		// this.controlsController = undefined;
		document.removeEventListener('symbols-alpha-reset', this.resetSymbolsAlpha.bind(this));

		super.destroy(options);
	}
}

export const getRandomRegularSymbol = (): TSymbolCodes => {
	return regularSymbolsList()[Math.floor(Math.random() * regularSymbolsList().length)];
};
