import * as PIXI from 'pixi.js';
import { Layout } from '@/game/configuration/Layout';
import { GameConfig } from '@/game/configuration/Config';
import BaseSymbol from '../Symbol/symbols/BaseSymbol';
import type { TSymbolCodes } from '@/game/configuration/types';
import type ReelSlotBg from './ReelSlotBg';
import { getRandomRegularSymbol } from './ReelMatrix';
import { waitForInterval } from '@/game/utils/intervalWait';
import Symbol from '../Symbol/symbols/Symbol';

interface IReelReelSlot {
	reelIndex: number;
	x?: number;
	y?: number;
	initialSymbols: string[];
	slotBg: ReelSlotBg;
}

export default class ReelSlot extends PIXI.Container {
	reelHeight: number;
	reelMask!: PIXI.Graphics;
	symbolsContainer: PIXI.Container<BaseSymbol>;
	symbols: BaseSymbol[] = [];
	endSymbols: TSymbolCodes[] = [];

	reelIndex: number;
	spinInProgress: boolean = false;
	spinDuration: number = 0;
	endLevel: number = 0;
	tweening: any[] = [];

	private firstReelPosition = 0;
	private initialSymbols: TSymbolCodes[];
	private slotBg: ReelSlotBg;
	private endSymbolsAdded = false;

	constructor({ reelIndex, slotBg, initialSymbols, x = 0, y = 0 }: IReelReelSlot) {
		super();
		this.initialSymbols = initialSymbols as TSymbolCodes[];
		this.symbolsContainer = new PIXI.Container<BaseSymbol>();
		this.slotBg = slotBg;

		this.addChild(this.symbolsContainer);
		this.sortableChildren = true;
		if (GameConfig.REEL_COUNT_ROW % 2 === 0) {
			throw new Error('symbol row must be an odd number.');
		}

		this.reelIndex = reelIndex;
		this.reelHeight =
			Layout.reelWidth * GameConfig.REEL_COUNT_ROW +
			Layout.slotGap * (GameConfig.REEL_COUNT_ROW - 1);
		// Layout.reelWidth = width;

		this.position.set(x, y);
		// this.position.set(x, y - Layout.reelWidth);
		this.firstReelPosition = -(Layout.reelWidth + Layout.slotGap);

		this.init();
		this.addMask();
	}

	isAnySymbolPlaying() {
		return this.symbols.some((symbol) => symbol.isPlayingAnimation);
	}

	get reel_height() {
		return this.reelHeight - Layout.slotGap / 2;
	}
	get reel_width() {
		return Layout.reelWidth;
	}

	spin(tick: PIXI.Ticker, reelIndex: number) {
		if (this.spinEnded) return;

		if (!this.reelStartTime) {
			this.blurSymbols = true;
			this.reelStartTime = performance.now();
		}
		const endTime = performance.now();

		const duration = endTime - this.reelStartTime;

		const reelDur = GameConfig.REEL_DURATION * 0.5 - reelIndex * 10;
		const passLimit = duration >= reelDur;

		const timeToEnd = this.endSymbolsAvailable && (passLimit || GameConfig.IMMEDIATE_END);
		if (timeToEnd || GameConfig.IMMEDIATE_END_ERROR) {
			this.updateSpinEnd(tick);
		} else {
			this.spinRollRandomSymbols(tick);
		}
	}
	get endSymbolsAvailable() {
		return !!this.endSymbols.length;
	}
	addMask() {
		this.reelMask = new PIXI.Graphics()
			.rect(0, 0, Layout.reelWidth, this.reelHeight - Layout.slotGap / 2)
			.fill(0xff0000);
		this.reelMask.alpha = 0.24;
	}

	init() {
		let currY = this.firstReelPosition;

		let initialSymbols: TSymbolCodes[] = [
			getRandomRegularSymbol(),
			...this.initialSymbols,
			getRandomRegularSymbol()
		];
		for (let i = 0; i < GameConfig.REEL_COUNT_ROW + 2; i++) {
			const symbolType: TSymbolCodes = initialSymbols[i];
			const symbol = new Symbol({
				name: symbolType
			});

			symbol.setPosition(0, currY);

			currY += symbol.sym_height + Layout.slotGap;
			this.symbols.push(symbol);
			this.symbolsContainer.addChild(symbol);
		}
	}

