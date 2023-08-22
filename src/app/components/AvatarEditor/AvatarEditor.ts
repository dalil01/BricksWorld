import "./AvatarEditor.css"

import { Component } from "../Component";
import { UDom } from "../../utils/UDom";
import { UIcon } from "../../utils/UIcon";
import { Vars } from "../../../Vars";
import { Experience } from "../../Experience";

enum AVATAR_EDITOR_CSS {
	CONTAINER = "avatar-editor-container",
	CONTENT = "avatar-editor-content",
	HEADER = "avatar-editor-header",
	TITLE = "avatar-editor-title",
	SUB_CONTENT = "avatar-editor-sub-content",
	CLICKABLE = "avatar-editor-clickable",
	COLOR = "avatar-editor-color"
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
			Experience.get().getModelManager().getAvatar().moveCameraToModelsView();
		});

		const headBtn = UIcon.legoHead();
		headBtn.addEventListener("click", () => {
			this.changeView(AVATAR_EDITOR_VIEW.HEAD);
			Experience.get().getModelManager().getAvatar().moveCameraToHeadView();
		});

		const chestBtn = UIcon.chest();
		chestBtn.addEventListener("click", () => {
			this.changeView(AVATAR_EDITOR_VIEW.CHEST);
			Experience.get().getModelManager().getAvatar().moveCameraToChestView();
		});

		const legsBtn = UIcon.legs();
		legsBtn.addEventListener("click", () => {
			this.changeView(AVATAR_EDITOR_VIEW.LEGS);
			Experience.get().getModelManager().getAvatar().moveCameraToLegsView();
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
		this.buildHairs();

	}

	private buildHairs(): void {
		const title = UDom.h3({ innerText: "Hairs", className: AVATAR_EDITOR_CSS.TITLE });
		this.content.appendChild(title);

		const container = UDom.div({ className: AVATAR_EDITOR_CSS.SUB_CONTENT });

		const noneHairDiv = UDom.div({ className: AVATAR_EDITOR_CSS.CLICKABLE });
		noneHairDiv.addEventListener("click", () => {
			Experience.get().getModelManager().getAvatar().removeHair();
		});
		const noneHairImg = UIcon.doNotDisturb();
		UDom.AC(container, UDom.AC(noneHairDiv, noneHairImg));

		for (const hairPath of Object.values(Vars.PATH.AVATAR.HAIRS)) {
			const hairDiv = UDom.div({ className: AVATAR_EDITOR_CSS.CLICKABLE });
			hairDiv.addEventListener("click", () => {
				const avatar = Experience.get().getModelManager().getAvatar();
				avatar.loadHair(hairPath.id, hairPath.MODEL).then(() => {
					avatar.changeHairColor(hairPath.COLOR);
				})
			})

			const hairImg = UDom.img({ src: hairPath.IMG });

			UDom.AC(container, UDom.AC(hairDiv, hairImg));
		}

		this.content.appendChild(container);

		const hairColor = UDom.input({ type: "color", className: AVATAR_EDITOR_CSS.COLOR });
		hairColor.addEventListener("input", (e) => {
			Experience.get().getModelManager().getAvatar().changeHairColor(hairColor.value);
		});
		UDom.AC(this.content, hairColor);
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