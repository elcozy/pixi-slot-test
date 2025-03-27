//
export function easeInOutQuad(t: number) {
	return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}
export function easeInQuad(t: number) {
	return t * t;
}

export function easeOutQuad(t: number) {
	return t * (2 - t);
}
export function easeInQuadEaseOutQuart(t: number): number {
	if (t < 0.3) {
		// Ease-In Quad for the first 30%
		return 2 * t * t;
	} else if (t < 0.7) {
		// Linear section from 30% to 70%
		return 1 - Math.pow(1 - (t - 0.3) / 0.4, 4);
	} else {
		// Ease-Out Quart for the last 30%
		return 1 - Math.pow(1 - (t - 0.7) / 0.3, 4);
	}
}
export function easeOutElastic(t: number): number {
	const c4 = (2 * Math.PI) / 3;

	if (t < 0.3) {
		// Ease-In Quad for the first 30%
		return 2 * t * t;
	} else if (t < 0.7) {
		// Linear for most of the duration
		return 1 - Math.pow(1 - (t - 0.3) / 0.4, 4);
	} else {
		// Ease-Out Elastic for the last 30%
		return t === 1 ? 1 : 1 - Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4);
	}
}
export function easeInSineOutQuart(t: number): number {
	if (t < 0.3) {
		// Ease-In Sine for the first 30%
		return 1 - Math.cos((t / 0.3) * (Math.PI / 2));
	} else if (t < 0.7) {
		// Linear for the middle 40%
		return 1 - Math.pow(1 - (t - 0.3) / 0.4, 4);
	} else {
		// Ease-Out Quart for the last 30%
		return 1 - Math.pow(1 - (t - 0.7) / 0.3, 4);
	}
}

export function linearOutAndIn(t: number): number {
	if (t < 0.2) {
		// Smooth ease-in from 0 to ~0.8 at the start
		return easeInQuad(t / 0.2) * 0.8;
	} else if (t >= 0.2 && t < 0.5) {
		// Smooth transition from ~0.8 to 1
		const progress = (t - 0.2) / 0.3;
		return 0.8 + progress * 0.2;
	} else if (t >= 0.5 && t < 0.7) {
		// Maintain max value (1) with a slight ease-out to hold steady
		return 1 - easeOutQuad((t - 0.5) / 0.2) * 0.05;
	} else if (t >= 0.7) {
		// Smooth ease-out from 1 down to 0.5 from 70% to 100%
		const progress = (t - 0.7) / 0.3;
		return 1 - easeOutQuad(progress) * 0.5;
	}

	return 0; // Default return
}

export function linearOutAndIn3(t: number): number {
	// return easeOutQuad(t);
	// return easeInOutQuad(t);
	if (t < 0.2) {
		// Linear ease-in for the first 10%
		return t / 0.1;
		// // Linear ease-in for the first 20%
		// return t / 0.2;
	} else if (t >= 0.2 && t <= 0.5) {
		// Linearly increase from the value at 20% to 1 at 50%
		const startValue = 1; // Value at 20%
		const endValue = 1; // Target value at 50%
		return startValue + (endValue - startValue) * ((t - 0.1) / 0.3);
	} else if (t > 0.5 && t <= 0.7) {
		// return easeOutQuad(t);
		// Maintain maximum speed (value 1) from 50% to 70%
		return 1;
	} else if (t > 0.7) {
		// Linearly decrease from 1 to 0.5 from 70% to 100%
		return 1 - 0.5 * ((t - 0.7) / 0.3);
	}
	return 0; // Default return
}

export function linearOutIn(t: number): number {
	if (t < 0.2) {
		// Linear ease-out for the first 20%
		return t / 0.2;
	} else if (t > 0.9) {
		// Overshoot slightly at the end and ease back to normal
		const overshoot = 1.2; // Slightly faster than 100%
		const easeBackStart = 0.95; // Point where it starts easing back to 1
		return overshoot - (overshoot - 1) * ((t - easeBackStart) / (1 - easeBackStart));
	} else {
		// Constant (fast) speed for the middle 70%
		return 1;
	}
}

export function linearOutIn2(t: number): number {
	if (t < 0.1) {
		// Linear ease-out for the first 10%
		return t / 0.1;
	} else if (t > 0.9) {
		// Linear ease-in for the last 10%
		return (1 - t) / 0.1;
	} else {
		// Constant (fast) speed for the middle 80%
		return 1;
	}
}

export function linearOut(t: number): number {
	if (t < 0.9) {
		// Start at full speed and linearly ease out to a stop over 90% of the time
		return 1 - t;
	} else {
		// Slowest at the last 10%, completing the ease-out
		return (1 - t) * (1 / 0.1); // Gradually approaches 0
	}
}

export function linearIn(t: number): number {
	// Gradually increases from 0 to 1 as t goes from 0 to 1
	return t;
}
export function linearOutReal(t: number): number {
	return 1 - t;
}
