import "./StartMenu.css";

import { Component } from "../Component";
import { UDom } from "../../utils/UDom";
import { AvatarEditor } from "../AvatarEditor/AvatarEditor";
import { Experience } from "../../Experience";
import { WorldName } from "../../models/World/World";
import { Vars } from "../../../Vars";

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

		this.buildExplorer();

	}

	private buildExplorer(): void {
		const worldsSelect = UDom.select({});

		for (const [key, worldName] of Object.entries(WorldName)) {
			worldsSelect.add(UDom.option({ value: key, innerText: worldName }));
		}

		const button = UDom.CE("button", { innerText: "Explore" });
		button.addEventListener("click", () =>  {
			Vars.CURRENT_WORLD = WorldName[worldsSelect.value];
			this.destroy();
			Experience.get().getViewManager().switchToWorldView();
		});

		UDom.AC(this.mainElement, worldsSelect, button);
	}

}