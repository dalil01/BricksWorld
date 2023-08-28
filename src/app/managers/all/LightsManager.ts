import { Manager } from "../Manager";
import { Scene } from "three";
import { Vars } from "../../../Vars";
import { AvatarLights } from "../../models/Avatar/AvatarLights";
import { PalmIslandLights } from "../../models/World/all/PalmIslandLights";
import { WorldName } from "../../models/World/World";
import { IModelLights } from "../../models/IModelLights";

export class LightsManager extends Manager {

	private readonly scene: Scene;

	private readonly avatarLights: IModelLights;
	private readonly palmIslandLights: IModelLights;

	private currentLights: undefined | IModelLights;

	public constructor(scene: Scene) {
		super();
		this.scene = scene;
		this.avatarLights = new AvatarLights();
		this.palmIslandLights = new PalmIslandLights();
	}

	public start(): void {
		this.handleLights();
	}

	public stop(): void {
	}

	public update(): void {
		this.currentLights?.stop(this.scene);
		this.handleLights();
	}

	public animate(): void {
	}

	private handleLights(): void {
		if (!Vars.CURRENT_WORLD) {
			this.avatarLights.start(this.scene);
			this.currentLights = this.avatarLights;
		} else {
			switch (Vars.CURRENT_WORLD) {
				case WorldName.PALM_ISLAND:
					this.palmIslandLights.start(this.scene);
					this.currentLights = this.palmIslandLights;
					break;
			}
		}
	}

}