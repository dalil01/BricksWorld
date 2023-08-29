import "./Header.css";

import { Component } from "../Component";
import { UDom } from "../../utils/UDom";
import { Vars } from "../../../Vars";
import { UIcon } from "../../utils/UIcon";
import { Experience } from "../../Experience";

enum HEADER_CSS {
	CONTAINER = "header-container",
	LEFT = "header-left",
	LOGO = "header-logo",
	CURRENT_WORLD_NAME = "header-current-world-name",
	RIGHT = "header-right",
	CLOSE_WORLD_ICON = "header-close-world-icon",
}

export class Header extends Component {

	public constructor(parentElement: HTMLElement, autoInit: boolean = false) {
		super(parentElement, UDom.CE("div", { className: HEADER_CSS.CONTAINER }), autoInit);
	}

	protected buildUI(): void {
		const leftContainer = UDom.div({ className: HEADER_CSS.LEFT });

		const logo = UDom.img({ src: Vars.PATH.LOGO, className: HEADER_CSS.LOGO });
		leftContainer.appendChild(logo);

		if (Vars.CURRENT_WORLD) {
			const currentWorldName = UDom.h2({ innerText: Vars.CURRENT_WORLD, className: HEADER_CSS.CURRENT_WORLD_NAME })
			UDom.AC(leftContainer, currentWorldName);
		}

		const rightContainer = UDom.div({ className: HEADER_CSS.RIGHT });

		if (Vars.CURRENT_WORLD) {
			const closeIconSpan = UIcon.closeCircle({ className: HEADER_CSS.CLOSE_WORLD_ICON });
			closeIconSpan.addEventListener("click", () => {
				Vars.CURRENT_WORLD = null;
				Experience.get().stop();
			});

			UDom.AC(rightContainer, closeIconSpan);
		}

		UDom.AC(this.mainElement, leftContainer, rightContainer);
	}


}