	private get minYSymbolPosition() {
		const minYPosition = Math.min(
			...this.symbolsContainer.children.map((child: BaseSymbol) => child.y)
		);
		return minYPosition;
	}

	private addSymbolToArrTop(symbol: BaseSymbol) {
		this.symbols = this.symbols.filter((s) => s !== symbol);
		this.symbols.unshift(symbol);

		this.removeChild(symbol);
		this.symbolsContainer.addChildAt(symbol, 0);
	}

	spinEnded = false;

	spinRollRandomSymbols(ticker: PIXI.Ticker) {
		// Symbol Position and Recycling Logic
		if (!ticker) return;

		const { deltaTime } = ticker;
		this.symbols.forEach((symbol: BaseSymbol) => {
			if (symbol.destroyed) return;
			const isAtBottom = symbol.y > this.reelMask.height + Layout.slotGap;
			if (!isAtBottom) {
				symbol.updatePositionY(symbol.y + deltaTime);
			} else {
				this.randomSymbolToTop(symbol);
			}
		});
	}

	private randomSymbolToTop(symbol: BaseSymbol) {
		const topPosition = this.minYSymbolPosition - (symbol.sym_height + Layout.slotGap);
		const randomSymbol = getRandomRegularSymbol();

		symbol.setTexture(randomSymbol, this.blurSymbols);

		symbol.updatePositionY(topPosition);
		this.addSymbolToArrTop(symbol);
	}

	spinAddEndSymbols(ticker: PIXI.Ticker) {
		if (!ticker) return;
		if (!this.endSymbolsAdded) {
			this.blurSymbols = false;

			this.waitToEndSymbols().then(() => {});
			this.endSymbolsAdded = true;
		}
	}

	reelStartTime: number = 0;

	resetReelSlot() {
		this.spinEnded = false;
		this.endSymbols = [];
		this.sendSymbolsToParents();
		this.reelStartTime = 0;
		this.endSymbolsAdded = false;
	}

	updateSpinEnd(tick: PIXI.Ticker) {
		if (!this.endSymbolsAdded) {
			this.spinAddEndSymbols(tick);
			return;
		}

		if (this.endSymbolsAdded) {
			if (this.spinEnded) return;

			if (!tick) return;
			const { deltaTime } = tick;

			for (let i = this.symbols.length - 1; i >= 0; i--) {
				const symbol: BaseSymbol = this.symbols[i];
				if (symbol.destroyed) continue;

				let newPosition = symbol.y + deltaTime;
				const isAtBottom = symbol.y > this.reelMask.height + Layout.slotGap;

				if (!isAtBottom) {
					if (this.symbolPositions[i] !== undefined) {
						if (symbol.y > this.symbolPositions[i]) {
							symbol.updatePositionY(newPosition);
						} else {
							symbol.updatePositionY(Math.min(newPosition, this.symbolPositions[i]));
						}
						if (i === 3 && symbol.y === this.symbolPositions[i]) {
							this._onSymbolLand();
						}
					} else {
						if (newPosition) {
							const lastIdx = this.symbolPositions[this.symbolPositions.length - 1];
							if (newPosition > lastIdx) {
								const topPosition = this.minYSymbolPosition - (symbol.sym_height + Layout.slotGap);
								symbol.updatePositionY(topPosition);
							}
						}
						symbol.updatePositionY(newPosition);
					}
				} else if (this.symbolPositions[i] !== undefined) {
					if (symbol.y > this.symbolPositions[i]) {
						const topPosition = this.minYSymbolPosition - (symbol.sym_height + Layout.slotGap);
						symbol.updatePositionY(topPosition);
					}
				}
			}
		}
	}

