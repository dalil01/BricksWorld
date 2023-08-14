import { Avatar } from "../../models/avatar/Avatar";
import { Scene } from "three";
import { Experience, Sizes } from "../../Experience";
import { Manager } from "../Manager";
import { Sky } from "../../models/sky/Sky";
import { Sea } from "../../models/Sea/Sea";
import { Island } from "../../models/Island/Island";

export class ModelManager extends Manager {

	private readonly sky: Sky;
	private readonly sea: Sea;
	private readonly avatar: Avatar;
	private readonly island: Island;

	public constructor() {
		super();
		this.sky = new Sky();
		this.sea = new Sea();
		this.avatar = new Avatar();
		this.island = new Island();
	}

	public getAvatar(): Avatar {
		return this.avatar;
	}

	public override start(): void {
		this.sky.init();
		this.sea.init();
		this.avatar.init();
		this.island.init();
	}

	public override stop(): void {
	}

	public override update(): void {
		this.avatar.update();
	}

	public async load(scene: Scene): Promise<void> {
		await this.sky.load(scene);
		await this.sea.load(scene);
		await this.avatar.load(scene);
		await this.island.load(scene);
	}

	public override animate(): void {
		this.avatar.animate();
	}

}