import "./Footer.css";

import { Component } from "../Component";
import { UDom } from "../../utils/UDom";
import { Vars } from "../../../Vars";
import { UIcon } from "../../utils/UIcon";

enum FOOTER_CSS {
	CONTAINER = "footer-container",
	LEFT = "footer-left",
	CENTER = "footer-center",
	RIGHT = "footer-right",
	HELP_ICON = "footer-help-icon",
	HELP_CLOSE_POPOVER_ICON = "footer-popover-help-icon",
	HELP_POPOVER = "footer-help-popover",
	HELP_POPOVER_CONTENT = "footer-help-popover-content",
	HELP_POPOVER_TITLE = "footer-help-popover-title",
	HELP_POPOVER_SUB_TITLE = "footer-help-popover-sub-title",
	HELP_POPOVER_CONTROL = "footer-help-popover-control",
}

export class Footer extends Component {

	public constructor(parentElement: HTMLElement, autoInit: boolean = false) {
		super(parentElement, UDom.CE("div", { className: FOOTER_CSS.CONTAINER }), autoInit);
	}

	protected buildUI(): void {
		this.buildLeft();
		this.buildCenter();
		this.buildRight();
	}

	private buildLeft(): void {
		const leftContainer = UDom.div({ className: FOOTER_CSS.LEFT });

		if (Vars.CURRENT_WORLD) {
			//UDom.AC(leftContainer, );
		}

		this.mainElement.appendChild(leftContainer);
	}

	private buildCenter(): void {
		if (Vars.CURRENT_WORLD) {
			return;
		}

		const centerContainer = UDom.div({ className: FOOTER_CSS.CENTER });

		const text = UDom.p({ innerText: "Inspired by LEGO" })
		UDom.AC(centerContainer, text);

		this.mainElement.appendChild(centerContainer);
	}

	private buildRight(): void {
		const rightContainer = UDom.div({ className: FOOTER_CSS.RIGHT });

		if (Vars.CURRENT_WORLD) {
			const helpIcon = UIcon.help({ className: FOOTER_CSS.HELP_ICON });

			const popoverContainer = UDom.div({ className: FOOTER_CSS.HELP_POPOVER });
			const popoverContent = UDom.div({ className: FOOTER_CSS.HELP_POPOVER_CONTENT });

			const HELP_SEEN_LS_KEY = "help_seen";

			const subscribeToListeners = () => {
				helpIcon.addEventListener("mouseover", () => {
					popoverContainer.style.display = "block";
				});

				helpIcon.addEventListener("mouseleave", () => {
					popoverContainer.style.display = "none";
				});
			}

			if (String(localStorage.getItem(HELP_SEEN_LS_KEY)) == "true") {
				popoverContainer.style.display = "none";
				subscribeToListeners();
			} else {
				popoverContainer.style.display = "block";

				const closePopoverIcon = UIcon.close({ className: FOOTER_CSS.HELP_CLOSE_POPOVER_ICON });
				closePopoverIcon.addEventListener("click", () => {
					popoverContainer.style.display = "none";
					localStorage.setItem(HELP_SEEN_LS_KEY, "true");
					popoverContainer.removeChild(closePopoverIcon);
					subscribeToListeners();
				});
				popoverContainer.appendChild(closePopoverIcon);
			}

			const title = UDom.h3({ className: FOOTER_CSS.HELP_POPOVER_TITLE, innerText: "Controls" });

			const displacement = UDom.h4({ className: FOOTER_CSS.HELP_POPOVER_SUB_TITLE, innerText: "Displacement" });

			const moveForward = UDom.span({ className: FOOTER_CSS.HELP_POPOVER_CONTROL });
			const moveForwardControl = UDom.p({ innerText: "z or ArrowUp:" });
			const moveForwardDescription = UDom.p({ innerText: "Move forward" });
			UDom.AC(moveForward, moveForwardControl, moveForwardDescription);

			const moveBackward = UDom.span({ className: FOOTER_CSS.HELP_POPOVER_CONTROL });
			const moveBackwardControl = UDom.p({ innerText: "s or ArrowDown:" });
			const moveBackwardDescription = UDom.p({ innerText: "Move backward" });
			UDom.AC(moveBackward, moveBackwardControl, moveBackwardDescription);

			const moveLeft = UDom.span({ className: FOOTER_CSS.HELP_POPOVER_CONTROL });
			const moveLeftControl = UDom.p({ innerText: "q or ArrowLeft:" });
			const moveLeftDescription = UDom.p({ innerText: "Move left" });
			UDom.AC(moveLeft, moveLeftControl, moveLeftDescription);

			const moveRight = UDom.span({ className: FOOTER_CSS.HELP_POPOVER_CONTROL });
			const moveRightControl = UDom.p({ innerText: "d or ArrowRight :" });
			const moveRightDescription = UDom.p({ innerText: "Move right" });
			UDom.AC(moveRight, moveRightControl, moveRightDescription);

			const run = UDom.span({ className: FOOTER_CSS.HELP_POPOVER_CONTROL });
			const runControl = UDom.p({ innerText: "Shift:" });
			const runDescription = UDom.p({ innerText: "Run" });
			UDom.AC(run, runControl, runDescription);

			const jump = UDom.span({ className: FOOTER_CSS.HELP_POPOVER_CONTROL });
			const jumpControl = UDom.p({ innerText: "Space:" });
			const jumpDescription = UDom.p({ innerText: "Jump" });
			UDom.AC(jump, jumpControl, jumpDescription);

			const camera = UDom.h4({ className: FOOTER_CSS.HELP_POPOVER_SUB_TITLE, innerText: "Camera" });

			const one = UDom.span({ className: FOOTER_CSS.HELP_POPOVER_CONTROL });
			const oneControl = UDom.p({ innerText: "1:" });
			const oneDescription = UDom.p({ innerText: "First person" });
			UDom.AC(one, oneControl, oneDescription);

			const two = UDom.span({ className: FOOTER_CSS.HELP_POPOVER_CONTROL });
			const twoControl = UDom.p({ innerText: "2:" });
			const twoDescription = UDom.p({ innerText: "Third person" });
			UDom.AC(two, twoControl, twoDescription);

			const three = UDom.span({ className: FOOTER_CSS.HELP_POPOVER_CONTROL });
			const threeControl = UDom.p({ innerText: "3:" });
			const threeDescription = UDom.p({ innerText: "Overview" });
			UDom.AC(three, threeControl, threeDescription);

			UDom.AC(
				popoverContent, title,
				displacement, moveForward, moveLeft, moveBackward, moveRight, run, jump,
				camera, one, two, three
			);

			UDom.AC(popoverContainer, popoverContent);
			UDom.AC(rightContainer, UDom.AC(helpIcon, popoverContainer));
		}

		this.mainElement.appendChild(rightContainer);
	}

}