import * as PIXI from 'pixi.js';

/**
 * Moves a child item from its current parent to a new container.
 * @param {PIXI.Container} newParent - The target container to move the child to.
 * @param {PIXI.Container} child - The child item to move (Sprite, Container, Graphics, etc.).
 */
export function moveChildToContainer(newParent: PIXI.Container, child: PIXI.Container) {
	// Check if the child has a parent and if the new parent is the same as the current parent
	if (child.parent === newParent) {
		return; // Do nothing if the parent is the same
	}
	if (!child.destroyed) return;
	const newPosition = child.getGlobalPosition();
	newParent.toLocal(newPosition, undefined, child);

	newParent.addChild(child);
}
