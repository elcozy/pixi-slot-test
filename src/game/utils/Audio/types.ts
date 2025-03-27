import type { soundList } from '../audioManifest';

export type TSoundName = (typeof soundList)[number];

export interface IPlayParam {
	randomStart?: boolean;
	loop?: boolean;
	seek?: number;
	rate?: number;
	restrictRepetition?: boolean;
	volumeRatio?: number;
	onComplete?: () => void;
	onCompleteScope?: any;
	spriteName?: TSoundName;
}
export type IPlayParams = IPlayParam | null;

export type SpriteData = [number, number, boolean] | [number, number]; //[offset, duration, (loop)]

type Sprites = Record<string, Record<string, SpriteData>>;

type SpritesConfig = Record<string, Record<string, ISoundSpriteConfig>>;

export interface ISoundSpriteConfig {
	allowOverlap?: boolean; // default false
	skipIfPlaying?: boolean; // default false
}
export interface ISoundLoadOptions {
	basePath: string;
	arrName: string[];
	trackId: ETrackId;
	arrExtension: string[];
	sprites?: Sprites;
	spritesConfig?: SpritesConfig;
}

export enum ETrackId {
	SFX,
	MUSIC,
	AMBIENT
}

export interface PlayParams {
	loop: boolean;
	seek: number;
	rate: number;
	volumeRatio?: number; // 0 to 1
	onComplete: () => void;
}
