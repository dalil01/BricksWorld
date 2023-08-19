import "./Footer.css";

import { Component } from "../Component";
import { UDom } from "../../utils/UDom";
import { Vars } from "../../../Vars";
import { UIcon } from "../../utils/UIcon";

enum FOOTER_CSS {
	CONTAINER = "footer-container",
	LEFT = "footer-left",
	RIGHT = "footer-right",
	HELP_ICON = "footer-help-icon",
	HELP_POPOVER = "footer-help-popover",
	HELP_POPOVER_CONTENT = "footer-help-popover-content"
}

export class Footer extends Component {

	public constructor(parentElement: HTMLElement, autoInit: boolean = false) {
		super(parentElement, UDom.CE("div", { className: FOOTER_CSS.CONTAINER }), autoInit);
	}

	protected buildUI(): void {
		const leftContainer = UDom.div({ className: FOOTER_CSS.LEFT });

		if (Vars.CURRENT_WORLD) {
			//UDom.AC(leftContainer, );
		}

		const rightContainer = UDom.div({ className: FOOTER_CSS.RIGHT });

		if (Vars.CURRENT_WORLD) {
			const helpIcon = UIcon.help({
				className: FOOTER_CSS.HELP_ICON,
				title: "Help ?"
			});

			const popoverContainer = UDom.div({ className: FOOTER_CSS.HELP_POPOVER });
			const popoverContent = UDom.div({ className: FOOTER_CSS.HELP_POPOVER_CONTENT });

			helpIcon.addEventListener("mouseover", () => {
				popoverContainer.style.display = "block";
			});

			helpIcon.addEventListener("mouseleave", () => {
				popoverContainer.style.display = "none";
			});

			const title = UDom.h3({ innerText: "Controls" });

			const displacement = UDom.h4({ innerText: "Displacement:" });

			const moveForward = UDom.p({ innerText: "z or ArrowUp : Move forward" });
			const moveBackward = UDom.p({ innerText: "s or ArrowDown : Move backward" });
			const moveLeft = UDom.p({ innerText: "q or ArrowLeft : Move left" });
			const moveRight = UDom.p({ innerText: "d or ArrowRight : Move right" });
			const jump = UDom.p({ innerText: "Space : Jump" });

			const camera = UDom.h4({ innerText: "Camera:" });

			const one = UDom.p({ innerText: "1 : First person" });
			const two = UDom.p({ innerText: "2 : Overview" });
			const three = UDom.p({ innerText: "3 : Third person" });

			UDom.AC(
				popoverContent, title,
				displacement, moveForward, moveBackward, moveLeft, moveRight, jump,
				camera, one, two, three
			);
			UDom.AC(popoverContainer, popoverContent);
			UDom.AC(rightContainer, UDom.AC(helpIcon, popoverContainer));
		}

		UDom.AC(this.mainElement, leftContainer, rightContainer);
	}

}