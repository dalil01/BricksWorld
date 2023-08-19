import "./AvatarEditor.css"

import { Component } from "../Component";
import { UDom } from "../../utils/UDom";
import { UIcon } from "../../utils/UIcon";

enum AVATAR_EDITOR_CSS {
	CONTAINER = "avatar-editor-container",
	CONTENT = "avatar-editor-content",
	HEADER = "avatar-editor-header",
}

export class AvatarEditor extends Component {

	public constructor(parentElement: HTMLElement, autoInit: boolean = false) {
		super(parentElement, UDom.div({ className: AVATAR_EDITOR_CSS.CONTAINER }), autoInit);
	}

	protected buildUI(): void {
		const header = UDom.div({ className: AVATAR_EDITOR_CSS.HEADER });

		const models = UIcon.models();
		const head = UIcon.legoHead();
		const chest = UIcon.chest();
		const legs = UIcon.legs();

		UDom.AC(this.mainElement, UDom.AC(header, models, head, chest, legs));

		const content = UDom.div({ className: AVATAR_EDITOR_CSS.CONTENT });

		this.mainElement.appendChild(content);
	}

}