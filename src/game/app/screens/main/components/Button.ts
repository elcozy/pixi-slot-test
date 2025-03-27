import * as PIXI from 'pixi.js';

interface IPixiBtn {
	action: () => void;
	x: number;
	y: number;
	width: number;
	height: number;
	color?: number;
	text: string;
}

export class CPixiBtn extends PIXI.Container {
	private props: IPixiBtn;

	public graphics!: PIXI.Graphics;
	public text!: PIXI.Text;
	constructor(props: IPixiBtn) {
		super();
		this.props = props;
		this.props.color = this.props.color ?? 0xff0000;
		this.create();
	}

	create() {
		this.graphics = new PIXI.Graphics();
		const { x, y, width, height, action, color, text: title } = this.props;
		this.graphics.roundRect(0, 0, width, height, height * 0.2).fill(color);

		this.position.set(x, y);
		this.eventMode = 'static';
		this.cursor = 'pointer';
		this.text = new PIXI.Text({
			text: title
		});
		this.text.anchor.set(0.5, 0.5);
		this.text.position.set(this.graphics.width / 2, this.graphics.height / 2);
		this.text.scale.x = this.text.scale.y = Math.min(
			(this.graphics.width * 0.8) / this.text.width,
			(this.graphics.height * 0.8) / this.text.height
		);

		this.on('pointerdown', action);

		this.addChild(this.graphics, this.text);
	}
}
