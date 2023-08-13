import { Avatar } from "../../models/avatar/Avatar";
import { Scene } from "three";
import { Experience, Sizes } from "../../Experience";
import { Manager } from "../Manager";
import { Sky } from "../../models/sky/Sky";

export class ModelManager extends Manager {

	private readonly sky: Sky;
	private readonly avatar: Avatar;

	public constructor() {
		super();
		this.sky = new Sky();
		this.avatar = new Avatar();
	}

	public getAvatar(): Avatar {
		return this.avatar;
	}

	public override start(): void {
		this.sky.init();
		this.avatar.init();
	}

	public override stop(): void {
	}

	public override update(): void {
		this.avatar.update();
	}

	public async load(scene: Scene): Promise<void> {
		await this.sky.load(scene);
		await this.avatar.load(scene);
	}

	public override animate(): void {
		this.avatar.animate();
	}

}