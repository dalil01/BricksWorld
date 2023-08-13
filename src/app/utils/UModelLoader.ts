import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { Vars } from "../../Vars";

export class UModelLoader {

	public static loadGLTF(url: string, onLoad: (gltf: GLTF) => void, onProgress?: ((event: ProgressEvent) => void) | undefined, onError?: ((event: ErrorEvent) => void) | undefined): void {
		const dracoLoader = new DRACOLoader();
		dracoLoader.setDecoderPath(Vars.PATH.DRACO);

		const gltfLoader = new GLTFLoader();
		gltfLoader.setDRACOLoader(dracoLoader);

		gltfLoader.load(url, onLoad, onProgress, onError);
	}

}