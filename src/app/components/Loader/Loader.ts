import "./Loader.css";

import { Component } from "../Component";
import { UDom } from "../../utils/UDom";
import { Vars } from "../../../Vars";

enum LOADER_CSS {
	CONTAINER = "loader-container",
	LOADER = "loader"
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
		const logo = UDom.img({ src: Vars.PATH.LOGO });
		this.mainElement.appendChild(logo);
	}

	public show(): void {
		this.mainElement.style.display = "flex";
	}

	public hide(): void {
		this.mainElement.style.display = "none";
	}

}