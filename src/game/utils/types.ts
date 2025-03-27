export interface ILoginParams {
	sessionUuid: string;
}

export interface ILoginRes {
	token: string;
	balance: number;
	translations: Record<string, string>;
}

export interface IInitMoxieParams {
	sessionUuid: string;
}
export interface IPlayBody {
	sessionUuid: string;
	betAmount: string;
	input?: string;
}
export interface IPlayOptions {
	body: IPlayBody;
	token: string;
	server: string;
	pathQuery: string;
}
export interface IFeatureOptions {
	body: IFeatureBody;
	token: string;
	server: string;
}
export interface IFeatureBody {
	sessionUuid: string;
	betAmount: string;
	input: string;
}

export interface IInitRes {
	baseGame: string;
	currentState: EStates;
	freeGames: string[];
	error: string;
}
export interface IInitResFinal {
	baseGame: IBg | null;
	currentState: EStates;
	freeGames: IFg | null;
	// mathData: IInitMathData;
	error: string;
}
export interface ICloseSessionParams {
	sessionUuid: string;
}

const symbols = ['Z', 'B', 'C', 'D', 'E', 'F', 'A', 'K', 'Q', 'J', 'T', 'N'] as const;

export type TSymbolCodes = (typeof symbols)[number];

export type TSymbolView = [
	[TSymbolCodes, TSymbolCodes, TSymbolCodes],
	[TSymbolCodes, TSymbolCodes, TSymbolCodes],
	[TSymbolCodes, TSymbolCodes, TSymbolCodes],
	[TSymbolCodes, TSymbolCodes, TSymbolCodes],
	[TSymbolCodes, TSymbolCodes, TSymbolCodes]
];

export interface IBg {
	betAmount: number;
	totalWin: number;
	winPositions: [number, number][][][];
	paylines: {
		number: number;
		winAmount: number;
		winPositions: number[];
	}[][];
	wins: number[];
	initialSymbolView: TSymbolView;
	reelSwaps: {
		from: number;
		to: number;
	}[];
}
export enum EStates {
	Gamble = 'gamble',
	Base = 'base'
}
export interface IInitMathData {
	closed: boolean;
	count: number;
	finalWin: number;
	gameWin: number;
	maxCounts: number;
	multiplier: number;
	name: TStates;
	playerSelections: any[];
	randomOutcomes: any[];
	spinId: number;
	triggerPositions: null;
	wins: any[];
}

export type TStates = EStates.Gamble | EStates.Base;
export interface IFg {
	spinId: number;
	name: TStates;
	gameWin: number;
	wins: any[];
	finalWin: number;
	count: number;
	maxCounts: number;
	multiplier: number;
	triggerPositions: null;
	closed: boolean;
	playerSelections: number[];
	randomOutcomes: number[];
}

export interface IBasePlayRes<TBg, TFg> {
	balance: number;
	currentState: TStates;
	baseGame: TBg;
	freeGames: TFg;
	error: string;
}

export type IPlayRes<T extends boolean> = T extends true
	? IBasePlayRes<IBg, IFg> // Parsed types
	: // ? IBasePlayRes<IBg, IFg | {}> // Parsed types
		IBasePlayRes<string, string>; // Unparsed types

export type IFeatureRes<T extends boolean> = T extends true
	? IBasePlayRes<IBg, IFg> // Parsed types
	: IBasePlayRes<string, string>; // Unparsed types
