import { loadGame } from './game/main';
import { engine } from './game/app/getEngine';
import './index.css';
import { GameConfig } from './game/configuration/Config';

console.log('GameConfig.REEL_DURATION', GameConfig.REEL_DURATION);
loadGame();

window.addEventListener('beforeunload', function () {
	engine()?.destroy();
});
