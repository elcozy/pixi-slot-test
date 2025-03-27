import { Layout } from '@/game/configuration/Layout';
import type ReelSlot from './ReelSlot';
import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import { validateSwapIndices } from './utils/swapReels';
import { Log } from '@/game/utils/Logger';

export class ReelSwapper {
	private slotCurrState: ReelSlot[];
	private reelsToSwap: ReelSlot;

	private parent: PIXI.Container;
	private container: PIXI.Container;
	private movement: { from: number; to: number };
	swapTl!: gsap.core.Timeline;
	swapTweenTl!: gsap.core.Timeline;
	constructor(
		slotCurrState: ReelSlot[],
		movement: { from: number; to: number },
		container: PIXI.Container
	) {
		this.slotCurrState = slotCurrState;
		this.parent = container.parent;
		this.container = container;
		this.movement = movement;
		this.reelsToSwap = slotCurrState[movement.from];
	}

	public setupTimeline() {
		const { from: indexA, to: indexB } = this.movement;

		const reel2Position = this.parent.toLocal(this.slotCurrState[indexB].getGlobalPosition());
		this.swapTl = gsap.timeline({ paused: true });
		this.swapTweenTl = gsap.timeline({
			repeat: 0,
			repeatDelay: 0.2,
			onInterrupt: () => {
				// blackLayerCover.destroy();
			},
			paused: true,
			onComplete: () => {},

			onStart: () => {
				const localPosition = this.parent.toLocal(this.reelsToSwap.getGlobalPosition());
				this.parent.addChild(rectContainer);
				rectContainer.zIndex = this.slotCurrState.length + 1;

				rectContainer.position.copyFrom(localPosition);
				rectContainer.addChild(this.reelsToSwap);

				this.reelsToSwap.x = 0;
			}
		});
		const { rectContainer } = this.createMaskedContainer();

		const reelSwapX = reel2Position.x;
		const reelSwapY = reel2Position.y;

		const scaleFactor = 1.04;
		const movementTime = Math.min(Math.abs(indexA - indexB) / 2, 1);
		Log.log('validate', movementTime);

		const durations = [0.25, movementTime, 0.5];

		this.swapTl.to(
			rectContainer,
			{
				keyframes: [
					{
						pixi: {
							scale: scaleFactor,
							x: `-=${(rectContainer.width * (scaleFactor - 1)) / 2}`,
							y: `-=${(rectContainer.height * (scaleFactor - 1)) / 2}`
						},
						duration: durations[0]
					},
					{
						pixi: {
							x: reelSwapX + (rectContainer.width * (scaleFactor - 1)) / 2
						},
						duration: durations[1]
					},
					{
						pixi: {
							scale: 1,
							x: reelSwapX,
							y: reelSwapY
						},
						duration: durations[2]
					}
				],
				onComplete: () => {
					this.container.addChild(this.reelsToSwap);
					this.reelsToSwap.mask = null;
					this.reelsToSwap.zIndex = indexA;

					const reelLocal = this.container.toLocal(rectContainer.getGlobalPosition());

					this.reelsToSwap.position.copyFrom(reelLocal);
					rectContainer.destroy();
				}
			},
			0
		);
	}
	play(): Promise<unknown> {
		return new Promise((res) => {
			const { from: indexA, to: indexB } = this.movement;
			const validate = validateSwapIndices(indexA, indexB, this.slotCurrState);
			if (validate) {
				res(validate);
				return;
			}

			this.setupTimeline();

			this.swapTweenTl.eventCallback('onComplete', () => {
				res({ status: 'done' });
			});

			this.swapTweenTl.add(this.swapTl.play());
			this.swapTweenTl.play();
		});
	}
	playInstant(): Promise<unknown> {
		return new Promise((res) => {
			const { from: indexA, to: indexB } = this.movement;
			const validate = validateSwapIndices(indexA, indexB, this.slotCurrState);
			if (validate) {
				res(validate);
				return;
			}

			const reel2Position = { ...this.slotCurrState[indexB].position };
			const reel1Position = { ...this.slotCurrState[indexA].position };

			this.slotCurrState[indexB].x = reel1Position._x;
			this.slotCurrState[indexA].x = reel2Position._x;

			res({ status: 'done' });
		});
	}

	createMaskedContainer(): {
		rectContainer: PIXI.Container;
		rectRectMask: PIXI.Graphics;
	} {
		const rectContainer = new PIXI.Container();
		const rectRectMask = new PIXI.Graphics();
		const radius = 12;
		const { from: indexA, to: _indexB } = this.movement;

		rectRectMask
			.roundRect(0, 0, Layout.reelWidth, this.reelsToSwap.reelHeight, radius)
			.fill(0xffd952);

		rectContainer.addChild(rectRectMask);
		rectContainer.label = `rectContainer_${indexA}`;
		rectRectMask.label = `rectRectMask_${indexA}`;

		rectContainer.addChild(rectRectMask);

		return { rectContainer, rectRectMask };
	}
}
