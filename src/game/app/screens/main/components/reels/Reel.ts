import * as PIXI from 'pixi.js';
import { ReelMatrix } from './ReelMatrix';
import Frame from '../Frame';
import { Layout } from '@/game/configuration/Layout';
import { GameConfig } from '@/game/configuration/Config';

export enum ReelLayers {
	Base,
	Mask,
	Frame,
	Reels,
	Overlay,
	FrameBase,
	Symbols,
	Logo
}
export class Reel extends PIXI.Container {
	reelMatrix: ReelMatrix;
	gameFrame: Frame;
	initialized: boolean = false;

	reelBaseMask: PIXI.Graphics;

	constructor(options?: PIXI.ContainerOptions) {
		super(options);
		this.reelBaseMask = new PIXI.Graphics({
			label: 'this.reelBaseMask'
		});

		this.reelMatrix = new ReelMatrix({
			mask: this.reelBaseMask as any,
			zIndex: ReelLayers.Reels
		});
		this.gameFrame = new Frame({
			zIndex: ReelLayers.Base
		});
	}

	init() {
		this.updateReelBase();

		this.reelMatrix.init();
		this.gameFrame.init();
		this.addChild(this.reelMatrix, this.gameFrame, this.gameFrame.reelFrame, this.reelBaseMask);
		// this.gameFrame.zIndex = ReelLayers.Frame;
		this.gameFrame.reelFrame.zIndex = ReelLayers.Frame;
		this.initialized = true;
		this.updateSizeReelMatrix();
	}

	get reelFrameProps() {
		const reelFrameW = Layout.matrixWidth * 1.2;
		const reelFrameH = Layout.matrixHeight * 1.22;

		return {
			x: 0,
			y: 0,
			width: reelFrameW,
			height: reelFrameH
		};
	}

	private updateReelBase() {
		if (!this.reelBaseMask || this.reelBaseMask.destroyed) {
			this.reelBaseMask = new PIXI.Graphics({
				label: 'this.reelBaseMask'
			});
		}
		const reelH = Layout.matrixHeight + Layout.slotGap * 2;
		this.reelBaseMask
			.clear()
			.roundRect(0, 0, Layout.matrixWidth, reelH, 0)
			.fill({ color: GameConfig.FLOOR_BGCOLOR, alpha: 0.094 });
	}

	swapReelsInProgress = false;

	positionItems() {
		if (!this.initialized || this.destroyed) return;
		if (this.reelMatrix && this.reelBaseMask) {
			this.reelMatrix.mask = this.reelBaseMask as any;
		}
		this.gameFrame?.resize();

		// this.gameLogo?.rePosition();
		this.updateReelBase();

		const reelFrameTop = Layout.matrixHeight * 0.15;

		if (this.reelMatrix) {
			this.reelMatrix.resize();

			if (this.gameFrame.reelFrame) {
				this.reelMatrix.position.set(
					this.gameFrame.reelFrame.width / 2 - this.reelBaseMask.width / 2,
					reelFrameTop
				);
			}
		}
		this.reelBaseMask?.position.set(this.reelMatrix.x, this.reelMatrix.y - Layout.slotGap);
		this.position.copyFrom(
			new PIXI.Point(
				Layout.reelPosition[0] - this.gameFrame.reelFrame.width / 2,
				Layout.reelPosition[1]
			)
		);
	}

	updateSizeReelMatrix() {
		const reelFrameTop = Layout.matrixHeight * 0.15;

		if (this.reelMatrix) {
			this.reelMatrix.resize();

			if (this.gameFrame.reelFrame) {
				this.reelMatrix.position.set(
					this.gameFrame.reelFrame.width / 2 - this.reelBaseMask.width / 2,
					reelFrameTop
				);
			}
		}
		this.reelBaseMask?.position.set(this.reelMatrix.x, this.reelMatrix.y - Layout.slotGap);
	}
	resize() {
		if (!this.initialized || this.destroyed) return;

		this.scale.set(1);
		const scaleReel = Math.min(
			Layout.reelFrameSize2.width / this.width,
			Layout.reelFrameSize2.height / this.height
		);

		this.scale.set(scaleReel);

		this.pivot.set(0, 0);

		this.position.copyFrom(
			new PIXI.Point(
				// Layout.reelPosition[0],
				Layout.reelPosition[0] - this.width / 2,
				Layout.reelPosition[1] - this.height * 0.1
			)
		);
		if (!Layout.isPortrait()) {
			// this.pivot.set(0, -(this.gameLogo.height * scaleReel) / 4);
			const reelFrameTop = Layout.matrixHeight * 0.15;

			this.position.y -= (this.height - reelFrameTop) / 2;
		}
	}

	destroy(options?: PIXI.DestroyOptions): void {
		this.initialized = false;
		super.destroy(options);
	}
}
