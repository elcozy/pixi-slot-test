// /* eslint-disable no-console */
export const isDebug = () => {
	if (typeof window !== 'undefined') {
		// Safe to use window here
		// return true;
		const { hostname, pathname, search } = window.location;

		const searchParams = new URLSearchParams(search);
		if (
			hostname === 'localhost' ||
			pathname === '/debug' ||
			(searchParams.has('debug') && searchParams.get('debug') === 'true')
		) {
			return true;
		}

		return false;
	}
	return false;
};
export const Log = {
	get log() {
		if (!isDebug()) return () => {};
		return console.log.bind(console);
	},
	get error() {
		if (!isDebug()) return () => {};
		return console.error.bind(console);
	},
	get warn() {
		if (!isDebug()) return () => {};

		return console.warn.bind(console);
	},
	get info() {
		if (!isDebug()) return () => {};

		return console.info.bind(console);
	},
	get table() {
		if (!isDebug()) return () => {};

		return console.table.bind(console);
	}
};
