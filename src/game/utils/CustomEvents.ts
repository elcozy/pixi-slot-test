import { Log } from './Logger';

export class CustomEvents {
	private static eventsAdded: Record<string, any>;
	private static controlsController: AbortController | null;

	static init() {
		if (this.control) return;
		this.controlsController = new AbortController();
		this.eventsAdded = {};
	}

	static get control() {
		return this.controlsController;
	}

	public static add(
		type: string,
		listener: EventListenerOrEventListenerObject,
		options?: Pick<AddEventListenerOptions, 'once'>
	) {
		if (!this.control) {
			// Log.error('this.control missing');
			this.init();
		}
		this.eventsAdded[type] = listener;

		// Define the event handler
		const handler = (event: Event) => {
			if (typeof listener === 'function') {
				listener.call(this, event);
			} else if (listener && typeof listener.handleEvent === 'function') {
				listener.handleEvent(event);
			}

			if (options?.once) {
				delete this.eventsAdded[type];
			}
		};

		window.addEventListener(type, handler, {
			signal: this.control!.signal,
			...(options?.once ? { once: true } : {})
		});
	}
	public static dispatch(type: string, details: Record<string, any> = {}) {
		window.dispatchEvent(
			new CustomEvent(type, {
				detail: {
					...details
				},
				cancelable: true,
				composed: false
			})
		);
	}
	public static removeAll() {
		Log.log(`XC EControlsEv removelisteners   `, this.eventsAdded);

		for (const [type, listener] of Object.entries(this.eventsAdded)) {
			if (listener) {
				this.removeListeners(type);
				// window.removeEventListener(type, listener as EventListenerOrEventListenerObject);
				// delete this.eventsAdded[type];
			}
		}
	}
	public static removeListeners(eventTypes: string | string[]) {
		// Ensure eventTypes is an array for uniform processing
		const types = Array.isArray(eventTypes) ? eventTypes : [eventTypes];

		// Iterate over each event type
		for (const type of types) {
			const listener = this.eventsAdded[type];
			if (listener) {
				// Remove the event listener from the window
				window.removeEventListener(type, listener as EventListenerOrEventListenerObject);
				// Delete the entry from eventsAdded
				delete this.eventsAdded[type];
			}
		}
		// Log.log(`XC EControlsEv removelisteners   `, eventTypes);
	}

	public static destroy() {
		this.control!.abort();
		this.removeAll();
		Log.log(`XC EControlsEv destroy   `, this.eventsAdded);

		this.controlsController = null;
		// this.eventsAdded = {};
	}
}
