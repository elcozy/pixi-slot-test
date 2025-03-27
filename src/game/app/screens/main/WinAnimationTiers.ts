import { GameConfig } from '@/game/configuration/Config';
import type { IBg } from '@/game/utils/types';
import { MainShared } from './MainShared';
import { getWinValue } from './components/reels/ReelMatrix';

export class WinAnimationTiers {
	static get winVal() {
		const response = (GameConfig.ROUND_RES?.baseGame ?? {}) as IBg;

		const { betAmount = 20 } = response;

		return this.winValPercent * betAmount;
	}
	static get winValPercent() {
		const response = (GameConfig.ROUND_RES?.baseGame ?? {}) as IBg;

		const { totalWin: winAmount = 30, betAmount = 20 } = response;
		const winVal = getWinValue({ betAmount, winAmount });
		return winVal;
	}

	private static timeout: NodeJS.Timeout | null;
	private static preWinAnimation(preWin = false) {
		MainShared.gameOverlay.clear();
		MainShared.multiplier.endScene();

		if (preWin) {
			MainShared.multiplier.eventMode = 'static';
			MainShared.multiplier.cursor = 'pointer';
			MainShared.multiplier.once('pointerdown', () => {
				MainShared.multiplier.once('pointerdown', () => {
					MainShared.multiplier.endScene();
					MainShared.gameOverlay.clear();
					MainShared.multiplier.endScene();
				});
			});
		} else {
			MainShared.multiplier.clear();
		}
	}

	static clear(clear = false) {
		WinAnimationTiers.preWinAnimation(clear);
		if (this.timeout) {
			clearTimeout(this.timeout as any);
			this.timeout = null;
		}
	}

	static NormalTier1(): Promise<void> {
		return this.OnWin();
	}
	static OnWin(): Promise<void> {
		WinAnimationTiers.clear(true);

		const winValue = this.winVal ?? 5;
		const duration = Math.min(winValue * 1000, 1500);

		const winAnimationPopup = [MainShared.multiplier.countTo(winValue, duration, true)];

		return Promise.all(winAnimationPopup).then(() => {
			this.timeout = setTimeout(this.clear, 100);
		});
	}
}
