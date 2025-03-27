import type { Container } from 'pixi.js';

export function destroyChildren(container: Container): Promise<void> {
	return new Promise((resolve) => {
		if (container.children.length === 0) {
			return resolve();
		}

		while (container.children.length > 0) {
			const child = container.children[container.children.length - 1];
			child.destroy(); //
			container.removeChild(child); //
			if (container.children.length === 0) {
				return resolve();
			}
		}
	});
}
