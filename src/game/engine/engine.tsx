import type {
	ApplicationOptions,
	DestroyOptions,
	RendererDestroyOptions,
	WebGLRenderer
} from 'pixi.js';
import { Application, Assets, extensions, ResizePlugin, sayHello } from 'pixi.js';
import 'pixi.js/app';
import { createRoot } from 'react-dom/client';
import { GameControls } from '@/game/app/components/GameControls';

// @ts-ignore
import manifest from '../../manifest.json';

import { CreationNavigationPlugin } from './navigation/NavigationPlugin';
import { CreationResizePlugin } from './resize/ResizePlugin';
import { getResolution } from './utils/getResolution';

extensions.remove(ResizePlugin);
extensions.add(CreationResizePlugin);
extensions.add(CreationNavigationPlugin);

export class CreationEngine extends Application {
	/** Initialize the application */
	public async init(opts: Partial<ApplicationOptions>): Promise<void> {
		opts.resizeTo ??= window;
		opts.resolution ??= getResolution();

		await super.init(opts);

		const gl = (this.renderer as WebGLRenderer).gl;

		const webglVersion = gl instanceof WebGL2RenderingContext ? 'WebGL 2' : 'WebGL 1';

		sayHello('Xciting Tech - ' + webglVersion);

		const targetElement = document.getElementById('app') as HTMLElement;
		targetElement.appendChild(this.canvas);

		renderGameControls(targetElement);

		document.addEventListener('visibilitychange', this.visibilityChange);

		await Assets.init({ manifest, basePath: 'assets' });
		await Assets.loadBundle('font');
		await Assets.loadBundle('preload');

		const allBundles = manifest.bundles.map((item) => item.name);
		Assets.backgroundLoadBundle(allBundles);
	}

	public override destroy(
		rendererDestroyOptions: RendererDestroyOptions = false,
		options: DestroyOptions = { children: true }
	): void {
		document.removeEventListener('visibilitychange', this.visibilityChange);

		super.destroy(rendererDestroyOptions, options);
	}

	protected visibilityChange = () => {
		if (document.hidden) {
			this.navigation.blur();
		} else {
			this.navigation.focus();
		}
	};
}

function renderGameControls(targetElement: HTMLElement) {
	const appContainer = document.createElement('div');
	appContainer.id = 'game-controls';

	const root = createRoot(appContainer);

	targetElement.appendChild(appContainer);
	root.render(<GameControls />);
}
