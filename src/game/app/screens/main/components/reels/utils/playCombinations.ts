import { GameConfig } from '@/game/configuration/Config';
import type ReelSlot from '../ReelSlot';
import type { ReelMatrix } from '../ReelMatrix';
import { waitForInterval } from '@/game/utils/intervalWait';
import { Log, isDebug } from '@/game/utils/Logger';
import { createGridWithTrue } from '@/game/utils';

export function playCombinationsBH(
	reelMatrix: ReelMatrix,
	winPositions: number[],
	abortCombController: AbortController
) {
	const { slotArr } = reelMatrix;
	const playIdle = true;

	const singleIndexResult = createGridWithTrue({
		rows: 5,
		cols: 3,
		indices: winPositions
	});

	return new Promise(async (resolve) => {
		slotArr.map((slot) => {
			slot.setSymbolsVisible(false);
		});

		waitForInterval(500).then(async () => {
			resolve('play-combination-before-idle');
		});
		await waitForInterval(200);

		if (playIdle) {
			if (abortCombController) {
				await playIdleCombinationsBH(slotArr, singleIndexResult, abortCombController);
			}
		}

		slotArr.map((slot) => {
			slot.setSymbolsVisible(true);
		});

		waitForInterval(500).then(async () => {
			resolve('play-combination-complete');
			Log.log('All reels have played combination');
		});
	});
}
async function playIdleCombinationsBH(
	slotArr: ReelSlot[],
	combinations: (boolean | 0)[][],
	abortCombController: AbortController
) {
	const playCombination = (combination: (boolean | 0)[][]) => {
		return Promise.all(slotArr.map((slot, index) => slot.playCombinationIdle(combination[index])));
	};
	try {
		// Execute combinations repeatedly up to 10 times or until aborted
		for (let i = 0; i < 2; i++) {
			if (abortCombController.signal.aborted)
				throw new Error('playIdleCombinations Operation aborted');

			await waitForInterval(20);

			if (abortCombController.signal.aborted)
				throw new Error('playIdleCombinations Operation aborted');

			await playCombination(combinations);
			console.log('playIdle count:', i + 1);
		}
	} catch (error) {
		if (error instanceof Error) {
			console.warn(error.message);
		} else {
			console.error('An unknown error occurred');
		}
	}
}

export function playCombinations(reelMatrix: ReelMatrix, playIdle = true) {
	const { slotArr, abortCombController } = reelMatrix;
	let combinations: (boolean | 0)[][][] = [];
	if (GameConfig.ROUND_RES?.baseGame.paylines) {
		const paylines = GameConfig.ROUND_RES?.baseGame.paylines[0];
		if (paylines.length) {
			paylines.map((line) => {
				const singleIndexResult = createGridWithTrue({
					rows: 5,
					cols: 3,
					indices: line.winPositions
				});
				combinations.push(singleIndexResult);
			});
		}
	}
	return new Promise(async (resolve) => {
		const isCombination = !!combinations.length;

		if (!isCombination) {
			return resolve('no combination');
		}

		slotArr.map((slot) => {
			slot.setSymbolsVisible(false);
		});

		await playMatchCombinations(slotArr);
		// await playMatchCombinations(slotArr, abortCombController!);
		resolve('play-combination-before-idle');
		await waitForInterval(200);
		if (playIdle) {
			if (abortCombController) {
				await playIdleCombinations(slotArr, combinations, abortCombController);
			}
		}

		slotArr.map((slot) => {
			slot.setSymbolsVisible(true);
		});

		waitForInterval(500).then(async () => {
			resolve('play-combination-complete');
			Log.log('All reels have played combination');
		});
	});
}

async function playIdleCombinations(
	slotArr: ReelSlot[],
	combinations: (boolean | 0)[][][],
	abortCombController: AbortController
) {
	const playCombination = (combination: (boolean | 0)[][]) => {
		return Promise.all(slotArr.map((slot, index) => slot.playCombinationIdle(combination[index])));
	};
	try {
		// Execute combinations repeatedly up to 10 times or until aborted
		for (let i = 0; i < (isDebug() ? 8 : 10); i++) {
			if (abortCombController.signal.aborted) {
				throw new Error('playIdleCombinations Operation aborted');
			}

			await waitForInterval(200);

			for (const combination of combinations) {
				if (abortCombController.signal.aborted) {
					throw new Error('playIdleCombinations Operation aborted');
				}

				await playCombination(combination);
				console.log('playIdle count:', i + 1);
			}
		}
	} catch (error) {
		if (error instanceof Error) {
			console.warn(error.message);
		} else {
			console.error('An unknown error occurred');
		}
	}
}

async function playMatchCombinations(
	slotArr: ReelSlot[],
	abortCombController?: AbortController
): Promise<string> {
	const paylines = GameConfig.ROUND_RES?.baseGame.paylines?.[0] ?? [];

	if (paylines.length === 0) {
		return 'no-combinations-found';
	}
	if (abortCombController?.signal.aborted) {
		return Promise.resolve('playIdleCombinations Operation aborted');
	}
	const allWinPositions = paylines.flatMap((winLine) => winLine.winPositions);
	const combinations = createGridWithTrue({
		rows: 5,
		cols: 3,
		indices: allWinPositions
	});

	const playCombinationPromises = slotArr.map(async (slot, index) => {
		await slot.playCombinationMatch(combinations[index]);
		if (abortCombController?.signal.aborted) {
			throw new Error('playIdleCombinations Operation aborted');
		}
	});

	try {
		await Promise.all(playCombinationPromises);
		return 'combinations-played-successfully';
	} catch (error) {
		console.error('Error playing combinations:', error);
		return 'error-playing-combinations';
	}
}
