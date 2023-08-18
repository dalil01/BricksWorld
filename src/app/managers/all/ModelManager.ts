import { Avatar } from "../../models/avatar/Avatar";
import { Scene } from "three";
import { Manager } from "../Manager";
import { World } from "../../models/World/World";

export class ModelManager extends Manager {

	private readonly avatar: Avatar;
	private readonly world: World;

	public constructor() {
		super();
		this.avatar = new Avatar();
		this.world = new World();
	}

	public getAvatar(): Avatar {
		return this.avatar;
	}

	public override start(): void {
		this.avatar.init();
		this.world.init();
	}

	public override stop(): void {
	}

	public override update(): void {
		this.avatar.update();
		this.world.update();
	}

	public async load(scene: Scene): Promise<void> {
		await this.avatar.load(scene);
		await this.world.load(scene);
	}

	public override animate(): void {
		this.avatar.animate();
		this.world.animate();
	}

}