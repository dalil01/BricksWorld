import "./AvatarEditor.css"

import { Component } from "../Component";
import { UDom } from "../../utils/UDom";
import { UIcon } from "../../utils/UIcon";
import { Vars } from "../../../Vars";

enum AVATAR_EDITOR_CSS {
	CONTAINER = "avatar-editor-container",
	CONTENT = "avatar-editor-content",
	HEADER = "avatar-editor-header",
}

export enum AVATAR_EDITOR_VIEW {
	MODELS,
	HEAD,
	CHEST,
	LEGS
}

export class AvatarEditor extends Component {

	private content!: HTMLElement;

	public constructor(parentElement: HTMLElement, autoInit: boolean = false) {
		super(parentElement, UDom.div({ className: AVATAR_EDITOR_CSS.CONTAINER }), autoInit);
	}

	protected buildUI(): void {
		const header = UDom.div({ className: AVATAR_EDITOR_CSS.HEADER });

		const modelsBtn = UIcon.models();
		modelsBtn.addEventListener("click", () => {
			this.changeView(AVATAR_EDITOR_VIEW.MODELS);
		});

		const headBtn = UIcon.legoHead();
		headBtn.addEventListener("click", () => {
			this.changeView(AVATAR_EDITOR_VIEW.HEAD);
		});

		const chestBtn = UIcon.chest();
		chestBtn.addEventListener("click", () => {
			this.changeView(AVATAR_EDITOR_VIEW.CHEST);
		});

		const legsBtn = UIcon.legs();
		legsBtn.addEventListener("click", () => {
			this.changeView(AVATAR_EDITOR_VIEW.LEGS);
		});

		UDom.AC(this.mainElement, UDom.AC(header, modelsBtn, headBtn, chestBtn, legsBtn));

		this.content = UDom.div({ className: AVATAR_EDITOR_CSS.CONTENT });
		this.buildModels();

		this.mainElement.appendChild(this.content);
	}

	private changeView(view: AVATAR_EDITOR_VIEW): void {
		UDom.removeAllChildren(this.content);

		switch (view) {
			case AVATAR_EDITOR_VIEW.MODELS:
				this.buildModels();
				break;
			case AVATAR_EDITOR_VIEW.HEAD:
				this.buildHead();
				break;
			case AVATAR_EDITOR_VIEW.CHEST:
				this.buildChest();
				break;
			case AVATAR_EDITOR_VIEW.LEGS:
				this.buildLegs();
				break;
		}
	}

	private buildModels(): void {
		const container = UDom.div({ innerText: "Models" });
		this.content.appendChild(container);
	}

	private buildHead(): void {
		const container = UDom.div({ innerText: "Head" });
		this.content.appendChild(container);
	}

	private buildChest(): void {
		const container = UDom.div({ innerText: "Chest" });
		this.content.appendChild(container);
	}

	private buildLegs(): void {
		const container = UDom.div({ innerText: "Legs" });
		this.content.appendChild(container);
	}

}