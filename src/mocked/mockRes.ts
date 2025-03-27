import { IBg } from '@/game/utils/types';

const symbols = ['Z', 'B', 'C', 'D', 'E', 'F', 'A', 'K', 'Q', 'J', 'T', 'N'] as const;

export type TSymbolCodes = (typeof symbols)[number];

export type TSymbolView = [
	[TSymbolCodes, TSymbolCodes, TSymbolCodes],
	[TSymbolCodes, TSymbolCodes, TSymbolCodes],
	[TSymbolCodes, TSymbolCodes, TSymbolCodes],
	[TSymbolCodes, TSymbolCodes, TSymbolCodes],
	[TSymbolCodes, TSymbolCodes, TSymbolCodes]
];

export enum EStates {
	Base = 'base'
}
export interface IInitResFinal {
	baseGame: IBg | null;
	currentState: EStates;
	freeGames: IBg | null;
	error: string;
}

export const resSwap: IBg = {
	betAmount: 600,

	totalWin: 300,
	winPositions: [
		[
			[
				[0, 2],
				[1, 0],
				[2, 1]
			]
		]
	],
	paylines: [
		[
			{
				number: 0,
				winAmount: 300,
				winPositions: [10, 1, 7]
			}
		]
	],
	wins: [300],
	initialSymbolView: [
		['B', 'D', 'E'],
		['N', 'Q', 'A'],
		['E', 'T', 'Q'],
		['J', 'E', 'K'],
		['C', 'J', 'J']
	],
	initialReelsView: ['B', 'N', 'E', 'J', 'C', 'D', 'Q', 'T', 'E', 'J', 'E', 'A', 'Q', 'K', 'J'],
	reelSwaps: [
		{
			from: 0,
			to: 0
		},
		{
			from: 1,
			to: 3
		},
		{
			from: 2,
			to: 1
		},
		{
			from: 3,
			to: 2
		},
		{
			from: 4,
			to: 4
		}
	]
};

export const reel2 = {
	betAmount: 600,

	totalWin: 900,
	winPositions: [
		[
			[
				[0, 1],
				[1, 0],
				[2, 1]
			],
			[
				[0, 2],
				[1, 1],
				[2, 2]
			]
		]
	],
	paylines: [
		[
			{
				number: 0,
				winAmount: 450,
				winPositions: [5, 1, 7]
			},
			{
				number: 0,
				winAmount: 450,
				winPositions: [10, 6, 12]
			}
		]
	],
	wins: [900],
	initialSymbolView: [
		['N', 'D', 'C'],
		['D', 'C', 'A'],
		['A', 'D', 'C'],
		['F', 'Q', 'B'],
		['B', 'B', 'E']
	],
	initialReelsView: ['N', 'D', 'A', 'F', 'B', 'D', 'C', 'D', 'Q', 'B', 'C', 'A', 'C', 'B', 'E'],
	reelSwaps: []
};

export const reel3: IBg = {
	betAmount: 600,

	totalWin: 1500,
	winPositions: [
		[
			[
				[0, 0],
				[1, 2],
				[2, 2]
			],
			[
				[0, 2],
				[1, 1],
				[2, 2]
			],
			[
				[0, 1],
				[1, 0],
				[2, 2]
			]
		]
	],
	paylines: [
		[
			{
				number: 0,
				winAmount: 300,
				winPositions: [0, 11, 12]
			},
			{
				number: 0,
				winAmount: 750,
				winPositions: [10, 6, 12]
			},
			{
				number: 0,
				winAmount: 450,
				winPositions: [5, 1, 12]
			}
		]
	],
	wins: [1500],
	initialSymbolView: [
		['F', 'C', 'B'],
		['J', 'T', 'D'],
		['C', 'B', 'F'],
		['T', 'E', 'D'],
		['T', 'T', 'Z']
	],
	initialReelsView: ['F', 'J', 'C', 'T', 'T', 'C', 'T', 'B', 'E', 'T', 'B', 'D', 'F', 'D', 'Z'],
	reelSwaps: [
		{
			from: 0,
			to: 0
		},
		{
			from: 1,
			to: 3
		},
		{
			from: 2,
			to: 1
		},
		{
			from: 3,
			to: 4
		},
		{
			from: 4,
			to: 2
		}
	]
};

export const reel4: IBg = {
	betAmount: 4,

	totalWin: 4,
	winPositions: [
		[
			[
				[0, 1],
				[1, 1],
				[2, 0]
			],
			[
				[0, 0],
				[1, 0],
				[2, 0]
			]
		]
	],
	paylines: [
		[
			{
				number: 0,
				winAmount: 2,
				winPositions: [5, 6, 2]
			},
			{
				number: 0,
				winAmount: 2,
				winPositions: [0, 1, 2]
			}
		]
	],
	wins: [4],
	initialSymbolView: [
		['F', 'E', 'K'],
		['F', 'E', 'A'],
		['Z', 'A', 'B'],
		['Q', 'Q', 'A'],
		['Q', 'Q', 'D']
	],
	initialReelsView: ['F', 'F', 'Z', 'Q', 'Q', 'E', 'E', 'A', 'Q', 'Q', 'K', 'A', 'B', 'A', 'D'],
	reelSwaps: []
};

export const randRes: IInitResFinal = {
	baseGame: reel4,
	currentState: EStates.Base,
	freeGames: null,
	error: ''
};

//

function getRandomSymbolView(): TSymbolView {
	return Array.from({ length: 5 }, () =>
		Array.from({ length: 3 }, () => symbols[Math.floor(Math.random() * symbols.length)])
	) as TSymbolView;
}

export function generateRandomResult(): IInitResFinal {
	const symbolView = getRandomSymbolView();

	const winPositions: [number, number][][][] = Array.from(
		{ length: Math.floor(Math.random() * 2) + 1 }, // Number of win groups
		() =>
			Array.from(
				{ length: Math.floor(Math.random() * 3) + 1 },
				() =>
					[
						Math.floor(Math.random() * 5), // Row index (0-4)
						Math.floor(Math.random() * 3) // Column index (0-2)
					] as [number, number] // Ensure tuple type
			)
	);
	console.log(winPositions);
	const paylines = winPositions.map((positions, index) => ({
		number: index,
		winAmount: Math.floor(Math.random() * 10) + 1, // Random win between 1 and 10
		winPositions: positions.flat().map(([row, col]) => row * 3 + col) // Convert to 1D position
	}));

	return {
		baseGame: {
			betAmount: 4,
			totalWin: paylines.reduce((acc, p) => acc + p.winAmount, 0),
			winPositions: [winPositions],
			paylines: [paylines],
			wins: paylines.map((p) => p.winAmount),
			initialSymbolView: symbolView,
			reelSwaps: []
		},
		currentState: EStates.Base,
		freeGames: null,
		error: ''
	};
}
