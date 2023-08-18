import { Model } from "../Model";
import { Scene } from "three";
import { AvatarData } from "../Avatar/AvatarData";
import { Vars } from "../../../Vars";
import { WorldFactory } from "./WorldFactory";

export enum WorldName {
	PALM_ISLAND = "Palm Island"
}

export type WorldConfig = {
	worldName: WorldName,

	avatarData?: AvatarData
};

export class World extends Model {

	private currentWorld!: Model | null;

	public constructor() {
		super();
	}

	public init(): void {

	}

	public async load(scene: Scene): Promise<void> {
		this.currentWorld = WorldFactory.create(Vars.CURRENT_WORLD);

		if (this.currentWorld) {
			this.currentWorld.init();
			return this.currentWorld.load(scene);
		}

		return Promise.resolve();
	}

	public update(): void {
	}


	public animate(): void {
	}

}