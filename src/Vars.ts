import { WorldName } from "./app/models/World/World";

const IMAGES_DIR = "images/";
const MODELS_DIR = "models/";

const AVATAR_DIR = MODELS_DIR + "avatar/";
const AVATAR_HAIRS_DIR = IMAGES_DIR + "avatar/hairs/";
const AVATAR_BROWS_DIR = IMAGES_DIR + "avatar/brows/";
const AVATAR_EYES_DIR = IMAGES_DIR + "avatar/eyes/";
const AVATAR_HEAD_EXTRAS_DIR = IMAGES_DIR + "avatar/head-extras/";

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
				},
				Hair4: {
					IMG: AVATAR_HAIRS_DIR + "Hair4.png",
					COLOR: "#085FAC"
				},
				Hair5: {
					IMG: AVATAR_HAIRS_DIR + "Hair5.png",
					COLOR: "#E733DD"
				},
				Hair6: {
					IMG: AVATAR_HAIRS_DIR + "Hair6.png",
					COLOR: "#0ED621"
				},
				Hair7: {
					IMG: AVATAR_HAIRS_DIR + "Hair7.png",
					COLOR: "#640202"
				}
			},
			BROWS: {
				Brows1: {
					IMG: AVATAR_BROWS_DIR + "Brows1.png"
				},
				Brows2: {
					IMG: AVATAR_BROWS_DIR + "Brows2.png"
				},
				Brows3: {
					IMG: AVATAR_BROWS_DIR + "Brows3.png"
				},
				Brows4: {
					IMG: AVATAR_BROWS_DIR + "Brows4.png"
				},
				Brows5: {
					IMG: AVATAR_BROWS_DIR + "Brows5.png"
				},
				Brows6: {
					IMG: AVATAR_BROWS_DIR + "Brows6.png"
				}
			},
			EYES: {
				Eyes1: {
					IMG: AVATAR_EYES_DIR + "Eyes1.png"
				},
				Eyes2: {
					IMG: AVATAR_EYES_DIR + "Eyes2.png"
				},
				Eyes3: {
					IMG: AVATAR_EYES_DIR + "Eyes3.png"
				},
				Eyes4: {
					IMG: AVATAR_EYES_DIR + "Eyes4.png"
				},
				Eyes5: {
					IMG: AVATAR_EYES_DIR + "Eyes5.png"
				},
				Eyes6: {
					IMG: AVATAR_EYES_DIR + "Eyes6.png"
				}
			},

			HEAD_EXTRAS: {
				HeadExtra1Glasses: {
					IMG: AVATAR_HEAD_EXTRAS_DIR + "HeadExtra1Glasses.png"
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