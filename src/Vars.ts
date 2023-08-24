import { WorldName } from "./app/models/World/World";

const IMAGES_DIR = "images/";
const MODELS_DIR = "models/";

const AVATAR_DIR = MODELS_DIR + "avatar/";
const AVATAR_HAIRS_DIR = IMAGES_DIR + "avatar/hairs/";

const SEA_DIR = MODELS_DIR + "sea/";
const ISLAND_DIR = MODELS_DIR + "island/";

const ICONS_DIR = "./icons/";

export class Vars {

	public static DEBUG_MODE: boolean = false;

	public static CURRENT_WORLD: WorldName | null;

	public static PATH = {
		DRACO: "draco/",
		AVATAR: {
			MODEL: AVATAR_DIR + "Avatar.glb",
			HAIRS: {
				Hair1: {
					IMG: AVATAR_HAIRS_DIR + "Hair1.png",
					COLOR: "#5b3c11"
				},
				Hair2: {
					IMG: AVATAR_HAIRS_DIR + "Hair2.png",
					COLOR: "#000000"
				},
				Hair3: {
					IMG: AVATAR_HAIRS_DIR + "Hair3.png",
					COLOR: "#4C241F"
				}
			}
		},
		SEA: {
			MODEL: SEA_DIR + "Sea.glb"
		},
		ISLAND: {
			PALM_MODEL: ISLAND_DIR + "IslandPalm.glb"
		}
	};

	public static ICONS = {
		CLOSE: ICONS_DIR + "close-circle.svg"
	};

}