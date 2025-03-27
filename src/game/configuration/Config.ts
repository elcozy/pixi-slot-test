import { isMobile } from 'pixi.js';
import { EStates, type IInitResFinal, type IFeatureRes, type IPlayRes } from '../utils/types';
import { userSettings } from '../engine/utils/userSettings';

export class GameConfig {
	static readonly REEL_COUNT_ROW = 3;
	static readonly REEL_COUNT_COL = 5;
	static readonly REEL_BLUR_DEFAULT = 6;
	static readonly REEL_SPEED_DEFAULT = 70;

	static readonly REEL_DURATION_DEFAULT = 1500;
	static readonly REEL_DELAY_END_DEFAULT = 300;
	static readonly AUTOPLAY_DELAY_NOWIN = 200;
	static readonly AUTOPLAY_DELAY_WIN = 1200;

	static readonly REEL_DURATION_NORMAL = 3500; //ms
	static readonly REEL_DURATION_FAST_SPIN = 2250; //ms
	static readonly REEL_DURATION_TURBO_SPIN = 1125; //ms

	static readonly REEL_SPEED_NORMAL = isMobile.any ? 40 : 100;
	static readonly REEL_SPEED_FAST_SPIN = this.REEL_SPEED_NORMAL * 1.2;
	static readonly REEL_SPEED_TURBO_SPIN = this.REEL_SPEED_NORMAL * 2;

	static IMMEDIATE_END = false;
	static IMMEDIATE_END_ERROR = false;
	static REEL_BLUR = 6;
	static REEL_DURATION_START = 800; //1.5sec

	static SKY_BGCOLOR = 0x99e9f3;
	static FLOOR_BGCOLOR = 0xf47b44;
	static BTN_ICON_COLOR_NORMAL = '#fff';

	static IDLE_REPEAT: number = 1;
	static IDLE_DURATION: number = 1;
	static IDLE_DELAY: number = 0.5;

	static MATCH_REPEAT: number = 1;
	static MATCH_DURATION: number = 1.39;
	static MATCH_DELAY: number = 0;

	static GAME_MODE: EStates = EStates.Base;
	static AUTOPLAY_DELAY: number = GameConfig.AUTOPLAY_DELAY_NOWIN;
	static IS_AUTOPLAY: boolean = false;
	static ROUND_RES: IPlayRes<true> | null = null;
	static FEATURE_RES: IFeatureRes<true> | null = null;
	static GAME_ROUTE: 'NFD' | 'MAIN' | 'GAMBLE' = 'MAIN';
	static INIT_MATH_DATA: IInitResFinal | null = null;
	static GAMBLE_SELECTION: '-1' | '0' | '1' = '-1';

	private static get REEL_SPEED_MODE(): 'NORMAL' | 'FAST' | 'TURBO' {
		const speedModes: ('NORMAL' | 'FAST' | 'TURBO')[] = ['NORMAL', 'FAST', 'TURBO'];
		const speed = speedModes[userSettings.getGameSpeed()] || 'NORMAL';
		// console.log('speed 2', speed);
		return speed;
	}

	static get REEL_SPEED() {
		if (this.REEL_SPEED_MODE === 'TURBO') {
			return this.REEL_SPEED_TURBO_SPIN;
		} else if (this.REEL_SPEED_MODE === 'FAST') {
			return this.REEL_SPEED_FAST_SPIN;
		} else {
			return this.REEL_SPEED_NORMAL;
		}
	}

	static get REEL_DURATION() {
		if (this.REEL_SPEED_MODE === 'TURBO') {
			return this.REEL_DURATION_TURBO_SPIN;
		} else if (this.REEL_SPEED_MODE === 'FAST') {
			return this.REEL_DURATION_FAST_SPIN;
		} else {
			return this.REEL_DURATION_NORMAL;
		}
	}
	static get REEL_DELAY_END() {
		return this.REEL_DURATION * 0.075;
	}
}
