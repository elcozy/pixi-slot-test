import { Decimal } from 'decimal.js';
import { Log } from './Logger';

export type TCurrency = {
	code: string;
	prefix: string;
	suffix: string;
	separator: string;
	decimalSymbol: string;
};

export class CurrencyUtils {
	private static defaultCurrency: TCurrency = {
		separator: ',',
		decimalSymbol: '.',
		prefix: '',
		suffix: '',
		code: ''
	};

	static centsToDec(cents: number): number {
		if (!cents) return 0;
		const floorValue = Math.floor(cents);
		return Decimal.div(floorValue, 100).toNumber();
	}

	static decToCents(decimal: number): number {
		if (!decimal) return 0;
		return Decimal.mul(decimal, 100).toNumber();
	}

	static format(
		value: number | string,
		precise: boolean = true,
		currency: TCurrency | undefined = CurrencyUtils.defaultCurrency,
		props?: { useCode: boolean }
	): string | number {
		if (!currency) {
			currency = CurrencyUtils.defaultCurrency;
		}
		const { useCode = false } = props ?? {};

		const { code = '', prefix = '', suffix = '', separator, decimalSymbol } = currency;

		if (value === '' || value === undefined) {
			return value;
		}
		let displayNumber: string = '';

		if (!precise) {
			value = Decimal.div(value, 100).valueOf();
		}
		try {
			displayNumber = new Decimal(value).toFixed(2);
		} catch (err) {
			Log.error(err);
		}

		displayNumber =
			decimalSymbol === '.' ? displayNumber : displayNumber.replace('.', decimalSymbol);

		displayNumber = displayNumber.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
		if (useCode && code) {
			return `${displayNumber} ${code}`;
		}
		return `${CurrencyUtils.deUnicode(prefix)}${displayNumber}${CurrencyUtils.deUnicode(suffix)}`;
	}

	static setCurrencyFormat(currency: TCurrency) {
		CurrencyUtils.defaultCurrency = currency;
	}

	static deUnicode(unicode: string = '') {
		if (!unicode) return '';
		const decoded = unicode.replace(/\\u([\d\w]{4})/gi, (_match, grp) => {
			return String.fromCharCode(parseInt(grp, 16));
		});
		return decoded;
	}
}
