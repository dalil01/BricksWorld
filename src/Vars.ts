import { WorldName } from "./app/models/World/World";

const IMAGES_DIR = "images/";
const MODELS_DIR = "models/";

const AVATAR_IMAGES_DIR = IMAGES_DIR + "avatar/";
const AVATAR_MODELS_DIR = MODELS_DIR + "avatar/";

const AVATAR_HEAD_DIR = AVATAR_IMAGES_DIR + "head/";
const AVATAR_HAIRS_DIR = AVATAR_HEAD_DIR + "hairs/";
const AVATAR_BROWS_DIR = AVATAR_HEAD_DIR + "brows/";
const AVATAR_EYES_DIR = AVATAR_HEAD_DIR + "eyes/";
const AVATAR_MOUTHS_DIR = AVATAR_HEAD_DIR + "mouths/";
const AVATAR_HEAD_EXTRAS_DIR = AVATAR_HEAD_DIR + "head-extras/";

const AVATAR_CHEST_DIR = AVATAR_IMAGES_DIR + "chest/";

const AVATAR_LEGS_DIR = AVATAR_IMAGES_DIR + "legs/";

const SEA_DIR = MODELS_DIR + "sea/";
const ISLAND_DIR = MODELS_DIR + "island/";

const ICONS_DIR = "./icons/";

export class Vars {

	public static DEBUG_MODE: boolean = false;

	public static CURRENT_WORLD: WorldName | null;

	public static PATH = {
		DRACO: "draco/",
		AVATAR: {
			MODEL: AVATAR_MODELS_DIR + "Avatar.glb",
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
			MOUTHS: {
				Mouth1: {
					IMG: AVATAR_MOUTHS_DIR + "Mouth1.png"
				},
				Mouth2: {
					IMG: AVATAR_MOUTHS_DIR + "Mouth2.png"
				},
				Mouth3: {
					IMG: AVATAR_MOUTHS_DIR + "Mouth3.png"
				},
				Mouth4: {
					IMG: AVATAR_MOUTHS_DIR + "Mouth4.png"
				},
				Mouth5: {
					IMG: AVATAR_MOUTHS_DIR + "Mouth5.png"
				},
				Mouth6: {
					IMG: AVATAR_MOUTHS_DIR + "Mouth6.png"
				}
			},
			HEAD_EXTRAS: {
				HeadExtra1Glasses: {
					IMG: AVATAR_HEAD_EXTRAS_DIR + "HeadExtra1Glasses.png"
				}
			},
			CHESTS: {
				Chest1: {
					IMG: AVATAR_CHEST_DIR + "Chest1.png"
				},
				Chest2: {
					IMG: AVATAR_CHEST_DIR + "Chest2.png"
				},
				Chest3: {
					IMG: AVATAR_CHEST_DIR + "Chest3.png"
				},
				Chest4: {
					IMG: AVATAR_CHEST_DIR + "Chest4.png"
				},
				Chest5: {
					IMG: AVATAR_CHEST_DIR + "Chest5.png"
				},
				Chest6: {
					IMG: AVATAR_CHEST_DIR + "Chest6.png"
				},
				Chest7: {
					IMG: AVATAR_CHEST_DIR + "Chest7.png"
				},
				Chest8: {
					IMG: AVATAR_CHEST_DIR + "Chest8.png"
				},
				Chest9: {
					IMG: AVATAR_CHEST_DIR + "Chest9.png"
				},
				Chest10: {
					IMG: AVATAR_CHEST_DIR + "Chest10.png"
				}
			},
			lEGS: {
				Legs1: {
					IMG: AVATAR_LEGS_DIR + "Legs1.png"
				},
				Legs2: {
					IMG: AVATAR_LEGS_DIR + "Legs2.png"
				}
			},
			MODELS: {
				Model1: {
					IMG: AVATAR_MODELS_DIR + "Model1.png",
					data: {
						color: "#FFCF00",
						hair: {
							name: "Hair1",
							color: "#0c0a09"
						},
						brows: {
							name: "Brows4",
							color: "#000000"
						},
						eyes: {
							name: "Eyes6",
							color: "#000000"
						},
						mouth: {
							name: "Mouth1",
							color: "#0d0c0c"
						},
						chest: {
							name: "Chest5",
							color: "#c4bbb5",
							obj1Color: "#705df2"
						},
						legs: {
							color: "#705df2"
						}
					}
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