import { storage } from './storage';
import { engine } from '../../app/getEngine';

// Keys for saved items in storage
const KEY_VOLUME_MASTER = 'xc-volume-master';
const KEY_VOLUME_BGM = 'xc-volume-bgm';
const KEY_VOLUME_SFX = 'xc-volume-sfx';
const GAME_SPEED = 'xc-game-speed';

/**
 * Persistent user settings of volumes.
 */
class UserSettings {
	public init() {
		// engine().audio.setMasterVolume(this.getMasterVolume());
		// engine().audio.bgm.setVolume(this.getBgmVolume());
		// engine().audio.sfx.setVolume(this.getSfxVolume());
	}

	/** Get overall sound volume */
	public isMuted() {
		return this.getMasterVolume() <= 0;
	}
	public getMasterVolume() {
		return storage.getNumber(KEY_VOLUME_MASTER) ?? 0.5;
	}

	/** Set overall sound volume */
	public setMasterVolume(value: number) {
		// engine().audio.setMasterVolume(value);
		storage.setNumber(KEY_VOLUME_MASTER, value);
	}

	/** Get background music volume */
	public getBgmVolume() {
		return storage.getNumber(KEY_VOLUME_BGM) ?? 1;
	}
	public getGameSpeed() {
		return storage.getNumber(GAME_SPEED) ?? 0; // 0 , 1 or 2
	}

	/** Set background music volume */
	public setBgmVolume(value: number) {
		// engine().audio.bgm.setVolume(value);
		storage.setNumber(KEY_VOLUME_BGM, value);
	}
	public setGameSpeed(value: 0 | 1 | 2) {
		storage.setNumber(GAME_SPEED, value); // 0 , 1 or 2
	}

	/** Get sound effects volume */
	public getSfxVolume() {
		return storage.getNumber(KEY_VOLUME_SFX) ?? 1;
	}

	/** Set sound effects volume */
	public setSfxVolume(value: number) {
		// engine().audio.sfx.setVolume(value);
		storage.setNumber(KEY_VOLUME_SFX, value);
	}
}

/** SHared user settings instance */
export const userSettings = new UserSettings();
