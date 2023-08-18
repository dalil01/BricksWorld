import { Model } from "../Model";
import { Scene } from "three";
import { PalmIsland } from "./all/PalmIsland";
import { Sky } from "../Sky/Sky";
import { Sea } from "../Sea/Sea";

export enum WorldName {
	PALM_ISLAND = "PalmIsland"
}

export type WorldConfig = {
	world: WorldName,

}

export class World extends Model {

	private readonly sky: Sky;
	private readonly sea: Sea;
	private readonly island: PalmIsland;

	public constructor() {
		super();
		this.sky = new Sky();
		this.sea = new Sea();
		this.island = new PalmIsland();
	}

	public init(): void {
		this.sky.init();
		this.sea.init();
		this.island.init();
	}

	public async load(scene: Scene): Promise<void> {
		await this.sky.load(scene);
		await this.sea.load(scene);
		await this.island.load(scene);

		//return Promise.resolve(undefined);
	}

	public update(): void {
	}


	public animate(): void {
	}

}