	private _onSymbolLand() {
		this.spinEnded = true;
		this.reelStartTime = 0;
		this.endSymbols = [];
		this.endSymbolsAdded = false;
		this.symbols.map((symbol, j) => {
			if (this.symbolPositions[j]) {
				symbol.y = this.symbolPositions[j];
			}
			symbol.setUnblurredTex();
		});
		this.destroySymbolsOverMax().then(() => {});

		this.spinInProgress = false;
	}

	get symbolPositions() {
		return this.slotBg.positions;
	}

	setSymbolsVisible(visible = true) {
		this.symbols.map((symbol, i) => {
			symbol.killTweens();
			symbol.alpha = visible ? 1 : 0.5;
		});
	}
	playCombinationIdle(combinations: string | any[]) {
		return new Promise((resolve) => {
			this.setSymbolsVisible(false);
			const promises = this.symbols
				.filter((_symbol, i) => i > 0 && i < combinations.length + 1)
				.map(async (symbol, i) => {
					if (symbol instanceof BaseSymbol) {
						await symbol.combinationIdle(!!combinations[i]);
					}
				});
			Promise.all(promises).then(() => {
				this.symbols
					.filter((_symbol, i) => i > 0 && i < combinations.length + 1)
					.map(async (symbol, i) => {
						if (symbol instanceof BaseSymbol) {
							symbol.switchToParent(false);
						}
					});
				resolve('play-combination-complete');
			});
		});
	}

	sendSymbolsToParents() {
		this.setSymbolsVisible(true);
		this.symbols.map(async (symbol, i) => {
			if (symbol instanceof BaseSymbol) {
				symbol.switchToParent(false);
			}
		});
	}
	playCombinationMatch(combinations: string | any[]) {
		return new Promise((resolve) => {
			if (!combinations.length) {
				resolve('combination missing');
				return;
			}

			const promises = this.symbols
				.filter((_symbol, i) => i > 0 && i < combinations.length + 1)
				.map(async (symbol, i) => {
					if (symbol instanceof BaseSymbol) {
						await symbol.combinationMatch(!!combinations[i]);
					}
				});
			Promise.all(promises).then(() => {
				this.symbols
					.filter((_symbol, i) => i > 0 && i < combinations.length + 1)
					.map(async (symbol, i) => {
						if (symbol instanceof BaseSymbol) {
							symbol.switchToParent(false);
						}
					});
				resolve('play-combination-complete');
			});
		});
	}
	setFinalCombination(duration: number) {
		return new Promise((resolve) => {
			this.reelMask.zIndex = 0;

			this.symbols.forEach((symbol: BaseSymbol, i) => {
				symbol.zIndex = 1;

				const endSymbolPosition = (Layout.reelWidth + Layout.slotGap) * (i - 1);

				const reverseIndex = this.children.length - 1 - i;

				const adjustedDuration = duration + 0.05 * reverseIndex;
				symbol.updatePositionTween(
					endSymbolPosition,
					'back.out(1)',
					adjustedDuration,
					() => {
						const targetYPosition = symbol.position.y;
						const bottomSlot = this.reelHeight + Layout.slotGap + Layout.reelWidth;

						if (targetYPosition > bottomSlot) {
							this.symbols.splice(i, 1);
							symbol.visible = false;
							symbol?.destroy();
						}
					},
					() => {
						if (i === this.children.length - 1) {
							resolve('done');
						}
					}
				);
			});
		});
	}
	blurSymbols = true;
	waitToEndSymbols() {
		return new Promise((resolve) => {
			this.blurSymbols = false;
			if (this.endSymbols.length === 0 || this.endSymbolsAdded) {
				waitForInterval(1500).then(() => {
					resolve('skip adding');
				});
			} else {
				let endSymbols: TSymbolCodes[] = [...this.endSymbols];

				endSymbols.reverse();

				endSymbols.forEach((symbol, i) => {
					const endSymbol = new Symbol({
						name: symbol
					});
					const topMostY = this.minYSymbolPosition;
					const endSymbolY = topMostY - (Layout.reelWidth + Layout.slotGap);

					endSymbol.setPosition(0, endSymbolY);
					this.symbols.unshift(endSymbol);
					this.symbolsContainer.addChildAt(endSymbol, 0);

					if (i === endSymbols.length - 1) {
						resolve('done adding');
					}
				});
			}
		});
	}
	stopTicker() {
		this.spinInProgress = false;
	}

