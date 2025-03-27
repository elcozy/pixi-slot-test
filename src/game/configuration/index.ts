import type {
	SymbolConfig,
	SymbolConfigItem,
	TSymbolAssetNames,
	TSymbolCodes,
	TSymbolRanking
} from './types';

export const symbolsConfig: SymbolConfig = {
	0: { asset: 'cap.png', code: 'N' },
	1: { asset: 'spade2.png', code: 'T' },
	2: { asset: 'spade.png', code: 'J' },
	3: { asset: 'seven.png', code: 'Q' },
	4: { asset: 'plant.png', code: 'K' },
	5: { asset: 'mango.png', code: 'A' },
	6: { asset: 'horse.png', code: 'F' },
	7: { asset: 'heart2.png', code: 'E' },
	9: { asset: 'heart.png', code: 'D' },
	8: { asset: 'grape.png', code: 'C' },
	10: { asset: 'cherry.png', code: 'B' },
	11: { asset: 'wild.png', code: 'Z' }
};

export function findSymbol(
	identifier: TSymbolCodes | TSymbolRanking | TSymbolAssetNames
): SymbolConfigItem {
	for (const key in symbolsConfig) {
		const item = symbolsConfig[key];
		if (item.code === identifier || item.asset === identifier) {
			return item;
		}
	}
	throw new Error('symbol not found');
}
