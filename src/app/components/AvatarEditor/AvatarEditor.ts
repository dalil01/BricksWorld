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
	CLICKABLE_MIN = "avatar-editor-clickable-min",
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

		UDom.AC(this.mainElement,
			UDom.AC(header,
				UDom.AC(UDom.div(), modelsBtn),
				UDom.AC(UDom.div(), headBtn),
				UDom.AC(UDom.div(), chestBtn),
				UDom.AC(UDom.div(), legsBtn)
			)
		);

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
		this.buildBrowns();
		this.buildEyes();
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

		let currentColor = Experience.get().getModelManager().getAvatar().getHairColor();
		let inputColorChanged = false;
		for (const [name, data] of Object.entries(Vars.PATH.AVATAR.HAIRS)) {
			const hairDiv = UDom.div({ className: AVATAR_EDITOR_CSS.CLICKABLE });
			hairDiv.addEventListener("click", () => {
				const avatar = Experience.get().getModelManager().getAvatar();
				avatar.addHair(name);
				if (!inputColorChanged) {
					avatar.changeHairColor(data.COLOR);
				}
			});

			const hairImg = UDom.img({ src: data.IMG });

			UDom.AC(container, UDom.AC(hairDiv, hairImg));
		}

		this.content.appendChild(container);

		const hairColor = UDom.input({ type: "color", value: currentColor, className: AVATAR_EDITOR_CSS.COLOR });
		hairColor.addEventListener("input", (e) => {
			currentColor = hairColor.value;
			Experience.get().getModelManager().getAvatar().changeHairColor(currentColor);
			inputColorChanged = true;
		});
		UDom.AC(this.content, hairColor);
	}

	private buildBrowns(): void {
		const title = UDom.h3({ innerText: "Brows", className: AVATAR_EDITOR_CSS.TITLE });
		this.content.appendChild(title);

		const container = UDom.div({ className: AVATAR_EDITOR_CSS.SUB_CONTENT });

		const noneBrowsDiv = UDom.div({ className: AVATAR_EDITOR_CSS.CLICKABLE + ' ' + AVATAR_EDITOR_CSS.CLICKABLE_MIN });
		noneBrowsDiv.addEventListener("click", () => {
			Experience.get().getModelManager().getAvatar().removeBrows();
		});
		const noneBrowsImg = UIcon.doNotDisturb();
		UDom.AC(container, UDom.AC(noneBrowsDiv, noneBrowsImg));

		let currentColor = Experience.get().getModelManager().getAvatar().getBrowsColor();
		for (const [name, data] of Object.entries(Vars.PATH.AVATAR.BROWS)) {
			const browsDiv = UDom.div({ className: AVATAR_EDITOR_CSS.CLICKABLE + ' ' + AVATAR_EDITOR_CSS.CLICKABLE_MIN });
			browsDiv.addEventListener("click", () => {
				const avatar = Experience.get().getModelManager().getAvatar();
				avatar.addBrows(name);
			});

			const browsImg = UDom.img({ src: data.IMG });

			UDom.AC(container, UDom.AC(browsDiv, browsImg));
		}

		this.content.appendChild(container);

		const browsColor = UDom.input({ type: "color", value: currentColor, className: AVATAR_EDITOR_CSS.COLOR });
		browsColor.addEventListener("input", (e) => {
			currentColor = browsColor.value;
			Experience.get().getModelManager().getAvatar().changeBrowsColor(currentColor);
		});
		UDom.AC(this.content, browsColor);
	}

	private buildEyes(): void {
		const title = UDom.h3({ innerText: "Eyes", className: AVATAR_EDITOR_CSS.TITLE });
		this.content.appendChild(title);

		const container = UDom.div({ className: AVATAR_EDITOR_CSS.SUB_CONTENT });

		const noneEyesDiv = UDom.div({ className: AVATAR_EDITOR_CSS.CLICKABLE + ' ' + AVATAR_EDITOR_CSS.CLICKABLE_MIN });
		noneEyesDiv.addEventListener("click", () => {
			Experience.get().getModelManager().getAvatar().removeEyes();
		});
		const noneEyesImg = UIcon.doNotDisturb();
		UDom.AC(container, UDom.AC(noneEyesDiv, noneEyesImg));

		let currentColor = Experience.get().getModelManager().getAvatar().getEyesColor();
		let currentIrisColor = Experience.get().getModelManager().getAvatar().getEyesIrisColor();

		for (const [name, data] of Object.entries(Vars.PATH.AVATAR.EYES)) {
			const eyesDiv = UDom.div({ className: AVATAR_EDITOR_CSS.CLICKABLE + ' ' + AVATAR_EDITOR_CSS.CLICKABLE_MIN });
			eyesDiv.addEventListener("click", () => {
				const avatar = Experience.get().getModelManager().getAvatar();
				avatar.addEyes(name);
			});

			const eyesImg = UDom.img({ src: data.IMG });

			UDom.AC(container, UDom.AC(eyesDiv, eyesImg));
		}

		this.content.appendChild(container);

		const eyesColor = UDom.input({ type: "color", value: currentColor, className: AVATAR_EDITOR_CSS.COLOR });
		eyesColor.addEventListener("input", (e) => {
			currentColor = eyesColor.value;
			Experience.get().getModelManager().getAvatar().changeEyesColor(currentColor);
		});
		UDom.AC(this.content, eyesColor);

		const eyesIrisColor = UDom.input({ type: "color", value: currentIrisColor, className: AVATAR_EDITOR_CSS.COLOR });
		eyesIrisColor.addEventListener("input", (e) => {
			currentIrisColor = eyesIrisColor.value;
			Experience.get().getModelManager().getAvatar().changeEyesIrisColor(currentIrisColor);
		});
		UDom.AC(this.content, eyesIrisColor);
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