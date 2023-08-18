import { WorldConfig, WorldName } from "./World";
import { Model } from "../Model";
import { PalmIsland } from "./all/PalmIsland";

export class WorldFactory {

	public static create(config: WorldConfig): Model | null {
		switch (config.world) {
			case WorldName.PALM_ISLAND:
				return new PalmIsland();
				break;
		}

		return null;
	}

}