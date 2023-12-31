import { Manager } from "../Manager";
import { START_MENU_MIN_WIDTH, StartMenu } from "../../components/StartMenu/StartMenu";
import { Experience } from "../../Experience";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";

enum VIEW {
	START_MENU_MIN,
	START_MENU_MAX,
	WORLD
}

export class ViewManager extends Manager {

	private currentView: VIEW = VIEW.START_MENU_MIN;

	private header: Header;
	private startMenu: StartMenu;
	private footer: Footer;

	public constructor() {
		super();
		this.header = new Header(document.body);
		this.startMenu = new StartMenu(document.body);
		this.footer = new Footer(document.body);
	}

	public getCurrentView(): VIEW {
		return this.currentView;
	}

	public override start(): void {
		this.header.init();

		if (this.isStartMenuView()) {
			this.startMenu.init();
		} else {
			this.switchToWorldView();
		}

		this.footer.init();
	}

	public override stop(): void {
		this.startMenu.destroy();
	}

	public override update(): void {
		if (this.isStartMenuView()) {
			this.autoSetCurrentView();
		}
	}

	public override animate(): void {
	}

	public isStartMenuView(): boolean {
		return this.currentView === VIEW.START_MENU_MIN || this.currentView === VIEW.START_MENU_MAX;
	}

	public isStartMenuMinView(): boolean {
		return this.currentView === VIEW.START_MENU_MIN;
	}

	public isWorldView(): boolean {
		return this.currentView === VIEW.WORLD;
	}

	private autoSetCurrentView(): void {
		const sizes = Experience.get().getSizes();

		if (sizes.w > START_MENU_MIN_WIDTH) {
			sizes.w /= 2;
			this.currentView = VIEW.START_MENU_MAX;
		} else {
			this.currentView = VIEW.START_MENU_MIN;
		}
	}

	public switchToWorldView(): void {
		this.currentView = VIEW.WORLD;

		const experience = Experience.get();
		experience.updateRenderer();

		const modelManager = experience.getModelManager();
		const loader = experience.getLoader();
		const lightsManager = experience.getLightsManager();

		loader.show();
		modelManager.reload(experience.getScene()).then(() => {
			loader.hide();
			this.header.update();
			this.footer.update();
			lightsManager.update();
			modelManager.getAvatar()?.moveCameraToDefaultWorldView();
		});
	}

}