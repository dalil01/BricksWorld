import "./StartMenu.css";

import { Component } from "../Component";
import { UDom } from "../../utils/UDom";
import { Experience } from "../../Experience";
import { WorldName } from "../../models/World/World";
import { Vars } from "../../../Vars";
import { AvatarEditor } from "../AvatarEditor/AvatarEditor";
import { UNavigator } from "../../utils/UNavigator";
import { UIcon } from "../../utils/UIcon";

enum START_MENU_CSS {
	CONTAINER = "start-menu-container",
	EXPLORER_CONTAINER = "explorer-container",
	EXPLORER_CONTENT = "explorer-content",
	EXPLORER_SELECT = "explorer-select",
	EXPLORER_SELECT_OPTION = "explorer-select-option",
	EXPLORER_BUTTON = "explorer-button",
	EXPLORER_SWITCH_MSG = "explorer-switch-msg"
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

		const exploreContent = UDom.div({ className: START_MENU_CSS.EXPLORER_CONTENT });

		if (UNavigator.isMobileDevice()) {
			const switchToComputerEl = UDom.h2({  className: START_MENU_CSS.EXPLORER_SWITCH_MSG, innerText: "To explore the different worlds available, please use a computer!" });
			UDom.AC(container, title, switchToComputerEl);
		} else {
			const worldsSelect = UDom.select({ className: START_MENU_CSS.EXPLORER_SELECT });

			for (const [key, worldName] of Object.entries(WorldName)) {
				worldsSelect.add(UDom.option({ className: START_MENU_CSS.EXPLORER_SELECT_OPTION, value: key, innerText: worldName }));
			}

			const button = UIcon.playArrowOutline({ className: START_MENU_CSS.EXPLORER_BUTTON });
			button.addEventListener("click", () => {
				Vars.CURRENT_WORLD = WorldName[worldsSelect.value];
				if (Vars.CURRENT_WORLD) {
					this.destroy();
					Experience.get().getViewManager().switchToWorldView();
				}
			});

			UDom.AC(container, title, UDom.AC(exploreContent, worldsSelect, button));
		}

		this.mainElement.appendChild(container);
	}

}