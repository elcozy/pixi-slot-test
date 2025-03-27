import * as PIXI from 'pixi.js';
import { setEngine } from './app/getEngine';
import { LoadScreen } from './app/screens/LoadScreen';
import { MainScreen } from './app/screens/main/MainScreen';
import { userSettings } from './engine/utils/userSettings';
import { CreationEngine } from './engine/engine';

import { waitFor } from './engine/utils/waitFor';
import { gsap } from 'gsap';
import { PixiPlugin } from 'gsap/PixiPlugin';
import { MotionPathPlugin } from 'gsap/all';
import { GameConfig } from './configuration/Config';

gsap.registerPlugin(PixiPlugin);
gsap.registerPlugin(MotionPathPlugin);
PixiPlugin.registerPIXI(PIXI);

export const loadGame = async () => {
	// Create a new creation engine instance
	const engine = new CreationEngine();
	setEngine(engine);

	// Initialize the creation engine instance

	await engine.init({
		background: GameConfig.FLOOR_BGCOLOR,
		backgroundAlpha: 0.0,
		resizeOptions: { minWidth: 768, minHeight: 1024, letterbox: false }
	});
	// Initialize the user settings
	userSettings.init();

	// Show the load screen
	await engine.navigation.showScreen(LoadScreen);
	await PIXI.Assets.loadBundle(['main', 'spines', 'tutorial', 'gamble']);

	await waitFor(1.5);

	await engine.navigation.showScreen(MainScreen);
};
