import "./StartMenu.css";

import { Component } from "../Component";
import { UDom } from "../../utils/UDom";
import { AvatarEditor } from "../AvatarEditor/AvatarEditor";
import { Experience } from "../../Experience";

enum START_MENU_CSS {
	CONTAINER = "start-menu-container"
}

export const START_MENU_MIN_WIDTH = 968;

export class StartMenu extends Component {

	public constructor(parentElement: HTMLElement, autoInit: boolean = false) {
		super(parentElement, UDom.CE("div", { className: START_MENU_CSS.CONTAINER }), autoInit);
	}

	protected buildUI(): void {
		//new AvatarEditor(this.mainElement, true);

		const startBtn = UDom.CE("button", { innerText: "Start" });
		startBtn.addEventListener("click", () =>  {
			this.destroy();
			Experience.get().getViewManager().switchToWorldView();
		});

		this.mainElement.appendChild(startBtn);
	}

}