import { Spine } from '@pixi/spine-pixi';
import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';
import { Layout } from '@/game/configuration/Layout';
import { moveChildToContainer } from '@/game/utils/moveChildToContainer';
import { Reel, ReelLayers } from '../../reels/Reel';
import { findSymbol } from '@/game/configuration';
import type { TSymbolCodes } from '@/game/configuration/types';

export enum ESymbols {
	Frame,
	Glow1,
	Glow2,
	Sparks,
	Symbol,
	WildText
}
export interface ISymbol {
	name: TSymbolCodes;
}

const bgName = 'midvalue1';
export default abstract class BaseSymbol extends PIXI.Container {
	symbol: PIXI.Sprite | Spine;
	symbolBounds: PIXI.Rectangle;
	symbolName: string;
	symbolValue: string;
	params: ISymbol;
	lastSymbolReel: boolean = false;
	isCombination = false;

	isPlayingAnimation = false;
	symbolContainer: PIXI.Container;
	reelClass: Reel;

	protected shakeTween?: gsap.core.Tween;
	protected shakeTweenRepeat?: gsap.core.Timeline;
	protected shakeInProgress = false;

	candyName: string;
	constructor(props: ISymbol) {
		super();
		this.params = props;

		const candyName = findSymbol(props.name).asset;
		this.candyName = candyName;
		if (!props.name) {
			console.warn('extractCandyTypes', extractStringIdx(candyName, 1), candyName);
			throw new Error('symbol name missing');
		}
		this.label = props.name;
		this.symbolValue = extractStringIdx(candyName, 1);
		this.symbolContainer = new PIXI.Container();
		this.symbolContainer.label = candyName;
		this.addChild(this.symbolContainer);
		this.symbolBounds = new PIXI.Rectangle(0, 0, Layout.reelWidth, Layout.reelWidth);
		// this.symbolBorder = this.getSymBorder();
		// this.texturesBg = PIXI.Texture.from(this.symbolBorder);
		this.reelClass = this.parent as Reel;

		this.symbolName = candyName;

		this.sortableChildren = true;
		// texture.
		if (this.symbolValue === 'wild') {
			this.symbol = Spine.from({
				skeleton: 'wild.json',
				atlas: 'wild.atlas',
				// scale: 0.5,
				scale: 1
			});
		} else {
			this.symbol = new PIXI.Sprite(this.getCandyTex(candyName));
			this.symbol.anchor.set(0.5);
		}
		this.symbol.label = this.label + '_symbol';

		this.symbolContainer.addChild(this.symbol as PIXI.Sprite);
		this.setSymbolSize(Layout.reelWidth);

		this.on('anim:combinationMatch', this._combinationMatch);

		this.symbol.zIndex = ESymbols.Symbol;

		// this.tint = 0xd3d3d3;

		// this.alpha = 0.5;
	}

	getCandyTex(candyName: string): PIXI.Texture {
		let texName = candyName;

		const assetsMap = (PIXI.Assets.cache as any)._cache as Map<string, PIXI.Texture>;
		const candyNameTexExist = assetsMap.has(texName);
		if (candyNameTexExist) {
			return PIXI.Texture.from(texName);
		}
		return PIXI.Texture.from(candyName);
	}
	get sym_height() {
		return Layout.reelWidth;
	}
	get sym_width() {
		return Layout.reelWidth;
	}
	createSprite(texture: string, anchor: number, label?: string) {
		const sprite = new PIXI.Sprite(PIXI.Texture.from(`${texture}`));
		sprite.label = label ?? 'texture';
		sprite.anchor.set(anchor);

		this.symbolContainer.addChild(sprite);

		return sprite;
	}
	//TODO: remove this method

	isInParent = true;
	currZIndex: number | undefined;
	tempOnClickShake() {
		this.isCombination = true;
		this.eventMode = 'static';
		this.cursor = 'pointer';
		this.on('pointerdown', () => {
			this.reelClass = this.parent.parent.parent.parent as Reel;
			this.combinationMatch(true);
		});
	}

	switchToParent(remove: boolean) {
		if (this.destroyed) return;
		// Log.log(this.symbolBounds, this.symbolBounds.getBounds());
		if (remove) {
			if (this.isInParent) {
				this.currZIndex = this.zIndex;
				this.reelClass = this.parent.parent.parent.parent as Reel;
				moveChildToContainer(this.reelClass, this.symbolContainer);
				// this.mask = null
				this.isInParent = false;
				this.symbolContainer.zIndex = ReelLayers.Symbols;
			}
		} else {
			moveChildToContainer(this, this.symbolContainer);
			if (this.currZIndex) {
				this.symbolContainer.zIndex = this.currZIndex;
				this.currZIndex = undefined;
			}
			this.symbolContainer.position.set(0);
			this.isInParent = true;
		}
	}

