export function checkIfLandscapeView() {
	return window.innerWidth > window.innerHeight;
}

export function checkIfMobileDevice() {
	const screenWidth = window.screen.width;
	const screenHeight = window.screen.height;

	const isTablet = screenWidth > 1024 && screenHeight > 768;

	const mobileDeviceRegex = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i;

	return mobileDeviceRegex.test(navigator.userAgent) && !isTablet;
}

export function getRandomInt(start: number, end: number): number {
	return Math.floor(Math.random() * (end - start + 1)) + start;
}
export function getRandomElementArr<T>(arr: T[]): T {
	const randomIndex = Math.floor(Math.random() * arr.length);
	return arr[randomIndex];
}

export const isObjectEmpty = (objectName: object | string | undefined): boolean => {
	if (Array.isArray(objectName) || typeof objectName === 'string' || objectName === undefined) {
		return false;
	}
	return Object.keys(objectName).length === 0;
};

export function createGridWithTrue(params: {
	rows: number;
	cols: number;
	indices: number | number[];
}): (boolean | 0)[][] {
	const { rows, cols, indices } = params;
	const indicesArray = Array.isArray(indices) ? indices : [indices];

	const grid: (boolean | 0)[][] = Array.from({ length: rows }, () => Array(cols).fill(0));

	// Iterate through the indices array
	indicesArray.forEach((index) => {
		// const rowIndex = Math.floor(index / cols);
		const rowIndex = index % rows;
		const colIndex = ~~(index / rows);

		grid[rowIndex][colIndex] = true;
	});

	return grid;
}
