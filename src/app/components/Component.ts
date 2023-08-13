import { UDom } from "../utils/UDom";

export abstract class Component {

	protected parentElement: HTMLElement;
	protected mainElement: HTMLElement;

	protected initiated: boolean;

	protected constructor(parentElement: HTMLElement, mainElement: HTMLElement, autoInit: boolean = false) {
		this.parentElement = parentElement;
		this.mainElement = mainElement;
		this.initiated = false;
		if (autoInit) {
			this.init();
		}
	}

	public getParentElement(): HTMLElement {
		return this.parentElement;
	}

	public getMainElement(): HTMLElement {
		return this.mainElement;
	}

	public isInitiated(): boolean {
		return this.initiated;
	}

	public setParentElement(parentElement: HTMLElement): void {
		this.parentElement = parentElement;
	}

	public setMainElement(mainElement: HTMLElement): void {
		this.mainElement = mainElement;
	}

	public init(): void {
		if (!this.initiated) {
			this.buildUI();
			this.parentElement.appendChild(this.mainElement);
			this.initiated = true;
		}
	}

	public destroy(): void {
		if (this.initiated) {
			UDom.removeAllChildren(this.mainElement);
			this.parentElement.removeChild(this.mainElement);
			this.initiated = false;
		}
	}

	public update(): void {
		UDom.removeAllChildren(this.mainElement);
		this.initiated = false;
		this.init();
	}

	protected buildUI(): void {
		throw new Error("This method must be implemented.");
	}

}