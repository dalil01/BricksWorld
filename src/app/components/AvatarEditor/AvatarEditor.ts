import "./AvatarEditor.css"

import { Component } from "../Component";
import { UDom } from "../../utils/UDom";

enum AVATAR_EDITOR_CSS {
	CONTAINER = "avatar-editor-container"
}

export class AvatarEditor extends Component {

	public constructor(parentElement: HTMLElement, autoInit: boolean = false) {
		super(parentElement, UDom.CE("div", { className: AVATAR_EDITOR_CSS.CONTAINER }), autoInit);
	}

	protected buildUI(): void {
		this.mainElement.appendChild(UDom.CE("p", { innerText: "dds" }))
	}

}