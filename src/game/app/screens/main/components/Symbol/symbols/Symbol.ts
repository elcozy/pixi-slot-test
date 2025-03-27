import { gsap } from 'gsap';
import { idleKeyFrames } from './tweenVars';

import BaseSymbol, { type ISymbol } from './BaseSymbol';
import { GameConfig } from '@/game/configuration/Config';
import { waitForInterval } from '@/game/utils/intervalWait';

export default class Symbol extends BaseSymbol {
	constructor(props: ISymbol) {
		super(props);
	}

	_combinationIdle(isCombination: boolean) {
		this.isCombination = isCombination;

		this.handleShakeProgress();
		return new Promise((resolve) => {
			// Set glow visibility and alpha based on combination state
			this.alpha = isCombination ? 1 : 0.5;

			if (!isCombination) {
				resolve('done-not-combination');
				return;
			}

			const currentRotation = this.symbol.rotation;

			this.shakeInProgress = true;

			this.shakeTweenRepeat = gsap.timeline({
				repeat: GameConfig.IDLE_REPEAT,
				onRepeat: () => {},
				onInterrupt: () => {
					if (this.shakeTweenRepeat && this.shakeInProgress) {
						this.shakeTweenRepeat = undefined;
						this.shakeInProgress = false;
						this.symbolReset();
						resolve('done-is-combination-onInterrupt');
						document.dispatchEvent(new CustomEvent('symbols-alpha-reset', {}));
					}
				},

				onComplete: () => {
					if (this.shakeTweenRepeat && this.shakeInProgress) {
						this.symbolReset();
						this.shakeTweenRepeat.kill();
						this.shakeTweenRepeat = undefined;
						this.shakeInProgress = false;
						resolve('done-is-combination-onComplete');
					}
				}
			});
			const animDur = 1;

			const frames = idleKeyFrames({
				currentRotation
			});
			this.shakeTweenRepeat.to(this.symbol, frames.symbols);
		});
	}
	_combinationMatch(isCombination: boolean) {
		this.isCombination = isCombination;

		this.handleShakeProgress();
		return new Promise(async (resolve) => {
			// Set glow visibility and alpha based on combination state

			if (!isCombination) {
				resolve('done-not-combination');
				return;
			}

			this.alpha = isCombination ? 1 : 0.5;

			this.shakeInProgress = true;
			await waitForInterval(500);
			this.shakeTweenRepeat = gsap.timeline({
				repeat: GameConfig.MATCH_REPEAT,
				repeatDelay: GameConfig.MATCH_DELAY,
				onRepeat: () => {},
				onInterrupt: () => {
					if (this.shakeTweenRepeat && this.shakeInProgress) {
						this.shakeTweenRepeat = undefined;
						this.shakeInProgress = false;
						this.symbolReset();
						resolve('done-is-combination-onInterrupt');
						document.dispatchEvent(new CustomEvent('symbols-alpha-reset', {}));
					}
				},

				onComplete: () => {
					if (this.shakeTweenRepeat && this.shakeInProgress) {
						this.symbolReset();
						this.shakeTweenRepeat.kill();
						this.shakeTweenRepeat = undefined;
						this.shakeInProgress = false;
						resolve('done-is-combination-onComplete');
					}
				}
			});
		});
	}
}
