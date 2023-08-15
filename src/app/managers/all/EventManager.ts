import { Manager } from "../Manager";

export enum EventType {
	KEYDOWN,
	KEYUP,
	MOUSEMOVE
}

export class EventManager extends Manager {

	private keydownCallbacks: Function[] = [];
	private keyupCallbacks: Function[] = [];
	private mousemoveCallbacks: Function[] = [];

	public start(): void {
		document.addEventListener("keydown", (ev) => {
			for (let i = 0; i < this.keydownCallbacks.length; i++) {
				this.keydownCallbacks[i](ev);
			}
		});

		document.addEventListener("keyup", (ev) => {
			for (let i = 0; i < this.keyupCallbacks.length; i++) {
				this.keyupCallbacks[i](ev);
			}
		});

		document.addEventListener("mousemove", (ev) => {
			for (let i = 0; i < this.mousemoveCallbacks.length; i++) {
				this.mousemoveCallbacks[i](ev);
			}
		});
	}

	public stop(): void {
		// TODO : Remove event listeners

	}

	public pushCallback(event: EventType, callback: Function): void {
		switch (event) {
			case EventType.KEYDOWN:
				this.keydownCallbacks.push(callback);
				break;
			case EventType.KEYUP:
				this.keyupCallbacks.push(callback);
				break;
			case EventType.MOUSEMOVE:
				this.mousemoveCallbacks.push(callback);
				break;
		}
	}

	public update(): void {
	}

	public animate(): void {
	}

}