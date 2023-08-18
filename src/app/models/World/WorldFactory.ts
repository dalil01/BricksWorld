import { WorldName } from "./World";
import { PalmIsland } from "./all/PalmIsland";
import { Model } from "../Model";

export class WorldFactory {

	public static create(worldName: WorldName): Model | null {
		switch (worldName) {
			case WorldName.PALM_ISLAND:
				return new PalmIsland();
				break;
		}

		return null;
	}

}