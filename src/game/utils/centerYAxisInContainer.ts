import * as PIXI from 'pixi.js';

export function centerYContainer(container: PIXI.Container, gap: number = 20) {
	const children = container.children;

	const maxWidth = children.reduce((max, obj) => Math.max(max, obj.width), 0);
	let currY = 0;
	children.map((child, i) => {
		const yGap = i ? gap : 0;
		child.x = maxWidth / 2 - child.width / 2;
		child.y = currY;

		currY += child.height + gap;
	});
}
