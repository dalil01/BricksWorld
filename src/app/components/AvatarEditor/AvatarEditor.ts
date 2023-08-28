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
	CLICKABLE_MAX = "avatar-editor-clickable-max",
	COLOR_CONTAINER = "avatar-editor-color-container",
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
		const title = UDom.h3({ innerText: "Models", className: AVATAR_EDITOR_CSS.TITLE });
		this.content.appendChild(title);

		const container = UDom.div({ className: AVATAR_EDITOR_CSS.SUB_CONTENT });


		let currentColor = Experience.get().getModelManager().getAvatar().getColor();

		const noneModelsDiv = UDom.div({ className: AVATAR_EDITOR_CSS.CLICKABLE + ' ' + AVATAR_EDITOR_CSS.CLICKABLE_MAX });
		noneModelsDiv.addEventListener("click", () => {
			Experience.get().getModelManager().getAvatar().removeModel();
		});
		const noneModelsImg = UIcon.doNotDisturb();
		UDom.AC(container, UDom.AC(noneModelsDiv, noneModelsImg));

		for (const [name, data] of Object.entries(Vars.PATH.AVATAR.MODELS)) {
			const modelsDiv = UDom.div({ className: AVATAR_EDITOR_CSS.CLICKABLE + ' ' + AVATAR_EDITOR_CSS.CLICKABLE_MAX });
			modelsDiv.addEventListener("click", () => {
				const avatar = Experience.get().getModelManager().getAvatar();
				avatar.applyModel(data.data);
			});

			const modelsImg = UDom.img({ src: data.IMG });

			UDom.AC(container, UDom.AC(modelsDiv, modelsImg));
		}

		this.content.appendChild(container);

		const modelsColorContainer = UDom.div({ className: AVATAR_EDITOR_CSS.COLOR_CONTAINER });

		const avatarColor = UDom.input({ type: "color", value: currentColor, className: AVATAR_EDITOR_CSS.COLOR });
		avatarColor.addEventListener("input", (e) => {
			currentColor = avatarColor.value;
			Experience.get().getModelManager().getAvatar().changeColor(currentColor);
		});
		UDom.AC(modelsColorContainer, avatarColor);

		UDom.AC(this.content, modelsColorContainer);
	}

	private buildHead(): void {
		this.buildHairs();
		this.buildBrowns();
		this.buildEyes();
		this.buildMouth();
		this.buildHeadExtras();
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

		const avatar = Experience.get().getModelManager().getAvatar();

		let currentColor = avatar.getEyesColor();
		let currentIrisColor = avatar.getEyesIrisColor();

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

		const eyesColorContainer = UDom.div({ className: AVATAR_EDITOR_CSS.COLOR_CONTAINER });

		const eyesColor = UDom.input({ type: "color", value: currentColor, className: AVATAR_EDITOR_CSS.COLOR });
		eyesColor.addEventListener("input", (e) => {
			currentColor = eyesColor.value;
			Experience.get().getModelManager().getAvatar().changeEyesColor(currentColor);
		});
		UDom.AC(eyesColorContainer, eyesColor);

		const eyesIrisColor = UDom.input({
			type: "color",
			value: currentIrisColor,
			className: AVATAR_EDITOR_CSS.COLOR,
			title: "Iris color"
		});
		eyesIrisColor.addEventListener("input", (e) => {
			currentIrisColor = eyesIrisColor.value;
			Experience.get().getModelManager().getAvatar().changeEyesIrisColor(currentIrisColor);
		});
		UDom.AC(eyesColorContainer, eyesIrisColor);

		UDom.AC(this.content, eyesColorContainer);
	}

	private buildMouth(): void {
		const title = UDom.h3({ innerText: "Mouth", className: AVATAR_EDITOR_CSS.TITLE });
		this.content.appendChild(title);

		const container = UDom.div({ className: AVATAR_EDITOR_CSS.SUB_CONTENT });

		const noneMouthDiv = UDom.div({ className: AVATAR_EDITOR_CSS.CLICKABLE + ' ' + AVATAR_EDITOR_CSS.CLICKABLE_MIN });
		noneMouthDiv.addEventListener("click", () => {
			Experience.get().getModelManager().getAvatar().removeMouth();
		});
		const noneMouthImg = UIcon.doNotDisturb();
		UDom.AC(container, UDom.AC(noneMouthDiv, noneMouthImg));

		const avatar = Experience.get().getModelManager().getAvatar();

		let currentColor = avatar.getMouthColor();
		let currentTeethColor = avatar.getMouthTeethColor();
		let currentTongueColor = avatar.getMouthTongueColor();

		for (const [name, data] of Object.entries(Vars.PATH.AVATAR.MOUTHS)) {
			const mouthDiv = UDom.div({ className: AVATAR_EDITOR_CSS.CLICKABLE + ' ' + AVATAR_EDITOR_CSS.CLICKABLE_MIN });
			mouthDiv.addEventListener("click", () => {
				const avatar = Experience.get().getModelManager().getAvatar();
				avatar.addMouth(name);
			});

			const mouthImg = UDom.img({ src: data.IMG });

			UDom.AC(container, UDom.AC(mouthDiv, mouthImg));
		}

		this.content.appendChild(container);

		const mouthColorContainer = UDom.div({ className: AVATAR_EDITOR_CSS.COLOR_CONTAINER });

		const mouthColor = UDom.input({ type: "color", value: currentColor, className: AVATAR_EDITOR_CSS.COLOR });
		mouthColor.addEventListener("input", (e) => {
			currentColor = mouthColor.value;
			Experience.get().getModelManager().getAvatar().changeMouthColor(currentColor);
		});
		UDom.AC(mouthColorContainer, mouthColor);

		const mouthTeethColor = UDom.input({
			type: "color",
			value: currentTeethColor,
			className: AVATAR_EDITOR_CSS.COLOR,
			title: "Teeth color"
		});
		mouthTeethColor.addEventListener("input", (e) => {
			currentTeethColor = mouthTeethColor.value;
			Experience.get().getModelManager().getAvatar().changeMouthTeethColor(currentTeethColor);
		});
		UDom.AC(mouthColorContainer, mouthTeethColor);

		const mouthTongueColor = UDom.input({
			type: "color",
			value: currentTongueColor,
			className: AVATAR_EDITOR_CSS.COLOR,
			title: "Tongue color"
		});
		mouthTongueColor.addEventListener("input", (e) => {
			currentTongueColor = mouthTongueColor.value;
			Experience.get().getModelManager().getAvatar().changeMouthTongueColor(currentTongueColor);
		});
		UDom.AC(mouthColorContainer, mouthTongueColor);

		UDom.AC(this.content, mouthColorContainer);
	}

	private buildHeadExtras(): void {
		const title = UDom.h3({ innerText: "Extras", className: AVATAR_EDITOR_CSS.TITLE });
		this.content.appendChild(title);

		const container = UDom.div({ className: AVATAR_EDITOR_CSS.SUB_CONTENT });

		const noneExtraDiv = UDom.div({ className: AVATAR_EDITOR_CSS.CLICKABLE });
		noneExtraDiv.addEventListener("click", () => {
			Experience.get().getModelManager().getAvatar().removeHeadExtra();
		});
		const noneExtraImg = UIcon.doNotDisturb();
		UDom.AC(container, UDom.AC(noneExtraDiv, noneExtraImg));

		const avatar = Experience.get().getModelManager().getAvatar();

		let currentColor = avatar.getHeadExtraColor();
		for (const [name, data] of Object.entries(Vars.PATH.AVATAR.HEAD_EXTRAS)) {
			const headExtraDiv = UDom.div({ className: AVATAR_EDITOR_CSS.CLICKABLE });
			headExtraDiv.addEventListener("click", () => {
				const avatar = Experience.get().getModelManager().getAvatar();
				avatar.addHeadExtra(name);
			});

			const headExtraImg = UDom.img({ src: data.IMG });

			UDom.AC(container, UDom.AC(headExtraDiv, headExtraImg));
		}

		this.content.appendChild(container);

		const headExtraColorContainer = UDom.div({ className: AVATAR_EDITOR_CSS.COLOR_CONTAINER });

		const headExtraColor = UDom.input({ type: "color", value: currentColor, className: AVATAR_EDITOR_CSS.COLOR });
		headExtraColor.addEventListener("input", (e) => {
			currentColor = headExtraColor.value;
			Experience.get().getModelManager().getAvatar().changeHeadExtraColor(currentColor);
		});
		UDom.AC(headExtraColorContainer, headExtraColor);

		UDom.AC(this.content, headExtraColorContainer);
	}

	private buildChest(): void {
		const title = UDom.h3({ innerText: "Chest", className: AVATAR_EDITOR_CSS.TITLE });
		this.content.appendChild(title);

		const container = UDom.div({ className: AVATAR_EDITOR_CSS.SUB_CONTENT });

		const avatar = Experience.get().getModelManager().getAvatar();

		let currentColor = avatar.getChestColor();
		let currentChestObj1Color = avatar.getChestObj1Color();
		let currentChestObj2Color = avatar.getChestObj2Color();

		const noneChestDiv = UDom.div({ className: AVATAR_EDITOR_CSS.CLICKABLE });
		noneChestDiv.addEventListener("click", () => {
			Experience.get().getModelManager().getAvatar().removeChest();
		});
		const noneChestImg = UIcon.doNotDisturb();
		UDom.AC(container, UDom.AC(noneChestDiv, noneChestImg));

		for (const [name, data] of Object.entries(Vars.PATH.AVATAR.CHESTS)) {
			const chestDiv = UDom.div({ className: AVATAR_EDITOR_CSS.CLICKABLE });
			chestDiv.addEventListener("click", () => {
				const avatar = Experience.get().getModelManager().getAvatar();
				avatar.addChest(name);
			});

			const chestImg = UDom.img({ src: data.IMG });

			UDom.AC(container, UDom.AC(chestDiv, chestImg));
		}

		this.content.appendChild(container);

		const chestColorContainer = UDom.div({ className: AVATAR_EDITOR_CSS.COLOR_CONTAINER });

		const chestColor = UDom.input({ type: "color", value: currentColor, className: AVATAR_EDITOR_CSS.COLOR });
		chestColor.addEventListener("input", (e) => {
			currentColor = chestColor.value;
			Experience.get().getModelManager().getAvatar().changeChestColor(currentColor);
		});
		UDom.AC(chestColorContainer, chestColor);

		const chestObj1Color = UDom.input({ type: "color", value: currentChestObj1Color, className: AVATAR_EDITOR_CSS.COLOR });
		chestObj1Color.addEventListener("input", (e) => {
			currentChestObj1Color = chestObj1Color.value;
			Experience.get().getModelManager().getAvatar().changeChestObj1Color(currentChestObj1Color);
		});
		UDom.AC(chestColorContainer, chestObj1Color);

		const chestObj2Color = UDom.input({ type: "color", value: currentChestObj2Color, className: AVATAR_EDITOR_CSS.COLOR });
		chestObj2Color.addEventListener("input", (e) => {
			currentChestObj2Color = chestObj2Color.value;
			Experience.get().getModelManager().getAvatar().changeChestObj2Color(currentChestObj2Color);
		});
		UDom.AC(chestColorContainer, chestObj2Color);

		UDom.AC(this.content, chestColorContainer);
	}

	private buildLegs(): void {
		const title = UDom.h3({ innerText: "Legs", className: AVATAR_EDITOR_CSS.TITLE });
		this.content.appendChild(title);

		const container = UDom.div({ className: AVATAR_EDITOR_CSS.SUB_CONTENT });

		const avatar = Experience.get().getModelManager().getAvatar();

		let currentColor = avatar.getLegsColor();
		let currentLegsObj1Color = avatar.getLegsObj1Color();

		const noneLegsDiv = UDom.div({ className: AVATAR_EDITOR_CSS.CLICKABLE });
		noneLegsDiv.addEventListener("click", () => {
			Experience.get().getModelManager().getAvatar().removeLegs();
		});
		const noneLegsImg = UIcon.doNotDisturb();
		UDom.AC(container, UDom.AC(noneLegsDiv, noneLegsImg));

		for (const [name, data] of Object.entries(Vars.PATH.AVATAR.lEGS)) {
			const legsDiv = UDom.div({ className: AVATAR_EDITOR_CSS.CLICKABLE });
			legsDiv.addEventListener("click", () => {
				const avatar = Experience.get().getModelManager().getAvatar();
				avatar.addLegs(name);
			});

			const legsImg = UDom.img({ src: data.IMG });

			UDom.AC(container, UDom.AC(legsDiv, legsImg));
		}

		this.content.appendChild(container);

		const legsColorContainer = UDom.div({ className: AVATAR_EDITOR_CSS.COLOR_CONTAINER });

		const legsColor = UDom.input({ type: "color", value: currentColor, className: AVATAR_EDITOR_CSS.COLOR });
		legsColor.addEventListener("input", (e) => {
			currentColor = legsColor.value;
			Experience.get().getModelManager().getAvatar().changeLegsColor(currentColor);
		});
		UDom.AC(legsColorContainer, legsColor);

		const legsObj1Color = UDom.input({ type: "color", value: currentLegsObj1Color, className: AVATAR_EDITOR_CSS.COLOR });
		legsObj1Color.addEventListener("input", (e) => {
			currentLegsObj1Color = legsObj1Color.value;
			Experience.get().getModelManager().getAvatar().changeLegsObj1Color(currentLegsObj1Color);
		});
		UDom.AC(legsColorContainer, legsObj1Color);

		UDom.AC(this.content, legsColorContainer);
	}

}