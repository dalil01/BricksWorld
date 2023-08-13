const MODELS_DIR = "models/";
const AVATAR_DIR = MODELS_DIR + "avatar/";
const SEA_DIR = MODELS_DIR + "sea/";

export class Vars {

	public static PATH = {
		DRACO: "draco/",
		AVATAR: {
			MODEL: AVATAR_DIR + "Avatar.glb"
		},
		SEA: {
			MODEL: SEA_DIR + "Sea.glb"
		}
	};

	public static DEBUG_MODE: boolean = true;

}