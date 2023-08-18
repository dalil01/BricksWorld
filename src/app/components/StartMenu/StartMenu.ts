import "./StartMenu.css";

import { Component } from "../Component";
import { UDom } from "../../utils/UDom";
import { Experience } from "../../Experience";
import { WorldName } from "../../models/World/World";
import { Vars } from "../../../Vars";
import { AvatarEditor } from "../AvatarEditor/AvatarEditor";
import { UNavigator } from "../../utils/UNavigator";

enum START_MENU_CSS {
	CONTAINER = "start-menu-container",
	EXPLORER_CONTAINER = "explorer-container"
}

export const START_MENU_MIN_WIDTH = 968;

export class StartMenu extends Component {

	public constructor(parentElement: HTMLElement, autoInit: boolean = false) {
		super(parentElement, UDom.CE("div", { className: START_MENU_CSS.CONTAINER }), autoInit);
	}

	protected buildUI(): void {
		new AvatarEditor(this.mainElement, true);

		this.buildExplorer();
	}

	private buildExplorer(): void {
		const container = UDom.div({ className: START_MENU_CSS.EXPLORER_CONTAINER })

		const title = UDom.h2({ innerText: "Explore " });

		if (UNavigator.isMobileDevice()) {
			// TODO : Improve style
			const switchToComputerEl = UDom.h2({ innerText: "To explore the different worlds available, please use a computer !" });
			UDom.AC(container, title, switchToComputerEl);
		} else {
			const worldsSelect = UDom.select({});

			for (const [key, worldName] of Object.entries(WorldName)) {
				worldsSelect.add(UDom.option({ value: key, innerText: worldName }));
			}

			const button = UDom.CE("button", { innerText: " -> " });
			button.addEventListener("click", () => {
				Vars.CURRENT_WORLD = WorldName[worldsSelect.value];
				if (Vars.CURRENT_WORLD) {
					this.destroy();
					Experience.get().getViewManager().switchToWorldView();
				}
			});

			UDom.AC(container, title, worldsSelect, button);
		}

		this.mainElement.appendChild(container);
	}

}