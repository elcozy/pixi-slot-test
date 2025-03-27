import type { TSymbolCodes } from './types';

export const regularSymbolsList = (): TSymbolCodes[] => {
	return ['B', 'C', 'D', 'E', 'F', 'A', 'K', 'Q', 'J', 'T', 'N'];
};

export const getInitialSymbols = (): TSymbolCodes[][] => {
	const reels = 5;
	const rows = 3;
	// remove wilds and other special symbols
	const regularSymbols = regularSymbolsList();

	const setA: TSymbolCodes[] = regularSymbols.slice(0, regularSymbols.length / 2);
	const setB: TSymbolCodes[] = regularSymbols.slice(regularSymbols.length / 2);

	const next = (set: TSymbolCodes[]): TSymbolCodes => set[Math.floor(Math.random() * set.length)];

	const times = (n: number, callback: (index: number) => void): void =>
		[...Array(n).keys()].forEach((i) => callback(i));

	const symbolView: TSymbolCodes[][] = [];

	times(reels, (reelIndex: number) => {
		symbolView.push([]);
		times(rows, () =>
			symbolView[symbolView.length - 1].push(
				next(reelIndex === 0 || reelIndex == reels - 1 ? setA : setB)
			)
		);
	});

	return symbolView;
};
