export async function waitForInterval(ms: number): Promise<unknown> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
export function waitForIntervalWithCancel(ms: number): {
	promise: Promise<void>;
	cancel: () => void;
} {
	let timeoutId: number | undefined | any;
	let resolvePromise: () => void;

	const promise = new Promise<void>((resolve) => {
		resolvePromise = resolve;
		timeoutId = setTimeout(resolve, ms);
	});

	const cancel = () => {
		console.warn('cancel -waitForIntervalWithCancel');

		clearTimeout(timeoutId); // Clears the timeout
		resolvePromise(); // Resolves the promise immediately
	};

	return { promise, cancel };
}
