export const symbolsCodes = ['Z', 'B', 'C', 'D', 'E', 'F', 'A', 'K', 'Q', 'J', 'T', 'N'] as const;

export type TSymbolCodes = (typeof symbolsCodes)[number];

const symbolRanking = [
	'LOW_8',
	'LOW_7',
	'LOW_6',
	'LOW_5',
	'LOW_4',
	'LOW_3',
	'LOW_2',
	'LOW_1',
	'HIGH_3',
	'HIGH_2',
	'HIGH_1',
	'WILD'
] as const;

export type TSymbolRanking = (typeof symbolRanking)[number];

const symbolAssetNames = [
	'cap',
	'spade2',
	'spade',
	'seven',
	'plant',
	'mango',
	'horse',
	'heart2',
	'heart',
	'grape',
	'cherry',
	'wild'
] as const;

export type TSymbolAssetNames = (typeof symbolAssetNames)[number];

export type SymbolConfigItem = {
	asset: string;
	code: TSymbolCodes;
};

export type SymbolConfig = Record<string, SymbolConfigItem>;