	getSymGlow() {
		return {
			glow1: 'glow.png',
			glow2: 'glow2.png',
			spark: 'spark.png'
		};
	}
	setTexture(symbolCode: TSymbolCodes, spinInProgress = false) {
		if (this.symbol instanceof PIXI.Sprite) {
			const candyName = findSymbol(symbolCode).asset;
			this.candyName = candyName;
			this.label = symbolCode;
			this.symbolValue = extractStringIdx(this.candyName, 1);

			// this.texturesBg = PIXI.Texture.from(this.symbolBorder);

			this.symbol.texture = this.getCandyTex(candyName);

			this.symbol.scale.set(1, 1);
			this.setSymbolSize(this.sym_width);
		}
	}
	setUnblurredTex() {
		if (this.symbol instanceof PIXI.Sprite) {
			this.setTexture(this.label as TSymbolCodes, false);
		}
	}
	setPosition(x: number, y: number) {
		this.symbolBounds.x = x;
		this.symbolBounds.y = y;
		this.position.copyFrom(this.symbolBounds);
	}

	setSymbolSize(size: number = this.sym_width) {
		const isHighVal = ['wild', 'highvalue'].includes(this.symbolValue);
		const isMidVal = ['midvalue1', 'midvalue2', 'midvalue3'].includes(this.symbolValue);

		const sizePercentage = isHighVal ? 0.79 : isMidVal ? 0.75 : 0.7;

		this.symbol.position.set(size / 2);
		if (this.symbol instanceof Spine) {
			const symbolData = this.symbol.skeleton.data;
			const scale = Math.min(
				(size * sizePercentage) / symbolData.width,
				(size * sizePercentage) / symbolData.height
			);
			this.symbol.scale.set(scale);
			this.symbol.pivot.set(
				-(symbolData.x + symbolData.width / 2),
				-(symbolData.y + symbolData.height / 2)
			);
		} else if (this.symbol instanceof PIXI.Sprite) {
			this.symbol.scale.set(
				Math.min(
					(size * sizePercentage) / this.symbol.texture.width,
					(size * sizePercentage) / this.symbol.texture.height
				)
			);
		}
	}

	updatePositionY(targetPosition: number) {
		if (this.destroyed) return;

		this.position.y = targetPosition;
		this.symbolBounds.y = targetPosition;
	}
	private positionTween?: gsap.core.Tween;

	updatePositionTween(
		targetPositionY: number,
		ease: gsap.EaseString | gsap.EaseFunction = 'back.out4',
		time: number = 1,
		onUpdate: (e: any) => void = () => {},
		onComplete: (e: any) => void = () => {}
	) {
		if (!this.position) return;
		const timeTween = time / 100;
		// const currPositionY = this.position.y;

		this.positionTween = gsap.to([this.position, this.symbolBounds], {
			y: targetPositionY,
			duration: timeTween,

			ease,
			onUpdate,
			onUpdateParams: [
				{
					x: this.x,
					y: this.y
				}
			],
			onCompleteParams: [
				{
					x: this.x,
					y: this.y
				}
			],
			onComplete,
			onInterrupt: () => {
				if (this.positionTween) {
					this.positionTween.kill();
					this.positionTween = undefined;
				}
			}
		});
	}

	setGlowStarVisibility(isVisible: boolean) {
		return this; // for chaining purpose
	}
	setGlowSpinnerVisibility(isVisible: boolean) {
		return this; // for chaining purpose
	}

	killTweens() {
		if (this.positionTween) {
			this.positionTween.kill();
			this.positionTween = undefined;
		}
		if (this.shakeTween) {
			this.shakeTween.kill();
			this.shakeTween = undefined;
		}
		if (this.shakeTweenRepeat) {
			this.shakeTweenRepeat.kill();
			this.shakeTweenRepeat = undefined;
			this.shakeInProgress = false;
		}
	}
	handleShakeProgress(extraAction?: () => void) {
		if (this.shakeInProgress && this.shakeTweenRepeat) {
			this.shakeTweenRepeat.kill();
			this.shakeTweenRepeat = undefined;
			this.shakeInProgress = false;

			this.symbolReset();
			if (extraAction) extraAction();
		}
	}

	combinationIdle(isCombination: boolean): Promise<any> {
		return new Promise((resolve) => {
			if (isCombination) {
				this.switchToParent(true);
			}
			this.isPlayingAnimation = true;
			this._combinationIdle(isCombination).then(() => {
				if (isCombination) {
					this.switchToParent(false);
				}
				this.isPlayingAnimation = false;
				resolve('done');
			});
		});
	}
	combinationMatch(isCombination: boolean, playIdle: boolean = false): Promise<any> {
		return new Promise((resolve) => {
			if (isCombination) {
				this.switchToParent(true);
			}
			this.isPlayingAnimation = true;

			this._combinationMatch(isCombination).then(() => {
				if (isCombination) {
					this.switchToParent(false);
				}
				if (playIdle) {
					this.combinationIdle(isCombination);
				} else {
					this.isPlayingAnimation = false;
				}
				resolve('done');
			});
		});
	}

	protected abstract _combinationIdle(isCombination: boolean): Promise<any>;
	protected abstract _combinationMatch(isCombination: boolean): Promise<any>;

	symbolReset() {}
	resize() {}
	destroy(options?: PIXI.DestroyOptions): void {
		this.killTweens();
		super.destroy(options);
	}
}

function extractStringIdx(input: string, index = 1): string {
	if (!input) return '';
	const parts = input.split('_');
	return `${parts[index]}`;
}
