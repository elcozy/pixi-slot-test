import { GameConfig } from './Config';
import { isMobile } from 'pixi.js';
import { checkIfMobileDevice, checkIfLandscapeView } from '../utils';

export class Layout {
	static readonly canvasSize = { width: 1920, height: 1080, resolution: 1 };

	static readonly LOGO_POSITION_RATIO_P = 0.2;
	static readonly LOGO_POSITION_RATIO_L = 0.05;

	static readonly MATRIX_POSITION_RATIO = 0.18;

	static readonly LOGO_WIDTH_RATIO = 0.8;

	static readonly SLOT_WIDTH_RATIO = 0.1;
	static readonly SLOT_HEIGHT_RATIO = 0.2;
	static readonly SLOT_GAP_RATIO = 0.01;

	static get getCanvasSize() {
		return {
			width: Layout.canvasSize.width,
			height: Layout.canvasSize.height
		};
	}
	static updateCanvasSize(width: number, height: number, resolution = 1) {
		Layout.canvasSize.width = width;
		Layout.canvasSize.height = height;
		Layout.canvasSize.resolution = resolution;
	}

	static get reelPosition(): [number, number] {
		const ratio = Layout.isPortrait() ? Layout.LOGO_POSITION_RATIO_P : Layout.LOGO_POSITION_RATIO_L;

		if (!Layout.isPortrait()) {
			return [Layout.canvasCenterX, this.canvasCenterY];
		}

		return [Layout.canvasCenterX, Layout.getCanvasSize.height * ratio];
	}

	static get matrixPosition(): [number, number] {
		const xPos = Layout.canvasCenterX - Layout.matrixWidth / 2;
		return [xPos, Layout.canvasSize.height * Layout.MATRIX_POSITION_RATIO];
	}

	static get logoWidth() {
		return Layout.matrixWidth * Layout.LOGO_WIDTH_RATIO;
	}

	static get reelWidth() {
		return isMobile.any ? 120 : 300;
	}

	static get reelFrameSize2() {
		const screenPercent = Layout.isPortrait() ? 0.98 : 0.75;
		const ratio = 1.658;
		let screenW = Layout.canvasSize.width * screenPercent;
		let screenH = Layout.canvasSize.height * 0.8;
		let screenWFrame = screenW;
		let screenHFrame = screenW / ratio;
		let screenHFrameFallback = screenH * ratio;
		const reelFrame = screenHFrame < screenH ? screenWFrame : screenHFrameFallback;

		return {
			width: reelFrame,
			height: screenH
		};
	}

	static get matrixHeight() {
		return (
			Layout.reelWidth * GameConfig.REEL_COUNT_ROW +
			Layout.slotGap * (GameConfig.REEL_COUNT_ROW - 1)
		);
	}
	static get matrixWidth() {
		return (
			Layout.reelWidth * GameConfig.REEL_COUNT_COL +
			Layout.slotGap * (GameConfig.REEL_COUNT_COL - 1)
		);
	}

	static get reelFrameProps() {
		const reelFrameW = Layout.matrixWidth * 1.1;
		const reelFrameH = Layout.matrixHeight * 1.22;

		return {
			x: 0,
			y: 0,
			width: reelFrameW,
			height: reelFrameH
		};
	}

	static get reelBaseProps() {
		const reelFrameW = Layout.matrixWidth * 1.1;
		const reelFrameH = Layout.matrixHeight * 1.22;

		const wPercent = 0.97;
		const hPercent = 0.9;
		const reelBaseW = reelFrameW * wPercent;
		const reelBaseH = reelFrameH * hPercent;

		const reelFrameX = (reelFrameW * (1 - wPercent)) / 2.1;
		const reelFrameY = (reelFrameH * (1 - hPercent)) / 1.3;
		return {
			x: reelFrameX,
			y: reelFrameY,
			width: reelBaseW,
			height: reelBaseH
		};
	}

	static get canvasCenterX() {
		return Layout.canvasSize.width / 2;
	}
	static get canvasCenterY() {
		return Layout.canvasSize.height / 2;
	}

	static get slotGap() {
		return Layout.reelWidth * 0.07;
	}

	static isLandscape() {
		return !checkIfMobileDevice() && checkIfLandscapeView();
	}
	static isPortrait() {
		return !Layout.isLandscape();
	}
}
