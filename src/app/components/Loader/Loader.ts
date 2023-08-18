import "./Loader.css";

import { Component } from "../Component";
import { UDom } from "../../utils/UDom";

enum LOADER_CSS {
	CONTAINER = "loader-container"
}

/**
 * @Loader
 * Inspired from https://codepen.io/Keyon/pen/jXjMKj
 */
export class Loader extends Component {

	public constructor(parentElement: HTMLElement, autoInit: boolean = false) {
		super(parentElement, UDom.CE("div", { className: LOADER_CSS.CONTAINER }), autoInit);
	}


	protected buildUI(): void {
		const text = UDom.p({ innerText: "Loading..." });


		this.mainElement.appendChild(text);
	}

	public show(): void {
		this.mainElement.style.display = "block";
	}

	public hide(): void {
		this.mainElement.style.display = "none";
	}

}