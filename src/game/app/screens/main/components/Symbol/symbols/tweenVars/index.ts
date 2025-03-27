import { GameConfig } from '@/game/configuration/Config';

export const idleKeyFrames = ({ currentRotation }: { currentRotation: number }) => {
	const rotationVal = 9;
	const animDur = GameConfig.MATCH_DURATION;

	const symbols = {
		keyframes: [
			{
				pixi: {
					angle: rotationVal
				}
			},
			{
				pixi: {
					angle: -rotationVal
				}
			},
			{
				pixi: {
					angle: rotationVal
				}
			},
			{
				pixi: {
					angle: currentRotation
				}
			}
		],

		duration: animDur,
		ease: 'power1.inOut'
	};

	const glowStar = {
		keyframes: [
			{
				pixi: {
					alpha: 0.2
				}
			},

			{
				pixi: {
					alpha: 0.4
				}
			},
			{
				pixi: {
					alpha: 0.6
				}
			},
			{
				pixi: {
					alpha: 0
				},
				delay: animDur * 0.2,
				duration: animDur * 0.4
			}
		],

		duration: animDur,

		onUpdate: () => {
			// Log.log(this.glowStar.alpha);
		}
	};
	return {
		symbols,
		glowStar
	};
};
export const lowMatchKeyFrames = ({
	animDur,
	currentRotation,
	currentScale,
	currScaleStar,
	currScaleSpinner
}: {
	animDur: number;
	currentRotation: number;
	currentScale: number;
	currScaleStar: number;
	currScaleSpinner: number;
}) => {
	const rotationVal = 9;
	const scaleAmount = currentScale * 1.1;
	const scaleAmountGlow = currScaleSpinner * 1.3;

	const symbols = {
		keyframes: [
			{
				pixi: {
					angle: rotationVal,
					scale: scaleAmount
				}
			},
			{
				pixi: {
					angle: -rotationVal,
					scale: scaleAmount
				}
			},
			{
				pixi: {
					angle: rotationVal,
					scale: scaleAmount
				}
			},
			{
				pixi: {
					angle: currentRotation,
					scale: currentScale
				}
			}
		],

		duration: animDur,
		ease: 'power1.inOut'
	};

	const glowStar = {
		keyframes: [
			{
				pixi: {
					scale: currScaleStar * 0.6,
					rotation: 260 / 3
				},
				duration: 0.3
			},
			{
				pixi: {
					scale: currScaleStar * 1,
					rotation: (260 / 3) * 2
				},
				duration: 0.4
			},
			{
				pixi: {
					scale: currScaleStar * 0.6,
					rotation: (260 / 3) * 3
				},
				duration: 0.3
			},
			{
				pixi: {
					visible: false,
					scale: currScaleStar,
					rotation: 0
				},
				duration: 0.0001
			}
		],
		ease: 'sine.inOut'
	};

	const glowSpinner = {
		keyframes: [
			{
				pixi: {
					visible: true,
					rotation: 0,
					scale: currScaleSpinner
				},
				duration: 0.0001
			},
			{
				pixi: {
					scale: scaleAmountGlow,

					rotation: -260
				},
				duration: animDur * 0.7
			},
			{
				pixi: {
					scale: currScaleSpinner * 0.2,
					rotation: -260
				},
				delay: animDur * 0.5,
				duration: animDur * 0.3
			},
			{
				pixi: {
					visible: false,
					rotation: 0,
					scale: currScaleSpinner
				},
				duration: 0.001
			}
		],
		ease: 'power1.inOut'
	};
	return {
		symbols,
		glowStar,
		glowSpinner
	};
};
