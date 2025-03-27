import type { HowlOptions } from 'howler';
import type { ETrackId } from './types';

interface SoundSprite {
	[key: string]: [number, number];
}

interface Sound {
	id: number;
}
type IHowlSound = {
	soundType: ETrackId;
	isSprite?: boolean;
	spriteName?: string;
	allowOverlap?: boolean;
	skipIfPlaying?: boolean;
} & HowlOptions;
export class HowlSound extends Howl {
	soundType: ETrackId;
	isSprite: boolean;
	spriteName: string;
	allowOverlap?: boolean;
	skipIfPlaying?: boolean;

	constructor(options: IHowlSound) {
		super(options);
		this.soundType = options.soundType;
		this.isSprite = options.isSprite ?? false;
		this.allowOverlap = options.allowOverlap ?? true;
		this.skipIfPlaying = options.skipIfPlaying ?? false;

		this.spriteName = options.spriteName ?? '';
	}

	play(spriteOrId?: string | number) {
		if (this.isSprite) {
			return super.play(this.spriteName);
			// return super.play('cq_click');
		}
		return super.play();
	}
}

export interface HowlAudioClass extends HowlSound {
	_autoplay: boolean;
	_duration: number;
	_endTimers: Record<string, any>;
	_format?: string;
	_html5: boolean;
	_loop: boolean;
	_muted: boolean;
	_onend: Function[];
	_onfade: Function[];
	_onload: Function[];
	_onloaderror: Function[];
	_onmute: Function[];
	_onorientation: Function[];
	_onpause: Function[];
	_onplay: Function[];
	_onplayerror: Function[];
	_onpos: Function[];
	_onrate: Function[];
	_onresume: Function[];
	_onseek: Function[];
	_onstereo: Function[];
	_onstop: Function[];
	_onunlock: Function[];
	_onvolume: Function[];
	_orientation: [number, number, number];
	_playLock: boolean;
	_pool: number;
	_pos: number | null;
	_preload: boolean;
	_queue: any[]; // Adjust type based on queue structure
	_rate: number;
	_sounds: Sound[];
	_sprite: SoundSprite;
	_src: string;
	_state: string;
	_stereo: number | null;
	_volume: number;
	_webAudio: boolean;
}