	updateRandomSymbols(deltaTime: number) {
		this.symbolsContainer.children.forEach((symbol: BaseSymbol, i) => {
			if (symbol.destroyed) return;
			const targetYPosition = symbol.position.y + deltaTime;

			if (targetYPosition < this.reelHeight + Layout.slotGap) {
				symbol.updatePositionY(targetYPosition);
			} else {
				const topPosition = this.symbols[0].position.y - Layout.reelWidth - Layout.slotGap;
				symbol.updatePositionY(topPosition);

				symbol.setTexture(getRandomRegularSymbol());

				this.symbols.pop();
				this.symbols.unshift(symbol);
			}
		});
	}

	loadEndSymbols(deltaTime: number) {
		return new Promise((resolve) => {
			this.symbols.forEach((symbol) => {
				const targetYPosition = symbol.position.y + deltaTime;

				if (targetYPosition < this.reelHeight) {
					symbol.updatePositionY(targetYPosition);
				} else {
					const topPosition = this.minYSymbolPosition - Layout.reelWidth - Layout.slotGap;
					symbol.updatePositionY(topPosition);

					const endSymbolName =
						this.endLevel === 0
							? getRandomRegularSymbol()
							: this.endSymbols[this.endSymbols.length - 1];

					symbol.setTexture(endSymbolName);

					this.endLevel++;
					this.symbols.pop();
					this.symbols.unshift(symbol);
				}
			});

			if (this.symbols.some((symbol) => symbol.lastSymbolReel)) {
				resolve('done');
			}
		});
	}

	destroySymbolsOverMax(): Promise<string> {
		return new Promise((res) => {
			const maxVisibleSymbols = GameConfig.REEL_COUNT_ROW + 2;
			const isSymbolsOverMax = this.symbols.length > maxVisibleSymbols;

			if (!isSymbolsOverMax) {
				return res('destroySymbolsOverMax skipped');
			}

			const symbolsToRemove: BaseSymbol[] = this.symbols.slice(maxVisibleSymbols);

			symbolsToRemove.forEach((symbol, i) => {
				symbol.destroy();
			});

			this.symbols.splice(maxVisibleSymbols);

			res('destroySymbolsOverMax done');
		});
	}

	stopAllTweens() {
		this.symbolsContainer.children.forEach((symbol: BaseSymbol) => {
			symbol.killTweens();
		});
	}

	putSymbolsInPosition(resolve: (arg0: string) => void) {
		let currY = this.firstReelPosition;
		this.symbols.forEach((symbol, i) => {
			const delay = 50 * Math.pow(1.1, this.reelIndex);
			symbol.updatePositionTween(
				currY,
				'back.out(1)',
				delay,
				() => {},
				() => {
					if (i === this.symbols.length - 1) {
						this.destroySymbolsOverMax().then(() => {
							resolve('done skipping');
						});
						this.spinInProgress = false;
					}
				}
			);
			if (!symbol.destroyed) currY += symbol.sym_height + Layout.slotGap;
		});
	}

	lerp(a1: number, a2: number, t: number): number {
		return a1 * (1 - t) + a2 * t;
	}

	backout(amount: number) {
		return (t: number) => --t * t * ((amount + 1) * t + amount) + 1;
	}

	resize() {
		this.firstReelPosition = -(Layout.reelWidth + Layout.slotGap);
		let currY = this.firstReelPosition;

		this.symbols.map((symbol) => {
			if (symbol instanceof BaseSymbol) {
				symbol.resize();
				symbol.y = currY;
				currY += symbol.sym_height + Layout.slotGap;
			}
		});
	}
}
