import { Model } from "../Model";
import { Scene } from "three";
import { UModelLoader } from "../../utils/UModelLoader";
import { Vars } from "../../../Vars";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

export class Island extends Model {

	public constructor() {
		super();
	}


	init(): void {
	}

	load(scene: Scene): Promise<void> {
		return new Promise((resolve, reject) => {
			UModelLoader.loadGLTF(Vars.PATH.ISLAND.PALM_MODEL, (gltf: GLTF) => {
				this.model = gltf.scene;

				scene.add(this.model);

				resolve();
			}, undefined, () => reject());
		});
	}

	update(): void {
	}

	animate(): void {
	}


}